import { useState } from 'react';
import { useActiveAccount, useSendTransaction, useReadContract } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { parseUnits, formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { ERC20_ABI } from '../lib/abis/erc20';
import { TOKENS, type TokenSymbol } from '../lib/contracts';
import { decodeError } from '../lib/errors';

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const FAUCET_AMOUNTS: Record<TokenSymbol, string> = {
  USDC: '10000',
  WETH: '5',
  WBTC: '0.5',
  ARB:  '1000',
  DAI:  '10000',
};

// ── Cooldown helpers (per wallet + token) ─────────────────────────────────────
function cooldownKey(wallet: string, symbol: TokenSymbol) {
  return `faucet_cooldown_${wallet.toLowerCase()}_${symbol}`;
}

export function getCooldownRemaining(wallet: string, symbol: TokenSymbol): number {
  const raw = localStorage.getItem(cooldownKey(wallet, symbol));
  if (!raw) return 0;
  const elapsed = Date.now() - parseInt(raw, 10);
  return Math.max(0, COOLDOWN_MS - elapsed);
}

function setCooldown(wallet: string, symbol: TokenSymbol) {
  localStorage.setItem(cooldownKey(wallet, symbol), Date.now().toString());
}

export function formatCooldown(ms: number): string {
  if (ms <= 0) return '';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ── Per-token balance ─────────────────────────────────────────────────────────
export function useTokenBalance(symbol: TokenSymbol) {
  const account = useActiveAccount();
  const token = TOKENS[symbol];
  const contract = getContract({ client, chain: arbitrumSepolia, address: token.address, abi: ERC20_ABI });

  const { data, isLoading, refetch } = useReadContract({
    contract,
    method: 'balanceOf',
    params: [account?.address ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!account?.address, refetchInterval: 15_000 },
  });

  const raw = (data as bigint | undefined) ?? 0n;
  return {
    raw,
    formatted: parseFloat(formatUnits(raw, token.decimals)).toLocaleString(undefined, {
      maximumFractionDigits: token.decimals === 8 ? 6 : token.decimals === 18 ? 4 : 2,
    }),
    isLoading,
    refetch,
  };
}

// ── Mint hook ─────────────────────────────────────────────────────────────────
export type FaucetStatus = 'idle' | 'pending' | 'success' | 'error';

export function useMintToken(symbol: TokenSymbol) {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<FaucetStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const token = TOKENS[symbol];
  const contract = getContract({ client, chain: arbitrumSepolia, address: token.address, abi: ERC20_ABI });

  const mint = async () => {
    if (!account?.address) { setError('Connect your wallet first'); return; }

    const remaining = getCooldownRemaining(account.address, symbol);
    if (remaining > 0) { setError(`Cooldown active: ${formatCooldown(remaining)}`); return; }

    try {
      setStatus('pending');
      setError(null);
      const amount = parseUnits(FAUCET_AMOUNTS[symbol], token.decimals);
      const result = await sendTx(prepareContractCall({
        contract,
        method: 'mint',
        params: [account.address, amount],
      }));
      setTxHash(result.transactionHash);
      setCooldown(account.address, symbol);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(decodeError(e));
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { mint, status, error, txHash, reset };
}
