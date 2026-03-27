

const CompetitorComparisonTable = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto overflow-x-auto">
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
            <tr className="border-b border-outline-variant/20 hover:bg-surface-container-high/20 transition-colors">
              <td className="py-6 px-4 font-bold">IL Protection</td>
              <td className="text-center text-error"><span className="material-symbols-outlined" data-icon="close">close</span></td>
              <td className="text-center text-secondary">V3 Only</td>
              <td className="text-center text-primary-container font-bold">Native &amp; Sustainable</td>
            </tr>
            <tr className="border-b border-outline-variant/20 hover:bg-surface-container-high/20 transition-colors">
              <td className="py-6 px-4 font-bold">Fee Tiers</td>
              <td className="text-center">Single (0.3%)</td>
              <td className="text-center">Fixed</td>
              <td className="text-center text-primary-container font-bold">Triple-Dynamic</td>
            </tr>
            <tr className="border-b border-outline-variant/20 hover:bg-surface-container-high/20 transition-colors">
              <td className="py-6 px-4 font-bold">Oracle Source</td>
              <td className="text-center">Spot</td>
              <td className="text-center">Chainlink</td>
              <td className="text-center text-primary-container font-bold">Resilient TWAP</td>
            </tr>
            <tr className="border-b border-outline-variant/20 hover:bg-surface-container-high/20 transition-colors">
              <td className="py-6 px-4 font-bold">Stable LP Yield</td>
              <td className="text-center">Fee Only</td>
              <td className="text-center">Fee Only</td>
              <td className="text-center text-primary-container font-bold">Fee + Insurance Premium</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CompetitorComparisonTable;
