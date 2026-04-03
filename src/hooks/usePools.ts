import { useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall, readContract } from 'thirdweb';
import { formatUnits, parseUnits } from 'viem';
import { useState } from 'react';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { PAIR_ABI } from '../lib/abis/pair';
import { VAULT_ABI } from '../lib/abis/vault';
import { FACTORY_ABI } from '../lib/abis/factory';
import { ROUTER_ABI } from '../lib/abis/router';
import { ERC20_ABI } from '../lib/abis/erc20';
import { POSITION_MANAGER_ABI } from '../lib/abis/positionManager';
import { ADDRESSES, TOKENS, PAIRS, type PairKey, type TokenSymbol } from '../lib/contracts';

// ── Contract helpers ──────────────────────────────────────────────────────────
function pairContract(addr: `0x${string}`) {
  return getContract({ client, chain: arbitrumSepolia, address: addr, abi: PAIR_ABI });
}
function tokenContract(addr: `0x${string}`) {
  return getContract({ client, chain: arbitrumSepolia, address: addr, abi: ERC20_ABI });
}
const vaultContract   = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.vault,           abi: VAULT_ABI });
const factoryContract = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.factory,         abi: FACTORY_ABI });
const routerContract  = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.router,          abi: ROUTER_ABI });
const pmContract      = getContract({ client, chain: arbitrumSepolia, address: ADDRESSES.positionManager, abi: POSITION_MANAGER_ABI });

// ── Per-pair on-chain data ────────────────────────────────────────────────────
export function usePairData(pairKey: PairKey) {
  const account = useActiveAccount();
  const pair    = PAIRS[pairKey];
  const t0      = TOKENS[pair.token0 as TokenSymbol];
  const t1      = TOKENS[pair.token1 as TokenSymbol];
  const pc      = pairContract(pair.address);

  // Reserves
  const { data: reserves, isLoading: rLoading } = useReadContract({
    contract: pc, method: 'getReserves', params: [],
    queryOptions: { refetchInterval: 15_000 },
  });

  // Total LP supply
  const { data: totalSupply } = useReadContract({
    contract: pc, method: 'totalSupply', params: [],
    queryOptions: { refetchInterval: 15_000 },
  });

  // User LP balance
  const { data: userLp } = useReadContract({
    contract: pc, method: 'balanceOf',
    params: [account?.address ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!account?.address, refetchInterval: 10_000 },
  });

  // Vault health
  const { data: vaultHealth } = useReadContract({
    contract: vaultContract, method: 'getPoolHealth',
    params: [pair.address],
    queryOptions: { refetchInterval: 15_000 },
  });

  // Factory tier config (fees)
  const { data: tierConfig } = useReadContract({
    contract: factoryContract, method: 'getPairConfig',
    params: [pair.address],
    queryOptions: { refetchInterval: 60_000 },
  });

  // IL position
  const { data: ilPos } = useReadContract({
    contract: pmContract, method: 'getPosition',
    params: [pair.address, account?.address ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!account?.address, refetchInterval: 15_000 },
  });

  // ── Derived values ──────────────────────────────────────────────────────────
  const res0 = (reserves as readonly [bigint, bigint, number] | undefined)?.[0] ?? 0n;
  const res1 = (reserves as readonly [bigint, bigint, number] | undefined)?.[1] ?? 0n;
  const supply = (totalSupply as bigint | undefined) ?? 0n;
  const userLpRaw = (userLp as bigint | undefined) ?? 0n;

  const vh = vaultHealth as readonly [bigint, bigint, bigint, bigint, bigint] | undefined;
  const usdcReserve    = vh?.[0] ?? 0n;
  const stakerDeposits = vh?.[1] ?? 0n;
  const utilizationBps = vh?.[3] ?? 0n;
  const totalExposure  = vh?.[4] ?? 0n;

  const tc = tierConfig as readonly [bigint, bigint, bigint, bigint] | undefined;
  const vaultFeeBps    = Number(tc?.[0] ?? 15n);
  const treasuryFeeBps = Number(tc?.[1] ?? 10n);
  const lpFeeBps       = Number(tc?.[2] ?? 30n);

  const pos = ilPos as { liquidity: bigint; valueAtDeposit: bigint; timestamp: bigint } | undefined;
  const posLiquidity      = pos?.liquidity      ?? 0n;
  const posValueAtDeposit = pos?.valueAtDeposit ?? 0n;
  const posTimestamp      = pos?.timestamp      ?? 0n;
  const secondsInPool     = posTimestamp > 0n ? BigInt(Math.floor(Date.now() / 1000)) - posTimestamp : 0n;
  const daysInPool        = Math.floor(Number(secondsInPool) / 86400);

  // TVL: reserve0 in token0 units + reserve1 in token1 units
  // For USDC pairs: reserve1 is USDC (6 dec) → direct USD value
  const reserve0Fmt = parseFloat(formatUnits(res0, t0.decimals));
  const reserve1Fmt = parseFloat(formatUnits(res1, t1.decimals));

  // User's share of pool
  const userSharePct = supply > 0n ? Number(userLpRaw) / Number(supply) : 0;
  const userToken0   = reserve0Fmt * userSharePct;
  const userToken1   = reserve1Fmt * userSharePct;

  // IL coverage: scales linearly 0→100% over 240 days (from contract logic)
  const maxCoverageBps = Number(tc?.[3] ?? 10000n);
  const coveragePct = daysInPool >= 240
    ? maxCoverageBps / 100
    : (daysInPool / 240) * (maxCoverageBps / 100);

  return {
    pairKey,
    pair,
    t0, t1,
    // Reserves
    res0, res1,
    reserve0Fmt: reserve0Fmt.toFixed(4),
    reserve1Fmt: reserve1Fmt.toFixed(2),
    // Supply
    supply,
    // Vault
    usdcReserve,
    stakerDeposits,
    utilizationPct: Number(utilizationBps) / 100,
    totalExposure,
    usdcReserveFmt: parseFloat(formatUnits(usdcReserve, 6)).toFixed(2),
    // Fees
    vaultFeeBps, treasuryFeeBps, lpFeeBps,
    totalFeeBps: vaultFeeBps + treasuryFeeBps + lpFeeBps,
    // User LP
    userLpRaw,
    userLpFmt: parseFloat(formatUnits(userLpRaw, 18)).toFixed(6),
    hasPosition: userLpRaw > 0n,
    userSharePct,
    userToken0: userToken0.toFixed(6),
    userToken1: userToken1.toFixed(2),
    // IL position
    posLiquidity,
    posValueAtDeposit,
    posValueFmt: parseFloat(formatUnits(posValueAtDeposit, 6)).toFixed(2),
    daysInPool,
    coveragePct: coveragePct.toFixed(1),
    isLoading: rLoading,
  };
}

