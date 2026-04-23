import { Address } from "@graphprotocol/graph-ts";
import { Staked, Unstaked, PayoutIssued, FeeHarvested } from "../generated/ILShieldVault/ILShieldVault";
import { StakingEvent, UserStakingPosition, ILPayout, Pool } from "../generated/schema";
import {
  ZERO_BD, ZERO_BI, ONE_BI,
  getOrCreateProtocol,
  formatAmount,
} from "./helpers";

function getOrCreateStakingPosition(userAddr: Address, pairAddr: Address): UserStakingPosition {
  let user = userAddr.toHexString().toLowerCase();
  let pool = pairAddr.toHexString().toLowerCase();
  let id = user + "-" + pool;
  let pos = UserStakingPosition.load(id);
  if (pos == null) {
    pos = new UserStakingPosition(id);
    pos.user = userAddr;
    pos.pool = pairAddr;
    pos.amountUSDC = ZERO_BD;
    pos.shares = ZERO_BD;
    pos.totalEarned = ZERO_BD;
    pos.active = false;
    pos.save();
  }
  return pos as UserStakingPosition;
}

export function handleStaked(event: Staked): void {
  let amount = formatAmount(event.params.amount, 6); // USDC
  let shares = formatAmount(event.params.shares, 18);

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let ev = new StakingEvent(id);
  ev.type = "stake";
  ev.user = event.params.staker;
  ev.pool = event.params.pair;
  ev.amountUSDC = amount;
  ev.shares = shares;
  ev.timestamp = event.block.timestamp;
  ev.blockNumber = event.block.number;
  ev.txHash = event.transaction.hash;
  ev.save();

  let pos = getOrCreateStakingPosition(event.params.staker, event.params.pair);
  pos.amountUSDC = pos.amountUSDC.plus(amount);
  pos.shares = pos.shares.plus(shares);
  pos.active = true;
  pos.save();
}

export function handleUnstaked(event: Unstaked): void {
  let amount = formatAmount(event.params.amount, 6);

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let ev = new StakingEvent(id);
  ev.type = "unstake";
  ev.user = event.params.staker;
  ev.pool = event.params.pair;
  ev.amountUSDC = amount;
  ev.shares = ZERO_BD;
  ev.timestamp = event.block.timestamp;
  ev.blockNumber = event.block.number;
  ev.txHash = event.transaction.hash;
  ev.save();

  let pos = getOrCreateStakingPosition(event.params.staker, event.params.pair);
  pos.amountUSDC = pos.amountUSDC.minus(amount);
  if (pos.amountUSDC.lt(ZERO_BD)) pos.amountUSDC = ZERO_BD;
  pos.active = pos.amountUSDC.gt(ZERO_BD);
  pos.save();
}

export function handlePayoutIssued(event: PayoutIssued): void {
  let pairAddr = event.params.pair.toHexString().toLowerCase();
  let pool = Pool.load(pairAddr);

  let amount = formatAmount(event.params.amount, 6); // USDC

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let payout = new ILPayout(id);
  payout.pool = pairAddr;
  payout.user = event.params.user;
  payout.amountUSDC = amount;
  payout.coverageBps = event.params.coverageBps;
  payout.timestamp = event.block.timestamp;
  payout.blockNumber = event.block.number;
  payout.txHash = event.transaction.hash;
  payout.save();

  if (pool != null) {
    pool.vaultTotalPaidOut = pool.vaultTotalPaidOut.plus(amount);
    pool.save();
  }

  let protocol = getOrCreateProtocol();
  protocol.totalILPayoutsUSD = protocol.totalILPayoutsUSD.plus(amount);
  protocol.save();
}

export function handleFeeHarvested(event: FeeHarvested): void {
  let amount = formatAmount(event.params.amount, 6);

  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let ev = new StakingEvent(id);
  ev.type = "harvest";
  ev.user = event.params.staker;
  ev.pool = event.params.pair;
  ev.amountUSDC = amount;
  ev.shares = ZERO_BD;
  ev.timestamp = event.block.timestamp;
  ev.blockNumber = event.block.number;
  ev.txHash = event.transaction.hash;
  ev.save();

  let pos = getOrCreateStakingPosition(event.params.staker, event.params.pair);
  pos.totalEarned = pos.totalEarned.plus(amount);
  pos.save();
}
