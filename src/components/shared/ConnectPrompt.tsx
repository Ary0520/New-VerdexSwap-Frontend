import { ConnectButton } from 'thirdweb/react';
import { client } from '../../lib/thirdweb';
import { arbitrumSepolia } from '../../lib/thirdweb';

type Props = {
  title: string;
  description: string;
  icon?: string;
};

const ConnectPrompt = ({ title, description, icon = 'account_balance_wallet' }: Props) => (
  <div className="flex flex-col items-center justify-center py-24 gap-6">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.15)' }}>
      <span className="material-symbols-outlined text-4xl"
        style={{ color: '#00E38B', fontSize: 32, fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
    </div>
    <div className="flex flex-col items-center gap-2 text-center max-w-sm">
      <h3 className="font-black text-xl font-headline" style={{ color: '#E5E2E3', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: '#B9CBBC', fontFamily: 'Inter' }}>
        {description}
      </p>
    </div>
    <ConnectButton
      client={client}
      chain={arbitrumSepolia}
      connectButton={{
        label: 'Connect Wallet',
        style: {
          background: '#00FF9D',
          color: '#007143',
          fontFamily: 'Space Grotesk',
          fontWeight: 900,
          fontSize: 14,
          borderRadius: 10,
          padding: '12px 28px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px -4px rgba(0,255,157,0.3)',
        },
      }}
    />
  </div>
);

export default ConnectPrompt;
