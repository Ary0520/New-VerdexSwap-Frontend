import { GraphQLClient, gql } from 'graphql-request';

// ── Client ────────────────────────────────────────────────────────────────────
// The query URL from Subgraph Studio (v0.0.1 deployment)
// For production: publish the subgraph to The Graph Network and use the
// decentralized endpoint instead.
const SUBGRAPH_URL =
  'https://api.studio.thegraph.com/query/1744252/verdexlabs/v0.0.2';

export const subgraphClient = new GraphQLClient(SUBGRAPH_URL);

// ── Types ─────────────────────────────────────────────────────────────────────
export type SubgraphPool = {
  id: string;
  token0: { id: string; symbol: string; decimals: number };
  token1: { id: string; symbol: string; decimals: number };
  tier: number;
  lpFeeBps: string;
  reserve0: string;
  reserve1: string;
  totalVolumeUSD: string;
  totalFeesUSD: string;
  txCount: string;
  vaultUsdcReserve: string;
  vaultTotalPaidOut: string;
  vaultTotalFeesIn: string;
  createdAt: string;
};

export type SubgraphProtocol = {
  totalVolumeUSD: string;
  totalFeesUSD: string;
  totalILPayoutsUSD: string;
  totalFeeConversionsUSD: string;
  txCount: string;
  poolCount: number;
};

export type SubgraphPoolDayData = {
  date: number;
  volumeUSD: string;
  feesUSD: string;
  reserve0: string;
  reserve1: string;
  txCount: string;
};

export type SubgraphSwap = {
  id: string;
  sender: string;
  recipient: string;
  amount0In: string;
  amount1In: string;
  amount0Out: string;
  amount1Out: string;
  amountUSD: string;
  timestamp: string;
  txHash: string;
};

export type SubgraphLiquidityEvent = {
  id: string;
  type: string;
  user: string;
  amount0: string;
  amount1: string;
  liquidity: string;
  ilPayout: string;
  timestamp: string;
  txHash: string;
};

export type SubgraphStakingEvent = {
  id: string;
  type: string;
  user: string;
  pool: string;
  amountUSDC: string;
  shares: string;
  timestamp: string;
  txHash: string;
};

export type SubgraphILPayout = {
  id: string;
  user: string;
  amountUSDC: string;
  coverageBps: string;
  timestamp: string;
  txHash: string;
};

export type SubgraphFeeConversion = {
  id: string;
  feeToken: string;
  rawAmountIn: string;
  usdcOut: string;
  callerBonus: string;
  caller: string;
  timestamp: string;
  txHash: string;
};

export type SubgraphUserILPosition = {
  id: string;
  pool: { id: string; token0: { symbol: string }; token1: { symbol: string } };
  liquidity: string;
  valueAtDeposit: string;
  entryTimestamp: string;
  active: boolean;
};

export type SubgraphUserStakingPosition = {
  id: string;
  pool: string;
  amountUSDC: string;
  shares: string;
  totalEarned: string;
  active: boolean;
};

// ── Queries ───────────────────────────────────────────────────────────────────

export const PROTOCOL_QUERY = gql`
  query Protocol {
    protocol(id: "verdexswap") {
      totalVolumeUSD
      totalFeesUSD
      totalILPayoutsUSD
      totalFeeConversionsUSD
      txCount
      poolCount
    }
  }
`;

export const ALL_POOLS_QUERY = gql`
  query AllPools {
    pools(orderBy: totalVolumeUSD, orderDirection: desc) {
      id
      token0 { id symbol decimals }
      token1 { id symbol decimals }
      tier
      lpFeeBps
      reserve0
      reserve1
      totalVolumeUSD
      totalFeesUSD
      txCount
      vaultUsdcReserve
      vaultTotalPaidOut
      vaultTotalFeesIn
      createdAt
    }
  }
`;

export const POOL_DAY_DATA_QUERY = gql`
  query PoolDayData($poolId: ID!, $days: Int!) {
    poolDayDatas(
      where: { pool: $poolId }
      orderBy: date
      orderDirection: desc
      first: $days
    ) {
      date
      volumeUSD
      feesUSD
      reserve0
      reserve1
      txCount
    }
  }
`;

