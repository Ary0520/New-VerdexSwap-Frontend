import { useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall, readContract } from 'thirdweb';
import { parseUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { VAULT_ABI } from '../lib/abis/vault';
import { ERC20_ABI } from '../lib/abis/erc20';
import { FEE_CONVERTER_ABI } from '../lib/abis/feeConverter';
import { ADDRESSES, TOKENS, type TokenSymbol } from '../lib/contracts';

import { decodeError } from '../lib/errors';

const vaultContract = getContract({
  client, chain: arbitrumSepolia,
  address: ADDRESSES.vault, abi: VAULT_ABI,
});
const converterContract = getContract({
  client, chain: arbitrumSepolia,
  address: ADDRESSES.feeConverter, abi: FEE_CONVERTER_ABI,
});

export type VaultTxStatus = 'idle' | 'approving' | 'pending' | 'success' | 'error';

// ── Stake USDC ────────────────────────────────────────────────────────────────
export function useStake() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<VaultTxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  const stake = async (pairAddress: `0x${string}`, amountUsdc: string) => {
    if (!account?.address) { setError('Wallet not connected'); return; }
    const parsed = parseUnits(amountUsdc, 6);
    const usdcToken = getContract({ client, chain: arbitrumSepolia, address: TOKENS.USDC.address, abi: ERC20_ABI });

    try {
      const allowance = await readContract({
        contract: usdcToken, method: 'allowance',
        params: [account.address, ADDRESSES.vault],
      }) as bigint;

      if (allowance < parsed) {
        setStatus('approving');
        await sendTx(prepareContractCall({
          contract: usdcToken, method: 'approve',
          params: [ADDRESSES.vault, parsed],
        }));
      }

      setStatus('pending');
      const result = await sendTx(prepareContractCall({
        contract: vaultContract, method: 'stake',
        params: [pairAddress, parsed],
      }));
      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(decodeError(e));
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { stake, status, txHash, error, reset };
}

// ── Request unstake ───────────────────────────────────────────────────────────
export function useRequestUnstake() {
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<VaultTxStatus>('idle');
  const [error,  setError]  = useState<string | null>(null);

  const request = async (pairAddress: `0x${string}`) => {
    try {
      setStatus('pending');
      await sendTx(prepareContractCall({
        contract: vaultContract, method: 'requestUnstake',
        params: [pairAddress],
      }));
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(decodeError(e));
    }
  };

  const reset = () => { setStatus('idle'); setError(null); };
  return { request, status, error, reset };
}

// ── Unstake (burn shares) ─────────────────────────────────────────────────────
export function useUnstake() {
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<VaultTxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  // sharesToBurn: pass the full shares amount from stakerPositions to unstake all
  const unstake = async (pairAddress: `0x${string}`, sharesToBurn: bigint) => {
    try {
      setStatus('pending');
      const result = await sendTx(prepareContractCall({
        contract: vaultContract, method: 'unstake',
        params: [pairAddress, sharesToBurn],
      }));
      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(decodeError(e));
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { unstake, status, txHash, error, reset };
}

// ── Harvest fees ──────────────────────────────────────────────────────────────
export function useHarvestFees() {
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<VaultTxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  const harvest = async (pairAddress: `0x${string}`) => {
    try {
      setStatus('pending');
      const result = await sendTx(prepareContractCall({
        contract: vaultContract, method: 'harvestFees',
        params: [pairAddress],
      }));
      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(decodeError(e));
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { harvest, status, txHash, error, reset };
}

// ── Convert fees ──────────────────────────────────────────────────────────────
export function useConvertFees() {
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<VaultTxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  const convert = async (pairAddress: `0x${string}`, tokenSymbol: TokenSymbol) => {
    try {
      setStatus('pending');
      const result = await sendTx(prepareContractCall({
        contract: converterContract, method: 'convert',
        params: [pairAddress, TOKENS[tokenSymbol].address],
      }));
      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(decodeError(e));
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { convert, status, txHash, error, reset };
}

