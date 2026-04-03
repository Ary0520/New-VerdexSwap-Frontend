import { createThirdwebClient, defineChain } from 'thirdweb';

// Arbitrum Sepolia — chain ID 421614
export const arbitrumSepolia = defineChain(421614);

// Thirdweb client — get your clientId from https://thirdweb.com/dashboard
export const client = createThirdwebClient({
  clientId: '4c9289acc6c24844e9e0db4533f93516',
});
