import { useState } from 'react';
import { useActiveAccount, useReadContract, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall, readContract } from 'thirdweb';
import { formatUnits, parseUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { ROUTER_ABI } from '../lib/abis/router';
import { FACTORY_ABI } from '../lib/abis/factory';
import { ERC20_ABI } from '../lib/abis/erc20';
import { PAIR_ABI } from '../lib/abis/pair';
import { ADDRESSES, TOKENS, PAIRS, type TokenSymbol, getPairAddress } from '../lib/contracts';

// ── Contract instances ────────────────────────────────────────────────────────
const routerContract = getContract({
  client, chain: arbitrumSepolia,
  address: ADDRESSES.router, abi: ROUTER_ABI,
});

const factoryContract = getContract({
  client, chain: arbitrumSepolia,
  address: ADDRESSES.factory, abi: FACTORY_ABI,
});

function tokenContract(address: `0x${string}`) {
  return getContract({ client, chain: arbitrumSepolia, address, abi: ERC20_ABI });
}

// ── Multi-hop path builder ────────────────────────────────────────────────────
// Tries direct path first. If no direct pair, routes through USDC or WETH as hub.
// Returns the best path as an array of token addresses.
function buildPath(fromSymbol: TokenSymbol, toSymbol: TokenSymbol): `0x${string}`[] {
  const from = TOKENS[fromSymbol];
  const to   = TOKENS[toSymbol];

  // Direct pair exists?
  if (getPairAddress(fromSymbol, toSymbol)) {
    return [from.address, to.address];
  }

  // Try routing through USDC
  if (
    fromSymbol !== 'USDC' && toSymbol !== 'USDC' &&
    getPairAddress(fromSymbol, 'USDC') &&
    getPairAddress('USDC', toSymbol)
  ) {
    return [from.address, TOKENS.USDC.address, to.address];
  }

  // Try routing through WETH
  if (
    fromSymbol !== 'WETH' && toSymbol !== 'WETH' &&
    getPairAddress(fromSymbol, 'WETH') &&
    getPairAddress('WETH', toSymbol)
  ) {
    return [from.address, TOKENS.WETH.address, to.address];
  }

  // Fallback: direct (will revert on-chain if no pair — caught in execute)
  return [from.address, to.address];
}

// ── Token balance ─────────────────────────────────────────────────────────────
export function useTokenBalance(symbol: TokenSymbol) {
  const account = useActiveAccount();
  const token = TOKENS[symbol];

  const { data, isLoading } = useReadContract({
    contract: tokenContract(token.address),
    method: 'balanceOf',
    params: [account?.address ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!account?.address, refetchInterval: 10_000 },
  });

  const raw = (data as bigint | undefined) ?? 0n;
  return {
    raw,
    formatted: parseFloat(formatUnits(raw, token.decimals)).toFixed(
      token.decimals === 6 ? 2 : 4,
    ),
    decimals: token.decimals,
    isLoading,
  };
}

// ── USD price from WETH/USDC pool ─────────────────────────────────────────────
// Returns how many USDC per 1 unit of the given token.
// For USDC itself returns 1. For WETH reads the pool directly.
// For others, chains through WETH price.
export function useUsdPrice(symbol: TokenSymbol): number {
  const wethUsdcPair = PAIRS['WETH/USDC'];

  const pairContract = getContract({
    client, chain: arbitrumSepolia,
    address: wethUsdcPair.address, abi: PAIR_ABI,
  });

  const { data } = useReadContract({
    contract: pairContract,
    method: 'getReserves',
    params: [],
    queryOptions: { refetchInterval: 15_000 },
  });

  const reserves = data as readonly [bigint, bigint, number] | undefined;
  if (!reserves) return 0;

  // WETH/USDC pair: token0=WETH (18 dec), token1=USDC (6 dec)
  // price = reserveUSDC / reserveWETH (adjusted for decimals)
  const wethPerUsdc = Number(formatUnits(reserves[0], 18)); // WETH reserve
  const usdcReserve = Number(formatUnits(reserves[1], 6));  // USDC reserve
  const wethPriceUsdc = wethPerUsdc > 0 ? usdcReserve / wethPerUsdc : 0;

  if (symbol === 'USDC' || symbol === 'DAI') return 1;
  if (symbol === 'WETH') return wethPriceUsdc;

  // For WBTC, ARB: would need their respective USDC pairs
  // For now return 0 (shown as '—') until those pairs have liquidity
  return 0;
}

// ── Swap quote with multi-hop path ────────────────────────────────────────────
export function useSwapQuote(
  fromSymbol: TokenSymbol,
  toSymbol: TokenSymbol,
  amountIn: string,
) {
  const fromToken = TOKENS[fromSymbol];
  const toToken   = TOKENS[toSymbol];
  const path      = buildPath(fromSymbol, toSymbol);

  let parsedAmount = 0n;
  try {
    if (amountIn && parseFloat(amountIn) > 0)
      parsedAmount = parseUnits(amountIn, fromToken.decimals);
  } catch { /* ignore */ }

  const { data, isLoading, isError } = useReadContract({
    contract: routerContract,
    method: 'getAmountsOut',
    params: [parsedAmount, path],
    queryOptions: { enabled: parsedAmount > 0n, refetchInterval: 8_000 },
  });

  const amounts   = data as readonly bigint[] | undefined;
  const amountOut = amounts?.[amounts.length - 1] ?? 0n;
  const isMultiHop = path.length > 2;

  const formatted = amountOut > 0n
    ? parseFloat(formatUnits(amountOut, toToken.decimals)).toFixed(
        toToken.decimals === 6 ? 2 : 6,
      )
    : '';

  const rate = parsedAmount > 0n && amountOut > 0n
    ? (Number(formatUnits(amountOut, toToken.decimals)) /
       Number(formatUnits(parsedAmount, fromToken.decimals))).toFixed(
        toToken.decimals === 6 ? 2 : 6,
      )
    : null;

  // No route: isError means getAmountsOut reverted (Router__PairNotFound)
  const noRoute = isError && parsedAmount > 0n;

  return { amountOut, formatted, rate, path, isMultiHop, isLoading, isError, noRoute };
}

// ── Real price impact using pair reserves ─────────────────────────────────────
export function usePriceImpact(
  fromSymbol: TokenSymbol,
  toSymbol: TokenSymbol,
  amountIn: string,
  amountOut: bigint,
) {
  const pairAddr  = getPairAddress(fromSymbol, toSymbol);
  const fromToken = TOKENS[fromSymbol];
  const toToken   = TOKENS[toSymbol];

  const pairEntry    = pairAddr ? Object.values(PAIRS).find(p => p.address === pairAddr) : null;
  const fromIsToken0 = pairEntry?.token0 === fromSymbol;

  const pairContract = pairAddr
    ? getContract({ client, chain: arbitrumSepolia, address: pairAddr, abi: PAIR_ABI })
    : null;

  const { data } = useReadContract({
    contract: pairContract!,
    method: 'getReserves',
    params: [],
    queryOptions: { enabled: !!pairAddr, refetchInterval: 10_000 },
  });

  const reserves = data as readonly [bigint, bigint, number] | undefined;
  if (!reserves || !amountIn || parseFloat(amountIn) <= 0 || amountOut === 0n) {
    return { priceImpact: null, priceImpactPct: '—' };
  }

  const reserveIn  = fromIsToken0 ? reserves[0] : reserves[1];
  const reserveOut = fromIsToken0 ? reserves[1] : reserves[0];
  if (reserveIn === 0n || reserveOut === 0n) return { priceImpact: null, priceImpactPct: '—' };

  const spotPrice = Number(formatUnits(reserveOut, toToken.decimals)) /
                    Number(formatUnits(reserveIn,  fromToken.decimals));
  const parsedIn  = parseFloat(amountIn) || 0;
  const execPrice = Number(formatUnits(amountOut, toToken.decimals)) / parsedIn;
  const impact    = spotPrice > 0 ? ((spotPrice - execPrice) / spotPrice) * 100 : 0;
  const clamped   = Math.max(0, impact);

  return {
    priceImpact: clamped,
    priceImpactPct: clamped < 0.01 ? '<0.01%' : `${clamped.toFixed(2)}%`,
  };
}

// ── Pair fee config ───────────────────────────────────────────────────────────
export function usePairFees(fromSymbol: TokenSymbol, toSymbol: TokenSymbol) {
  const pairAddr = getPairAddress(fromSymbol, toSymbol);

  const { data } = useReadContract({
    contract: factoryContract,
    method: 'getPairConfig',
    params: [pairAddr ?? '0x0000000000000000000000000000000000000000'],
    queryOptions: { enabled: !!pairAddr },
  });

  const fees = data as readonly bigint[] | undefined;
  return {
    vaultFeeBps:    Number(fees?.[0] ?? 15n),
    treasuryFeeBps: Number(fees?.[1] ?? 10n),
    lpFeeBps:       Number(fees?.[2] ?? 30n),
  };
}

// ── Execute swap ──────────────────────────────────────────────────────────────
export type SwapStatus = 'idle' | 'approving' | 'swapping' | 'success' | 'error';

export function useExecuteSwap() {
  const account = useActiveAccount();
  const { mutateAsync: sendTx } = useSendTransaction();
  const [status, setStatus]   = useState<SwapStatus>('idle');
  const [txHash, setTxHash]   = useState<string | null>(null);
  const [error,  setError]    = useState<string | null>(null);

  const execute = async (
    fromSymbol: TokenSymbol,
    toSymbol: TokenSymbol,
    amountIn: string,
    amountOut: bigint,
    slippageBps    = 50,
    deadlineMinutes = 20,
  ) => {
    if (!account?.address) { setError('Wallet not connected'); return; }

    const fromToken      = TOKENS[fromSymbol];
    const parsedAmountIn = parseUnits(amountIn, fromToken.decimals);
    const minOut         = amountOut * BigInt(10000 - slippageBps) / 10000n;
    const deadline       = BigInt(Math.floor(Date.now() / 1000) + deadlineMinutes * 60);
    const path           = buildPath(fromSymbol, toSymbol);
    const erc20          = tokenContract(fromToken.address);

    try {
      // ── Step 1: Check allowance — only approve if needed ──────────────────
      const currentAllowance = await readContract({
        contract: erc20,
        method: 'allowance',
        params: [account.address, ADDRESSES.router],
      }) as bigint;

      if (currentAllowance < parsedAmountIn) {
        setStatus('approving');
        await sendTx(
          prepareContractCall({
            contract: erc20,
            method: 'approve',
            params: [ADDRESSES.router, parsedAmountIn],
          }),
        );
      }

      // ── Step 2: Swap ──────────────────────────────────────────────────────
      setStatus('swapping');
      const result = await sendTx(
        prepareContractCall({
          contract: routerContract,
          method: 'swapExactTokensForTokens',
          params: [parsedAmountIn, minOut, path, account.address, deadline],
        }),
      );

      setTxHash(result.transactionHash);
      setStatus('success');
    } catch (e: unknown) {
      setStatus('error');
      const msg = e instanceof Error ? e.message : 'Transaction failed';
      setError(msg.includes('0x') ? msg.split('(')[0].trim() : msg);
    }
  };

  const reset = () => { setStatus('idle'); setError(null); setTxHash(null); };
  return { execute, status, txHash, error, reset };
}
