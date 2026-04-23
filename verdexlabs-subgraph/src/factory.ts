import { PairCreated } from "../generated/Factory/Factory";
import { Pair as PairContract } from "../generated/Factory/Pair";
import { Pair as PairTemplate } from "../generated/templates";
import { Pool, Token } from "../generated/schema";
import {
  ZERO_BD, ZERO_BI,
  getOrCreateProtocol,
  getOrCreateToken,
  tokenSymbol,
  tokenDecimals,
} from "./helpers";

export function handlePairCreated(event: PairCreated): void {
  let t0Addr = event.params.token0.toHexString().toLowerCase();
  let t1Addr = event.params.token1.toHexString().toLowerCase();
  let pairAddr = event.params.pair.toHexString().toLowerCase();

  // Ensure token entities exist
  getOrCreateToken(t0Addr, tokenSymbol(t0Addr), tokenDecimals(t0Addr));
  getOrCreateToken(t1Addr, tokenSymbol(t1Addr), tokenDecimals(t1Addr));

  // Read lpFeeBps from the pair contract
  let pairContract = PairContract.bind(event.params.pair);
  let lpFeeBps = ZERO_BI;
  let lpFeeResult = pairContract.try_lpFeeBps();
  if (!lpFeeResult.reverted) lpFeeBps = lpFeeResult.value;

  // Create Pool entity
  let pool = new Pool(pairAddr);
  pool.token0 = t0Addr;
  pool.token1 = t1Addr;
  pool.tier = event.params.tier;
  pool.lpFeeBps = lpFeeBps;
  pool.reserve0 = ZERO_BD;
  pool.reserve1 = ZERO_BD;
  pool.totalSupply = ZERO_BD;
  pool.totalVolumeToken0 = ZERO_BD;
  pool.totalVolumeToken1 = ZERO_BD;
  pool.totalVolumeUSD = ZERO_BD;
  pool.totalFeesUSD = ZERO_BD;
  pool.txCount = ZERO_BI;
  pool.vaultUsdcReserve = ZERO_BD;
  pool.vaultTotalPaidOut = ZERO_BD;
  pool.vaultTotalFeesIn = ZERO_BD;
  pool.createdAt = event.block.timestamp;
  pool.save();

  // Spin up a dynamic data source to track Sync events on this pair
  PairTemplate.create(event.params.pair);

  // Update protocol pool count
  let protocol = getOrCreateProtocol();
  protocol.poolCount = protocol.poolCount + 1;
  protocol.save();
}
