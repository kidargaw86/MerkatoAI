import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import LiveFeed from "./components/Dashboard/LiveFeed";
import StatsCards from "./components/Dashboard/StatsCards";
import RecentAlerts from "./components/Dashboard/RecentAlerts";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Header />
          <StatsCards />
          <LiveFeed />
          <RecentAlerts />
        </main>
      </div>
    </div>
  );
}
