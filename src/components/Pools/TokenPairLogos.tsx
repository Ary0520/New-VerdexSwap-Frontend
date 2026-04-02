type Token = { symbol: string; icon: string; color: string };

const TokenIcon = ({ token, size = 28 }: { token: Token; size?: number }) => {
  if (token.icon) {
    return (
      <img
        src={token.icon}
        alt={token.symbol}
        className="rounded-full flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
      style={{
        width: size,
        height: size,
        background: token.color,
        fontSize: size * 0.32,
        fontFamily: 'Space Grotesk',
      }}
    >
      {token.symbol.slice(0, 2)}
    </div>
  );
};

const TokenPairLogos = ({
  token0,
  token1,
}: {
  token0: Token;
  token1: Token;
}) => {
  return (
    <div className="flex items-center">
      <TokenIcon token={token0} />
      <TokenIcon token={token1} size={28} />
      <span
        className="ml-2 font-bold text-sm"
        style={{ fontFamily: 'Space Grotesk', color: '#E5E2E3' }}
      >
        {token0.symbol}/{token1.symbol}
      </span>
    </div>
  );
};

export default TokenPairLogos;
