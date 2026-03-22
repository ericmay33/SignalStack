import { useState } from "react";

interface LogoBoxProps {
  ticker: string;
  size?: number;
}

/** Known ticker → domain overrides for tickers whose domain doesn't match the company name */
const DOMAIN_OVERRIDES: Record<string, string> = {
  GOOGL: "google.com",
  GOOG: "google.com",
  META: "meta.com",
  AMZN: "amazon.com",
  NVDA: "nvidia.com",
  MSFT: "microsoft.com",
  AAPL: "apple.com",
  TSLA: "tesla.com",
  AVGO: "broadcom.com",
  CRM: "salesforce.com",
  ORCL: "oracle.com",
  CSCO: "cisco.com",
  INTC: "intel.com",
  QCOM: "qualcomm.com",
  AMD: "amd.com",
  PLTR: "palantir.com",
  SOFI: "sofi.com",
  BRK_B: "berkshirehathaway.com",
  BF_B: "brown-forman.com",
  V: "visa.com",
  MA: "mastercard.com",
  JPM: "jpmorganchase.com",
  BAC: "bankofamerica.com",
  WFC: "wellsfargo.com",
  GS: "goldmansachs.com",
  MS: "morganstanley.com",
  C: "citigroup.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  DIS: "disney.com",
  NFLX: "netflix.com",
  PYPL: "paypal.com",
  SBUX: "starbucks.com",
  NKE: "nike.com",
  HD: "homedepot.com",
  LOW: "lowes.com",
  TGT: "target.com",
  WMT: "walmart.com",
  COST: "costco.com",
  UNH: "unitedhealthgroup.com",
  JNJ: "jnj.com",
  PFE: "pfizer.com",
  MRK: "merck.com",
  LLY: "lilly.com",
  ABBV: "abbvie.com",
  TMO: "thermofisher.com",
  ABT: "abbott.com",
  BMY: "bms.com",
  CVX: "chevron.com",
  XOM: "exxonmobil.com",
  COP: "conocophillips.com",
  BA: "boeing.com",
  CAT: "caterpillar.com",
  HON: "honeywell.com",
  GE: "ge.com",
  RTX: "rtx.com",
  LMT: "lockheedmartin.com",
  UPS: "ups.com",
  FDX: "fedex.com",
  T: "att.com",
  VZ: "verizon.com",
  TMUS: "t-mobile.com",
  CMCSA: "comcast.com",
  CHTR: "charter.com",
  NOW: "servicenow.com",
  INTU: "intuit.com",
  ADBE: "adobe.com",
  SNPS: "synopsys.com",
  CDNS: "cadence.com",
  PANW: "paloaltonetworks.com",
  CRWD: "crowdstrike.com",
  FTNT: "fortinet.com",
  ANET: "arista.com",
};

export default function LogoBox({ ticker, size = 48 }: LogoBoxProps) {
  const [failed, setFailed] = useState(false);
  const domain = DOMAIN_OVERRIDES[ticker] ?? `${ticker.toLowerCase().replace(/_/g, "")}.com`;

  return (
    <div
      className="rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden"
      style={{ width: size, height: size }}
    >
      {!failed ? (
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
