import { useProtocolKPIs } from '../../hooks/useAnalytics';

const KpiCard = ({ label, value, sub, color, live }: {
  label: string; value: string | null; sub?: string | null; color: string; live: boolean;
}) => (
  <div className="rounded-xl px-4 py-3 flex flex-col gap-1"
    style={{ background: '#1C1B1C', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="flex items-center gap-1">
      <span className="text-xs uppercase tracking-widest"
        style={{ color: '#B9CBBC', fontFamily: 'Inter', letterSpacing: '0.07em', fontSize: 9 }}>
        {label}
      </span>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: live ? '#00FF9D' : '#3B4A3F' }} />
    </div>
    <span className="font-black font-headline text-lg leading-tight" style={{ color }}>
      {value ?? '—'}
    </span>
    {sub && (
      <span className="text-xs" style={{ color: '#00E38B', fontFamily: 'Inter', fontSize: 10 }}>{sub}</span>
    )}
  </div>
);

const ProtocolKPIs = () => {
  const kpis = useProtocolKPIs();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
      <KpiCard label="Total TVL"       value={kpis.tvl}            color="#00FF9D" live={true} />
      <KpiCard label="Vault TVL"       value={kpis.vaultTvl}       color="#00E38B" live={true} />
      <KpiCard label="Active Pools"    value={String(kpis.activePools || '—')} color="#E5E2E3" live={true} />
      <KpiCard label="24h Volume"      value={kpis.vol24h}         color="#568DFF" live={kpis.vol24h !== null} sub={kpis.vol24h ? 'from subgraph' : 'syncing…'} />
      <KpiCard label="Total Fees"      value={kpis.feesTotal}      color="#56FFA8" live={kpis.feesTotal !== null} />
      <KpiCard label="IL Payouts"      value={kpis.ilPayouts}      color="#FFB400" live={kpis.ilPayouts !== null} />
      <KpiCard label="Fee Conversions" value={kpis.feeConversions} color="#FF6464" live={kpis.feeConversions !== null} />
    </div>
  );
};

export default ProtocolKPIs;