// ── Add liquidity ─────────────────────────────────────────────────────────────
export type LiquidityStatus = 'idle' | 'approving_a' | 'approving_b' | 'adding' | 'success' | 'error';

export function useAddLiquidity() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<LiquidityStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  const add = async (
    pairKey: PairKey,
    amountA: string,
    amountB: string,
    slippageBps = 50,
    deadlineMinutes = 20,
  ) => {
    if (!account?.address) { setError('Wallet not connected'); return; }

    const pair   = PAIRS[pairKey];
    const t0     = TOKENS[pair.token0 as TokenSymbol];
    const t1     = TOKENS[pair.token1 as TokenSymbol];
    const parsedA = parseUnits(amountA, t0.decimals);
    const parsedB = parseUnits(amountB, t1.decimals);
    const minA    = parsedA * BigInt(10000 - slippageBps) / 10000n;
    const minB    = parsedB * BigInt(10000 - slippageBps) / 10000n;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineMinutes * 60);

    try {
      // Approve token A if needed
      const allowA = await readContract({
        contract: tokenContract(t0.address),
        method: 'allowance',
        params: [account.address, ADDRESSES.router],
      }) as bigint;
      if (allowA < parsedA) {
        setStatus('approving_a');
        await sendTx(prepareContractCall({
          contract: tokenContract(t0.address),
          method: 'approve',
          params: [ADDRESSES.router, parsedA],
        }));
      }

      // Approve token B if needed
      const allowB = await readContract({
        contract: tokenContract(t1.address),
        method: 'allowance',
        params: [account.address, ADDRESSES.router],
      }) as bigint;
      if (allowB < parsedB) {
        setStatus('approving_b');
        await sendTx(prepareContractCall({
          contract: tokenContract(t1.address),
          method: 'approve',
          params: [ADDRESSES.router, parsedB],
        }));
      }

      // Add liquidity
      setStatus('adding');
      const result = await sendTx(prepareContractCall({
        contract: routerContract,
        method: 'addLiquidity',
        params: [t0.address, t1.address, parsedA, parsedB, minA, minB, account.address, deadline],
      }));

      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(e instanceof Error ? e.message.split('(')[0].trim() : 'Transaction failed');
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { add, status, txHash, error, reset };
}

