import { useReadContract } from 'thirdweb/react';
import { getContract } from 'thirdweb';
import { formatUnits } from 'viem';
import { client, arbitrumSepolia } from '../lib/thirdweb';
import { FEE_CONVERTER_ABI } from '../lib/abis/feeConverter';
import { VAULT_ABI } from '../lib/abis/vault';
import { ADDRESSES, TOKENS, type TokenSymbol } from '../lib/contracts';

const converterContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: ADDRESSES.feeConverter,
  abi: FEE_CONVERTER_ABI,
});

const vaultContract = getContract({
  client,
  chain: arbitrumSepolia,
  address: ADDRESSES.vault,
  abi: VAULT_ABI,
});

export function useFeeConverterPreview(
  pairAddress: string | undefined,
  tokenSymbol: TokenSymbol,
) {
  const token = TOKENS[tokenSymbol];

  const { data: preview, isLoading: l1 } = useReadContract({
    contract: converterContract,
    method: 'previewConversion',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      token.address,
    ],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });

  const { data: cooldown, isLoading: l2 } = useReadContract({
    contract: converterContract,
    method: 'cooldownRemaining',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      token.address,
    ],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });

  const { data: rawBal } = useReadContract({
    contract: vaultContract,
    method: 'rawFeeBalances',
    params: [
      (pairAddress ?? '0x0000000000000000000000000000000000000000') as `0x${string}`,
      token.address,
    ],
    queryOptions: { enabled: !!pairAddress, refetchInterval: 15_000 },
  });

  const p = preview as [bigint, bigint, bigint, bigint, boolean] | undefined;
  const rawAmount    = p?.[0] ?? 0n;
  const expectedUsdc = p?.[1] ?? 0n;
  const callerBonus  = p?.[2] ?? 0n;
  const convertible  = p?.[4] ?? false;
  const cooldownSecs = Number((cooldown as bigint | undefined) ?? 0n);
  const balance      = (rawBal as bigint | undefined) ?? 0n;

  return {
    accumulated:     `${parseFloat(formatUnits(balance, token.decimals)).toFixed(4)} ${tokenSymbol}`,
    estUsdcOut:      `~$${parseFloat(formatUnits(expectedUsdc, 6)).toFixed(2)}`,
    yourBonus:       `~$${parseFloat(formatUnits(callerBonus, 6)).toFixed(4)}`,
    cooldownMinutes: Math.ceil(cooldownSecs / 60),
    convertible,
    rawAmount,
    expectedUsdc,
    callerBonus,
    isLoading: l1 || l2,
  };
}
