import { useCallback, useState } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import LiveFeed from "./components/Dashboard/LiveFeed";
import StatsCards from "./components/Dashboard/StatsCards";
import RecentAlerts from "./components/Dashboard/RecentAlerts";
import InventoryUpload from "./components/Inventory/InventoryUpload";
import InventoryList from "./components/Inventory/InventoryList";

export default function App() {
  const [inventoryVersion, setInventoryVersion] = useState(0);
  const onInventorySaved = useCallback(() => {
    setInventoryVersion((v) => v + 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 space-y-6 p-6">
          <Header />
          <StatsCards key={inventoryVersion} />
          <div className="grid gap-6 lg:grid-cols-2">
            <InventoryUpload onSaved={onInventorySaved} />
            <InventoryList key={inventoryVersion} />
          </div>
          <LiveFeed />
          <RecentAlerts />
        </main>
      </div>
    </div>
  );
}
