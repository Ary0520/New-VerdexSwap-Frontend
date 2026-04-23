import { Converted } from "../generated/FeeConverter/FeeConverter";
import { FeeConversion, Pool } from "../generated/schema";
import {
  ZERO_BD,
  getOrCreateProtocol,
  formatAmount,
  tokenDecimals,
} from "./helpers";

export function handleConverted(event: Converted): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let pool = Pool.load(pairAddr);

  let feeTokenAddr = event.params.feeToken.toHexString().toLowerCase();
  let dec = tokenDecimals(feeTokenAddr);

  let rawAmountIn = formatAmount(event.params.rawAmountIn, dec);
  let usdcOut     = formatAmount(event.params.usdcOut, 6);
  let callerBonus = formatAmount(event.params.callerBonus, 6);

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let conversion = new FeeConversion(id);
  conversion.pool = pairAddr;
  conversion.feeToken = event.params.feeToken;
  conversion.rawAmountIn = rawAmountIn;
  conversion.usdcOut = usdcOut;
  conversion.callerBonus = callerBonus;
  conversion.caller = event.params.caller;
  conversion.timestamp = event.block.timestamp;
  conversion.blockNumber = event.block.number;
  conversion.txHash = event.transaction.hash;
  conversion.save();

  if (pool != null) {
    pool.vaultTotalFeesIn = pool.vaultTotalFeesIn.plus(usdcOut);
    pool.save();
  }

  let protocol = getOrCreateProtocol();
  protocol.totalFeeConversionsUSD = protocol.totalFeeConversionsUSD.plus(usdcOut);
  protocol.save();
}
