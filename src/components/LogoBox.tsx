import { useState } from "react";

interface LogoBoxProps {
  ticker: string;
  size?: number;
}

const TICKER_DOMAINS: Record<string, string> = {
  NVDA: "nvidia.com",
  AAPL: "apple.com",
  TSLA: "tesla.com",
  MSFT: "microsoft.com",
  AMZN: "amazon.com",
  META: "meta.com",
  GOOGL: "google.com",
  AMD: "amd.com",
  PLTR: "palantir.com",
  SOFI: "sofi.com",
};

export default function LogoBox({ ticker, size = 48 }: LogoBoxProps) {
  const [failed, setFailed] = useState(false);
  const domain = TICKER_DOMAINS[ticker];

  return (
    <div
      className="rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {domain && !failed ? (
        <img
          src={`https://logo.clearbit.com/${domain}`}
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
