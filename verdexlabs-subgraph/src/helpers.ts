import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Protocol, Pool, PoolDayData, ProtocolDayData, Token } from "../generated/schema";

export const ZERO_BD = BigDecimal.fromString("0");
export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI  = BigInt.fromI32(1);
export const BD_1E6  = BigDecimal.fromString("1000000");
export const BD_1E18 = BigDecimal.fromString("1000000000000000000");
export const BD_1E8  = BigDecimal.fromString("100000000");

// Known token decimals — used for formatting raw amounts
export const USDC_ADDRESS = "0x98697d7bc9ea50ce6682ed52cbc95806e7fdee0f";
export const WETH_ADDRESS = "0x11da2d696dda3e569608f7e802f7cfd5bbe89d4b";
export const WBTC_ADDRESS = "0xfed51c995304775d37c54a7197a9197150147e3b";
export const ARB_ADDRESS  = "0xc4999f55d2887d003d17dc42625354fa364c29d1";
export const DAI_ADDRESS  = "0x9e3b254cadc9eaefa80fd85f26eb7bbbe1f59560";

// WETH/USDC pair — used as price oracle for USD derivation
export const WETH_USDC_PAIR = "0x817caf2f184d7faf6f68963dbb02810633966546";

export function getOrCreateProtocol(): Protocol {
  let protocol = Protocol.load("verdexswap");
  if (protocol == null) {
    protocol = new Protocol("verdexswap");
    protocol.totalVolumeUSD = ZERO_BD;
    protocol.totalFeesUSD = ZERO_BD;
    protocol.totalILPayoutsUSD = ZERO_BD;
    protocol.totalFeeConversionsUSD = ZERO_BD;
    protocol.txCount = ZERO_BI;
    protocol.poolCount = 0;
    protocol.save();
  }
  return protocol as Protocol;
}

export function getOrCreateToken(address: string, symbol: string, decimals: i32): Token {
  let token = Token.load(address);
  if (token == null) {
    token = new Token(address);
    token.symbol = symbol;
    token.decimals = decimals;
    token.save();
  }
  return token as Token;
}

export function tokenSymbol(address: string): string {
  if (address == USDC_ADDRESS) return "USDC";
  if (address == WETH_ADDRESS) return "WETH";
  if (address == WBTC_ADDRESS) return "WBTC";
  if (address == ARB_ADDRESS)  return "ARB";
  if (address == DAI_ADDRESS)  return "DAI";
  return "UNKNOWN";
}

export function tokenDecimals(address: string): i32 {
  if (address == USDC_ADDRESS) return 6;
  if (address == WBTC_ADDRESS) return 8;
  return 18;
}

export function formatAmount(raw: BigInt, decimals: i32): BigDecimal {
  let divisor = BigInt.fromI32(10).pow(decimals as u8).toBigDecimal();
  return raw.toBigDecimal().div(divisor);
}

// Derive USD value from pool reserves.
// For USDC-quoted pairs: token1 is USDC, so reserve1 * 2 = TVL in USD.
// For WETH/DAI: both are 18 dec, DAI ≈ $1, so reserve1 * 2 ≈ TVL.
// For swap volume: if one side is USDC/DAI, use that amount directly.
export function deriveUSDFromSwap(
  pool: Pool,
  amount0In: BigDecimal,
  amount1In: BigDecimal,
  amount0Out: BigDecimal,
  amount1Out: BigDecimal,
): BigDecimal {
  let t0 = pool.token0.toLowerCase();
  let t1 = pool.token1.toLowerCase();

  // If USDC is token1 (most pairs): use the USDC side
  if (t1 == USDC_ADDRESS) {
    let usdcIn  = amount1In;
    let usdcOut = amount1Out;
    return usdcIn.gt(usdcOut) ? usdcIn : usdcOut;
  }
  // If USDC is token0
  if (t0 == USDC_ADDRESS) {
    let usdcIn  = amount0In;
    let usdcOut = amount0Out;
    return usdcIn.gt(usdcOut) ? usdcIn : usdcOut;
  }
  // DAI ≈ $1
  if (t1 == DAI_ADDRESS) {
    let daiIn  = amount1In;
    let daiOut = amount1Out;
    return daiIn.gt(daiOut) ? daiIn : daiOut;
  }
  if (t0 == DAI_ADDRESS) {
    let daiIn  = amount0In;
    let daiOut = amount0Out;
    return daiIn.gt(daiOut) ? daiIn : daiOut;
  }
  return ZERO_BD;
}

// Day ID: seconds since epoch / 86400
export function getDayId(timestamp: BigInt): i32 {
  return (timestamp.toI32() / 86400);
}

export function getOrCreatePoolDayData(pool: Pool, timestamp: BigInt): PoolDayData {
  let dayId = getDayId(timestamp);
  let id = pool.id + "-" + dayId.toString();
  let day = PoolDayData.load(id);
  if (day == null) {
    day = new PoolDayData(id);
    day.pool = pool.id;
    day.date = dayId * 86400;
    day.volumeToken0 = ZERO_BD;
    day.volumeToken1 = ZERO_BD;
    day.volumeUSD = ZERO_BD;
    day.feesUSD = ZERO_BD;
    day.reserve0 = pool.reserve0;
    day.reserve1 = pool.reserve1;
    day.txCount = ZERO_BI;
    day.save();
  }
  return day as PoolDayData;
}

export function getOrCreateProtocolDayData(timestamp: BigInt): ProtocolDayData {
  let dayId = getDayId(timestamp);
  let id = dayId.toString();
  let day = ProtocolDayData.load(id);
  if (day == null) {
    day = new ProtocolDayData(id);
    day.date = dayId * 86400;
    day.volumeUSD = ZERO_BD;
    day.feesUSD = ZERO_BD;
    day.txCount = ZERO_BI;
    day.save();
  }
  return day as ProtocolDayData;
}