// ── Remove liquidity ──────────────────────────────────────────────────────────
export type RemoveStatus = 'idle' | 'approving' | 'removing' | 'success' | 'error';

export function useRemoveLiquidity() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus] = useState<RemoveStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  const remove = async (
    pairKey: PairKey,
    lpAmount: bigint,       // exact LP tokens to burn
    minA: bigint,           // min token0 out (slippage-adjusted)
    minB: bigint,           // min token1 out (slippage-adjusted)
    deadlineMinutes = 20,
  ) => {
    if (!account?.address) { setError('Wallet not connected'); return; }

    const pair    = PAIRS[pairKey];
    const t0      = TOKENS[pair.token0 as TokenSymbol];
    const t1      = TOKENS[pair.token1 as TokenSymbol];
    const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineMinutes * 60);
    const pc      = pairContract(pair.address);

    try {
      // Approve LP token to router
      const allowLp = await readContract({
        contract: pc,
        method: 'allowance',
        params: [account.address, ADDRESSES.router],
      }) as bigint;
      if (allowLp < lpAmount) {
        setStatus('approving');
        await sendTx(prepareContractCall({
          contract: pc,
          method: 'approve',
          params: [ADDRESSES.router, lpAmount],
        }));
      }

      // Remove liquidity
      setStatus('removing');
      const result = await sendTx(prepareContractCall({
        contract: routerContract,
        method: 'removeLiquidity',
        params: [t0.address, t1.address, lpAmount, minA, minB, account.address, deadline],
      }));

      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      setError(e instanceof Error ? e.message.split('(')[0].trim() : 'Transaction failed');
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { remove, status, txHash, error, reset };
}

// ── Quote for add liquidity (optimal ratio from reserves) ─────────────────────
export function useAddLiquidityQuote(pairKey: PairKey, amountA: string) {
  const pair = PAIRS[pairKey];
  const t0   = TOKENS[pair.token0 as TokenSymbol];
  const t1   = TOKENS[pair.token1 as TokenSymbol];
  const pc   = pairContract(pair.address);

  const { data: reserves } = useReadContract({
    contract: pc, method: 'getReserves', params: [],
    queryOptions: { refetchInterval: 10_000 },
  });

  const { data: supply } = useReadContract({
    contract: pc, method: 'totalSupply', params: [],
    queryOptions: { refetchInterval: 10_000 },
  });

  const res = reserves as readonly [bigint, bigint, number] | undefined;
  const res0 = res?.[0] ?? 0n;
  const res1 = res?.[1] ?? 0n;
  const totalSupply = (supply as bigint | undefined) ?? 0n;

  let amountB = '';
  let ratio   = 0;
  let estimatedLp = '';

  if (res0 > 0n && res1 > 0n && amountA && parseFloat(amountA) > 0) {
    try {
      const parsedA = parseUnits(amountA, t0.decimals);
      // router.quote: amountB = amountA * reserveB / reserveA
      const quotedB = (parsedA * res1) / res0;
      amountB = parseFloat(formatUnits(quotedB, t1.decimals)).toFixed(
        t1.decimals === 6 ? 2 : 6,
      );
      ratio = Number(formatUnits(res1, t1.decimals)) / Number(formatUnits(res0, t0.decimals));

      // Exact LP tokens: min(amountA * totalSupply / reserveA, amountB * totalSupply / reserveB)
      // This mirrors the Pair.mint() formula exactly
      if (totalSupply > 0n) {
        const lpFromA = (parsedA * totalSupply) / res0;
        const lpFromB = (quotedB * totalSupply) / res1;
        const lpMinted = lpFromA < lpFromB ? lpFromA : lpFromB;
        estimatedLp = parseFloat(formatUnits(lpMinted, 18)).toFixed(6);
      }
    } catch { /* ignore */ }
  }

  return { amountB, ratio, estimatedLp, t0, t1 };
}
