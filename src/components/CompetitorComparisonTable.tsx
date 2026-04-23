const CompetitorComparisonTable = () => (
  <section className="py-24 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-headline font-black mb-4">Why VerdexSwap is different.</h2>
        <p className="text-on-surface-variant">Not different in marketing. Different in architecture.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50">
              <th className="text-left py-6 px-4 font-headline text-on-surface-variant uppercase text-xs tracking-widest">Feature</th>
              <th className="text-center py-6 px-4 font-headline text-on-surface-variant uppercase text-xs tracking-widest">Uniswap V2</th>
              <th className="text-center py-6 px-4 font-headline text-on-surface-variant uppercase text-xs tracking-widest">Bancor</th>
              <th className="text-center py-6 px-4 font-headline text-primary-container uppercase text-xs tracking-widest">VerdexSwap</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { feature: 'IL Protection',       uni: '✗ None',          ban: 'Token-funded (dilutive)', vdx: 'Fee-funded USDC payout' },
              { feature: 'Oracle Type',         uni: 'Spot price',       ban: 'Chainlink',               vdx: 'Manipulation-resistant TWAP' },
              { feature: 'Fee Tiers',           uni: 'Single (0.3%)',    ban: 'Fixed',                   vdx: '3 tiers by asset class' },
              { feature: 'Payout Mechanism',    uni: '—',                ban: 'Manual claim',            vdx: 'Automatic at withdrawal' },
              { feature: 'Protocol Take Rate',  uni: '~17% of fees',     ban: 'Variable',                vdx: '0% (testnet phase)' },
              { feature: 'Vault Sustainability', uni: '—',               ban: 'Token inflation',         vdx: 'Self-sustaining fee loop' },
            ].map(row => (
              <tr key={row.feature} className="border-b border-outline-variant/20 hover:bg-surface-container-high/20 transition-colors">
                <td className="py-5 px-4 font-bold">{row.feature}</td>
                <td className="text-center py-5 px-4 text-on-surface-variant">{row.uni}</td>
                <td className="text-center py-5 px-4 text-on-surface-variant">{row.ban}</td>
                <td className="text-center py-5 px-4 text-primary-container font-bold">{row.vdx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default CompetitorComparisonTable;
