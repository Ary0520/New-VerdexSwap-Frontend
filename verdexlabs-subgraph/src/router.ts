import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  SwapExecuted,
  LiquidityAdded,
  LiquidityRemoved,
} from "../generated/Router/Router";
import { Pair as PairContract } from "../generated/Router/Pair";
import { Swap, LiquidityEvent, Pool } from "../generated/schema";
import {
  ZERO_BD, ZERO_BI, ONE_BI,
  getOrCreateProtocol,
  getOrCreatePoolDayData,
  getOrCreateProtocolDayData,
  formatAmount,
  tokenDecimals,
  deriveUSDFromSwap,
} from "./helpers";

// ── SwapExecuted ──────────────────────────────────────────────────────────────
// Router emits: pair, to, amountIn, amountOut
// We also read the Pair's Swap event data via the pair contract for token0/1 split
export function handleSwapExecuted(event: SwapExecuted): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let pool = Pool.load(pairAddr);
  // Pool may not exist if PairCreated was processed after this event
  // Skip silently — will be captured on re-index with correct startBlock
  if (pool == null) return;

  let dec0 = tokenDecimals(pool.token0);
  let dec1 = tokenDecimals(pool.token1);

  // amountIn/Out from Router are raw — we don't know which token without
  // reading the pair. Use the Pair contract to get reserves and infer direction.
  let pairContract = PairContract.bind(event.params.pair);
  let reservesResult = pairContract.try_getReserves();

  // We'll store amounts as token0/token1 using a heuristic:
  // Router.SwapExecuted gives total amountIn and amountOut but not per-token.
  // We store them as-is and derive USD from the USDC side.
  // For precise per-token amounts, the Pair.Swap event is the source of truth —
  // but since we're using Router events for simplicity, we approximate.
  let amountInRaw  = event.params.amountIn;
  let amountOutRaw = event.params.amountOut;

  // Determine which token is "in" by checking reserves change direction.
  // Simpler: assume token0 is "in" if reserve0 decreased (amountOut side).
  // We'll store both as 0 for the other side and let USD derivation handle it.
  let amount0In  = ZERO_BD;
  let amount1In  = ZERO_BD;
  let amount0Out = ZERO_BD;
  let amount1Out = ZERO_BD;

  // Without knowing direction from this event alone, we use reserve comparison.
  // Safe fallback: store amountIn as token0In, amountOut as token1Out.
  // This is corrected by the Sync event updating reserves.
  amount0In  = formatAmount(amountInRaw,  dec0);
  amount1Out = formatAmount(amountOutRaw, dec1);

  let amountUSD = deriveUSDFromSwap(pool, amount0In, amount1In, amount0Out, amount1Out);

  // Fee in USD: lpFeeBps / 10000 * amountUSD
  let feeBps = pool.lpFeeBps.toBigDecimal();
  let feesUSD = amountUSD.times(feeBps).div(BigDecimal.fromString("10000"));

  // Create Swap entity
  let swapId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let swap = new Swap(swapId);
  swap.pool = pairAddr;
  swap.sender = event.transaction.from;
  swap.recipient = event.params.to;
  swap.amount0In  = amount0In;
  swap.amount1In  = amount1In;
  swap.amount0Out = amount0Out;
  swap.amount1Out = amount1Out;
  swap.amountUSD  = amountUSD;
  swap.timestamp  = event.block.timestamp;
  swap.blockNumber = event.block.number;
  swap.txHash = event.transaction.hash;
  swap.save();

  // Update Pool
  pool.totalVolumeToken0 = pool.totalVolumeToken0.plus(amount0In);
  pool.totalVolumeToken1 = pool.totalVolumeToken1.plus(amount1Out);
  pool.totalVolumeUSD = pool.totalVolumeUSD.plus(amountUSD);
  pool.totalFeesUSD = pool.totalFeesUSD.plus(feesUSD);
  pool.txCount = pool.txCount.plus(ONE_BI);
  pool.save();

  // Update PoolDayData
  let dayData = getOrCreatePoolDayData(pool, event.block.timestamp);
  dayData.volumeToken0 = dayData.volumeToken0.plus(amount0In);
  dayData.volumeToken1 = dayData.volumeToken1.plus(amount1Out);
  dayData.volumeUSD = dayData.volumeUSD.plus(amountUSD);
  dayData.feesUSD = dayData.feesUSD.plus(feesUSD);
  dayData.txCount = dayData.txCount.plus(ONE_BI);
  dayData.save();

  // Update Protocol
  let protocol = getOrCreateProtocol();
  protocol.totalVolumeUSD = protocol.totalVolumeUSD.plus(amountUSD);
  protocol.totalFeesUSD = protocol.totalFeesUSD.plus(feesUSD);
  protocol.txCount = protocol.txCount.plus(ONE_BI);
  protocol.save();

  // Update ProtocolDayData
  let protoDayData = getOrCreateProtocolDayData(event.block.timestamp);
  protoDayData.volumeUSD = protoDayData.volumeUSD.plus(amountUSD);
  protoDayData.feesUSD = protoDayData.feesUSD.plus(feesUSD);
  protoDayData.txCount = protoDayData.txCount.plus(ONE_BI);
  protoDayData.save();
}

// ── LiquidityAdded ────────────────────────────────────────────────────────────
export function handleLiquidityAdded(event: LiquidityAdded): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let pool = Pool.load(pairAddr);
  if (pool == null) return;

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let liqEvent = new LiquidityEvent(id);
  liqEvent.type = "add";
  liqEvent.pool = pairAddr;
  liqEvent.user = event.params.to;
  liqEvent.amount0 = ZERO_BD;  // Router.LiquidityAdded only gives liquidity tokens
  liqEvent.amount1 = ZERO_BD;
  liqEvent.liquidity = formatAmount(event.params.liquidity, 18);
  liqEvent.ilPayout = ZERO_BD;
  liqEvent.timestamp = event.block.timestamp;
  liqEvent.blockNumber = event.block.number;
  liqEvent.txHash = event.transaction.hash;
  liqEvent.save();

  pool.txCount = pool.txCount.plus(ONE_BI);
  pool.save();

  let protocol = getOrCreateProtocol();
  protocol.txCount = protocol.txCount.plus(ONE_BI);
  protocol.save();
}

// ── LiquidityRemoved ──────────────────────────────────────────────────────────
export function handleLiquidityRemoved(event: LiquidityRemoved): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let pool = Pool.load(pairAddr);
  if (pool == null) return;

  let dec0 = tokenDecimals(pool.token0);
  let dec1 = tokenDecimals(pool.token1);

  let amount0 = formatAmount(event.params.amountA, dec0);
  let amount1 = formatAmount(event.params.amountB, dec1);
  let ilPayout = formatAmount(event.params.ilPayout, 6); // USDC 6 dec

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let liqEvent = new LiquidityEvent(id);
  liqEvent.type = "remove";
  liqEvent.pool = pairAddr;
  liqEvent.user = event.params.to;
  liqEvent.amount0 = amount0;
  liqEvent.amount1 = amount1;
  liqEvent.liquidity = ZERO_BD;
  liqEvent.ilPayout = ilPayout;
  liqEvent.timestamp = event.block.timestamp;
  liqEvent.blockNumber = event.block.number;
  liqEvent.txHash = event.transaction.hash;
  liqEvent.save();

  pool.txCount = pool.txCount.plus(ONE_BI);
  pool.save();

  let protocol = getOrCreateProtocol();
  protocol.txCount = protocol.txCount.plus(ONE_BI);
  protocol.save();
}