export const PROTOCOL_DAY_DATA_QUERY = gql`
  query ProtocolDayData($days: Int!) {
    protocolDayDatas(
      orderBy: date
      orderDirection: desc
      first: $days
    ) {
      date
      volumeUSD
      feesUSD
      txCount
    }
  }
`;

export const POOL_SWAPS_QUERY = gql`
  query PoolSwaps($poolId: ID!, $first: Int!) {
    swaps(
      where: { pool: $poolId }
      orderBy: timestamp
      orderDirection: desc
      first: $first
    ) {
      id
      sender
      recipient
      amount0In
      amount1In
      amount0Out
      amount1Out
      amountUSD
      timestamp
      txHash
    }
  }
`;

export const USER_TRANSACTIONS_QUERY = gql`
  query UserTransactions($user: Bytes!, $first: Int!) {
    swaps(where: { sender: $user }, orderBy: timestamp, orderDirection: desc, first: $first) {
      id amountUSD timestamp txHash
      pool { id token0 { symbol } token1 { symbol } }
    }
    liquidityEvents(where: { user: $user }, orderBy: timestamp, orderDirection: desc, first: $first) {
      id type amount0 amount1 ilPayout timestamp txHash
      pool { id token0 { symbol } token1 { symbol } }
    }
    stakingEvents(where: { user: $user }, orderBy: timestamp, orderDirection: desc, first: $first) {
      id type amountUSDC timestamp txHash
    }
    ilPayouts(where: { user: $user }, orderBy: timestamp, orderDirection: desc, first: $first) {
      id amountUSDC coverageBps timestamp txHash
      pool { id token0 { symbol } token1 { symbol } }
    }
  }
`;

export const USER_IL_POSITIONS_QUERY = gql`
  query UserILPositions($user: Bytes!) {
    userILPositions(where: { user: $user, active: true }) {
      id
      pool { id token0 { symbol } token1 { symbol } }
      liquidity
      valueAtDeposit
      entryTimestamp
      active
    }
  }
`;

export const USER_STAKING_POSITIONS_QUERY = gql`
  query UserStakingPositions($user: Bytes!) {
    userStakingPositions(where: { user: $user, active: true }) {
      id
      pool
      amountUSDC
      shares
      totalEarned
      active
    }
  }
`;

// Count of active IL positions (= "policies active")
export const POLICIES_ACTIVE_QUERY = gql`
  query PoliciesActive {
    userILPositions(where: { active: true }) {
      id
    }
  }
`;

// Latest fee conversion across all pools (for "last conversion" timestamp)
export const LATEST_CONVERSION_QUERY = gql`
  query LatestConversion {
    feeConversions(orderBy: timestamp, orderDirection: desc, first: 1) {
      timestamp
      usdcOut
      pool { id token0 { symbol } token1 { symbol } }
    }
  }
`;

// 7-day fee total for APY calculation
export const FEES_7D_QUERY = gql`
  query Fees7d($since: Int!) {
    poolDayDatas(where: { date_gte: $since }) {
      feesUSD
      pool { id }
    }
  }
`;

export const FEE_CONVERSIONS_QUERY = gql`
  query FeeConversions($poolId: ID!, $first: Int!) {
    feeConversions(
      where: { pool: $poolId }
      orderBy: timestamp
      orderDirection: desc
      first: $first
    ) {
      id
      feeToken
      rawAmountIn
      usdcOut
      callerBonus
      caller
      timestamp
      txHash
    }
  }
`;

// ── Fetch helpers ─────────────────────────────────────────────────────────────

export async function fetchProtocol(): Promise<SubgraphProtocol | null> {
  try {
    const data = await subgraphClient.request<{ protocol: SubgraphProtocol }>(PROTOCOL_QUERY);
    return data.protocol;
  } catch {
    return null;
  }
}

export async function fetchAllPools(): Promise<SubgraphPool[]> {
  try {
    const data = await subgraphClient.request<{ pools: SubgraphPool[] }>(ALL_POOLS_QUERY);
    return data.pools;
  } catch {
    return [];
  }
}

export async function fetchPoolDayData(poolId: string, days = 30): Promise<SubgraphPoolDayData[]> {
  try {
    const data = await subgraphClient.request<{ poolDayDatas: SubgraphPoolDayData[] }>(
      POOL_DAY_DATA_QUERY,
      { poolId: poolId.toLowerCase(), days },
    );
    return data.poolDayDatas.reverse(); // oldest first for charts
  } catch {
    return [];
  }
}

