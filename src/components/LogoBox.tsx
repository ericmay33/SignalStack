import { useState } from "react";

interface LogoBoxProps {
  ticker: string;
  size?: number;
}

export default function LogoBox({ ticker, size = 48 }: LogoBoxProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {!failed ? (
        <img
          src={`https://assets.allinvestview.com/logos/${ticker}.png`}
          alt={ticker}
          className="w-full h-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-primary font-bold text-lg">$</span>
      )}
    </div>
  );
}
