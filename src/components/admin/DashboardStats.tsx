import { Card } from '../ui/card';

interface DashboardStatsProps {
  stats: {
    products: number;
    orders: number;
    users: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-8 rounded-xl shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center border border-mangla-gold">
        <div className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Total Products</div>
        <div className="text-4xl font-extrabold text-mangla-gold drop-shadow">{stats.products}</div>
      </Card>
      <Card className="p-8 rounded-xl shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center border border-green-400">
        <div className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Total Orders</div>
        <div className="text-4xl font-extrabold text-green-500 drop-shadow">{stats.orders}</div>
      </Card>
      <Card className="p-8 rounded-xl shadow bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 text-center border border-purple-400">
        <div className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Total Users</div>
        <div className="text-4xl font-extrabold text-purple-500 drop-shadow">{stats.users}</div>
      </Card>
    </div>
  );
} 