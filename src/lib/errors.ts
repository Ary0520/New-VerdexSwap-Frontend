// ── Human-readable error messages for all contract custom errors ──────────────

const ERROR_MAP: Record<string, string> = {
  // Router
  'Router__SlippageExceeded':    'Slippage too high — try increasing your slippage tolerance in settings.',
  'Router__PairNotFound':        'No trading pair found for these tokens.',
  'Router__AmountZero':          'Amount must be greater than zero.',
  'Router__Expired':             'Transaction deadline expired — please try again.',
  'Router__InvalidPath':         'Invalid swap route.',
  'Router__NotOwner':            'Not authorized.',
  'Router__ZeroAddress':         'Invalid address.',

  // Pair
  'Pair__InsufficientLiquidityMinted': 'Not enough liquidity — try a larger amount.',
  'Pair__InsufficientOutputAmount':    'Output amount too low — increase slippage tolerance.',
  'Pair__InvariantViolation':          'Pool invariant violated — contact support.',
  'Pair__ZeroReserves':                'Pool has no liquidity yet.',
  'Pair__Locked':                      'Pool is locked — another transaction is in progress.',
  'Pair__Overflow':                    'Amount too large for this pool.',
  'Pair__Forbidden':                   'Action not permitted.',
  'Pair__AmountZero':                  'Amount must be greater than zero.',
  'Pair__ZeroTotalSupply':             'Pool has no liquidity.',

  // Factory
  'DEX__PairAlreadyExists':  'This trading pair already exists.',
  'DEX__IdenticalTokens':    'Cannot create a pair with the same token.',
  'DEX__ZeroAddress':        'Invalid token address.',
  'DEX__Forbidden':          'Action not permitted.',
  'DEX__InvalidConfig':      'Invalid pool configuration.',
  'DEX__PairNotFound':       'Trading pair not found.',

  // Vault
  'CooldownNotMet':          'Unstake cooldown not complete — please wait before withdrawing.',
  'UnstakeNotRequested':     'You must request unstake before withdrawing.',
  'InsufficientFund':        'Vault has insufficient funds for this payout.',
  'InsufficientShares':      'Insufficient vault shares to unstake.',
  'VaultPaused':             'The vault is currently paused.',
  'NotAuthorized':           'Not authorized to perform this action.',
  'NotConverter':            'Only the FeeConverter can call this.',
  'InvalidConfig':           'Invalid vault configuration.',
  'ZeroAmount':              'Amount must be greater than zero.',
  'ZeroAddress':             'Invalid address provided.',

  // FeeConverter
  'BelowMinimum':            'Accumulated fees are below the minimum conversion threshold ($10 USDC).',
  'ConversionFailed':        'Fee conversion failed — TWAP price may be stale.',
  'FeeConverter__CooldownNotMet': 'Conversion cooldown active — please wait before converting again.',
  'NothingToConvert':        'No fees accumulated to convert.',
  'PairNotRegistered':       'This pair is not registered with the FeeConverter.',
  'SlippageExceeded':        'Conversion slippage too high — try again when price is stable.',
  'TWAPUnavailable':         'TWAP oracle price unavailable — oracle needs to be updated first.',
  'TokenIsUSDC':             'Cannot convert USDC to USDC.',

  // Position Manager
  'InsufficientLiquidity':   'Insufficient liquidity in your position.',
  'NotRouter':               'Only the router can call this.',
  'ZeroLiquidity':           'Liquidity amount must be greater than zero.',

  // Generic
  'user rejected':           'Transaction cancelled.',
  'User rejected':           'Transaction cancelled.',
  'user denied':             'Transaction cancelled.',
  'insufficient funds':      'Insufficient ETH for gas fees.',
  'execution reverted':      'Transaction failed — check your inputs and try again.',
  'UNPREDICTABLE_GAS_LIMIT': 'Transaction would fail — check your inputs.',
  'nonce too low':           'Transaction conflict — please refresh and try again.',
  'replacement fee too low': 'Gas price too low — please try again.',
};

/**
 * Decode a raw contract error message into a human-readable string.
 * Falls back to a cleaned version of the original if no match found.
 */
export function decodeError(raw: unknown): string {
  if (!raw) return 'An unknown error occurred.';

  const msg = raw instanceof Error ? raw.message : String(raw);

  // Check each known error key
  for (const [key, human] of Object.entries(ERROR_MAP)) {
    if (msg.includes(key)) return human;
  }

  // Strip ABI-encoded hex garbage and Solidity boilerplate
  const cleaned = msg
    .replace(/0x[0-9a-fA-F]+/g, '')          // remove hex
    .replace(/\(.*?\)/g, '')                   // remove parenthetical details
    .replace(/execution reverted:/i, '')       // remove prefix
    .replace(/Error:/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If what's left is too short or empty, give a generic message
  if (cleaned.length < 5) return 'Transaction failed — please try again.';

  // Cap length
  return cleaned.length > 120 ? cleaned.slice(0, 120) + '…' : cleaned;
}