export async function fetchProtocolDayData(days = 30) {
  try {
    const data = await subgraphClient.request<{ protocolDayDatas: { date: number; volumeUSD: string; feesUSD: string; txCount: string }[] }>(
      PROTOCOL_DAY_DATA_QUERY,
      { days },
    );
    return data.protocolDayDatas.reverse();
  } catch {
    return [];
  }
}

export async function fetchUserTransactions(userAddress: string, first = 50) {
  try {
    const data = await subgraphClient.request(USER_TRANSACTIONS_QUERY, {
      user: userAddress.toLowerCase(),
      first,
    });
    return data as {
      swaps: (SubgraphSwap & { pool: { id: string; token0: { symbol: string }; token1: { symbol: string } } })[];
      liquidityEvents: (SubgraphLiquidityEvent & { pool: { id: string; token0: { symbol: string }; token1: { symbol: string } } })[];
      stakingEvents: SubgraphStakingEvent[];
      ilPayouts: (SubgraphILPayout & { pool: { id: string; token0: { symbol: string }; token1: { symbol: string } } })[];
    };
  } catch {
    return { swaps: [], liquidityEvents: [], stakingEvents: [], ilPayouts: [] };
  }
}

export async function fetchUserILPositions(userAddress: string): Promise<SubgraphUserILPosition[]> {
  try {
    const data = await subgraphClient.request<{ userILPositions: SubgraphUserILPosition[] }>(
      USER_IL_POSITIONS_QUERY,
      { user: userAddress.toLowerCase() },
    );
    return data.userILPositions;
  } catch {
    return [];
  }
}

export async function fetchUserStakingPositions(userAddress: string): Promise<SubgraphUserStakingPosition[]> {
  try {
    const data = await subgraphClient.request<{ userStakingPositions: SubgraphUserStakingPosition[] }>(
      USER_STAKING_POSITIONS_QUERY,
      { user: userAddress.toLowerCase() },
    );
    return data.userStakingPositions;
  } catch {
    return [];
  }
}

export async function fetchPoliciesActive(): Promise<number> {
  try {
    const data = await subgraphClient.request<{ userILPositions: { id: string }[] }>(POLICIES_ACTIVE_QUERY);
    return data.userILPositions.length;
  } catch {
    return 0;
  }
}

export async function fetchLatestConversion(): Promise<{ timestamp: string; usdcOut: string; pool: { id: string; token0: { symbol: string }; token1: { symbol: string } } } | null> {
  try {
    const data = await subgraphClient.request<{ feeConversions: { timestamp: string; usdcOut: string; pool: { id: string; token0: { symbol: string }; token1: { symbol: string } } }[] }>(LATEST_CONVERSION_QUERY);
    return data.feeConversions[0] ?? null;
  } catch {
    return null;
  }
}

// Returns vault staker fee APY estimate:
// APY = (fees distributed to stakers over 7d / total staked) * 52
// feesUSD in subgraph is total swap fees; vault takes vaultFeeBps/totalFeeBps share
// We approximate: vault share ≈ 27% of total fees (15bps vault / 55bps total)
export async function fetchVaultApy(totalStakedUsd: number): Promise<number | null> {
  if (totalStakedUsd <= 0) return null;
  try {
    const since = Math.floor(Date.now() / 1000) - 7 * 86400;
    const data = await subgraphClient.request<{ poolDayDatas: { feesUSD: string }[] }>(
      FEES_7D_QUERY, { since },
    );
    const totalFees7d = data.poolDayDatas.reduce((acc, d) => acc + parseFloat(d.feesUSD), 0);
    const vaultShare = totalFees7d * 0.27; // vault fee bps / total fee bps
    const apy = (vaultShare / totalStakedUsd) * 52 * 100; // annualised %
    return apy;
  } catch {
    return null;
  }
}

export async function fetchFeeConversions(poolId: string, first = 10): Promise<SubgraphFeeConversion[]> {
  try {
    const data = await subgraphClient.request<{ feeConversions: SubgraphFeeConversion[] }>(
      FEE_CONVERSIONS_QUERY,
      { poolId: poolId.toLowerCase(), first },
    );
    return data.feeConversions;
  } catch {
    return [];
  }
}
