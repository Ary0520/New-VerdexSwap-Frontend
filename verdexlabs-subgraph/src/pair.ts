import { Sync } from "../generated/templates/Pair/Pair";
import { Pool } from "../generated/schema";
import { formatAmount, tokenDecimals } from "./helpers";

export function handleSync(event: Sync): void {
  let pairAddr = event.address.toHexString().toLowerCase();
  let pool = Pool.load(pairAddr);
  if (pool == null) return;

  let dec0 = tokenDecimals(pool.token0);
  let dec1 = tokenDecimals(pool.token1);

  pool.reserve0 = formatAmount(event.params.reserve0, dec0);
  pool.reserve1 = formatAmount(event.params.reserve1, dec1);
  pool.save();
}
