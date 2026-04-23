import {
  PositionRecorded,
  PositionReduced,
  PositionCleared,
} from "../generated/ILPositionManager/ILPositionManager";
import { UserILPosition } from "../generated/schema";
import { ZERO_BD, ZERO_BI, formatAmount } from "./helpers";

function positionId(pair: string, user: string): string {
  return user + "-" + pair;
}

export function handlePositionRecorded(event: PositionRecorded): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let userAddr = event.params.user.toHexString().toLowerCase();
  let id = positionId(pairAddr, userAddr);

  let pos = UserILPosition.load(id);
  if (pos == null) {
    pos = new UserILPosition(id);
    pos.user = event.params.user;
    pos.pool = pairAddr;
    pos.entryTimestamp = event.block.timestamp;
  }

  pos.liquidity = formatAmount(event.params.liquidity, 18);
  pos.valueAtDeposit = formatAmount(event.params.depositValue, 6); // USDC
  pos.active = true;
  pos.save();
}

export function handlePositionReduced(event: PositionReduced): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let userAddr = event.params.user.toHexString().toLowerCase();
  let id = positionId(pairAddr, userAddr);

  let pos = UserILPosition.load(id);
  if (pos == null) return;

  let remaining = formatAmount(event.params.liquidityRemaining, 18);
  pos.liquidity = remaining;
  pos.active = remaining.gt(ZERO_BD);
  pos.save();
}

export function handlePositionCleared(event: PositionCleared): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let userAddr = event.params.user.toHexString().toLowerCase();
  let id = positionId(pairAddr, userAddr);

  let pos = UserILPosition.load(id);
  if (pos == null) return;

  pos.liquidity = ZERO_BD;
  pos.active = false;
  pos.save();
}
