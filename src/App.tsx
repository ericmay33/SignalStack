import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListManager from "./pages/ListManager";
import Dashboard from "./pages/Dashboard";
import { useWatchlist } from "./hooks/useWatchlist";
import { useStockData } from "./hooks/useStockData";

type Page = "list" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("list");
  const [transitioning, setTransitioning] = useState(false);
  const { tickers, setTickers } = useWatchlist();
  const { data, loading, error, retry } = useStockData(
    page === "dashboard" ? tickers : []
  );

  const navigate = (target: Page) => {
    setTransitioning(true);
    setTimeout(() => {
      setPage(target);
      setTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen relative bg-[#0e0e0e]">
      <Header
        page={page}
        tickers={tickers}
        onBack={() => navigate("list")}
      />
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.98)" : "scale(1)",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {page === "list" ? (
          <ListManager
            tickers={tickers}
            setTickers={setTickers}
            onApply={() => navigate("dashboard")}
          />
        ) : (
          <Dashboard
            tickers={tickers}
            data={data}
            loading={loading}
            error={error}
            retry={retry}
          />
        )}
      </div>
      <Footer data={page === "dashboard" ? data : null} />
    </div>
  );
}
