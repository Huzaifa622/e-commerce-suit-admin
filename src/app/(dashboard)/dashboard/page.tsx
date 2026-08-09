'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// E-commerce sales overview data
const revenueData = [
  { name: 'Jan', revenue: 2400, sales: 400 },
  { name: 'Feb', revenue: 1398, sales: 300 },
  { name: 'Mar', revenue: 9800, sales: 2000 },
  { name: 'Apr', revenue: 3908, sales: 2780 },
  { name: 'May', revenue: 4800, sales: 1890 },
  { name: 'Jun', revenue: 3800, sales: 2390 },
  { name: 'Jul', revenue: 4300, sales: 3490 },
  { name: 'Aug', revenue: 9200, sales: 4000 },
  { name: 'Sep', revenue: 11000, sales: 4800 },
  { name: 'Oct', revenue: 8800, sales: 4200 },
  { name: 'Nov', revenue: 12500, sales: 5100 },
  { name: 'Dec', revenue: 14200, sales: 6200 },
];

const recentOrders = [
  { id: 'ORD-7392', customer: 'Sophia Anderson', email: 'sophia@example.com', status: 'delivered', total: 320.00, date: '2 mins ago' },
  { id: 'ORD-4829', customer: 'Jackson Lee', email: 'jackson@example.com', status: 'pending', total: 1250.50, date: '10 mins ago' },
  { id: 'ORD-1092', customer: 'Isabella Nguyen', email: 'isabella@example.com', status: 'delivered', total: 89.99, date: '1 hour ago' },
  { id: 'ORD-8823', customer: 'William Kim', email: 'will@example.com', status: 'cancelled', total: 245.00, date: '3 hours ago' },
  { id: 'ORD-9901', customer: 'Emma Watson', email: 'emma@example.com', status: 'delivered', total: 540.00, date: '5 hours ago' },
];

export default function DashboardOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#E7E8EA] dark:bg-zinc-900">
        <RefreshCw className="h-6 w-6 animate-spin text-[#5030E5]" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#E7E8EA] dark:bg-zinc-900 -m-6 md:-m-8 p-6 md:p-8 flex justify-center items-start">
      {/* Rectangle 1 - Big Dashboard Container Card with shadow and border radius */}
      <div className="w-full max-w-[1440px] bg-white dark:bg-zinc-950 rounded-[30px] shadow-[0px_44px_84px_6px_#D8D9DB] dark:shadow-none border border-zinc-150/60 dark:border-zinc-850 p-6 md:p-8 flex flex-col gap-6 transition-all duration-300">
        
        {/* Header Title section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 dark:border-zinc-900 pb-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0D062D] dark:text-zinc-50 font-sans">Overview</h1>
            <p className="text-xs text-[#787486] dark:text-zinc-400 font-medium">Real-time statistics and store metrics dashboard.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs border-zinc-200/80 dark:border-zinc-800/80">
              Download Report
            </Button>
            <Button size="sm" className="h-8 text-xs bg-[#5030E5] text-white hover:bg-[#4020D5] rounded-lg">
              Customize View
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-xs border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-[#787486] dark:text-zinc-400">Total Revenue</CardTitle>
              <div className="p-1.5 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-lg text-emerald-600 dark:text-emerald-500">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0D062D] dark:text-zinc-50">$45,231.89</div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-500 font-medium font-sans">
                <ArrowUpRight className="h-3 w-3" />
                <span>+20.1%</span>
                <span className="text-[#787486] dark:text-zinc-500 font-normal">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-[#787486] dark:text-zinc-400">New Sales</CardTitle>
              <div className="p-1.5 bg-blue-500/10 dark:bg-blue-500/5 rounded-lg text-blue-600 dark:text-blue-500">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0D062D] dark:text-zinc-50">+2,350</div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 dark:text-emerald-500 font-medium font-sans">
                <ArrowUpRight className="h-3 w-3" />
                <span>+18.4%</span>
                <span className="text-[#787486] dark:text-zinc-500 font-normal">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-[#787486] dark:text-zinc-400">Active Products</CardTitle>
              <div className="p-1.5 bg-[#5030E5]/10 rounded-lg text-[#5030E5]">
                <Package className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0D062D] dark:text-zinc-50">12,234</div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-550 font-medium font-sans">
                <span>+19 new added</span>
                <span className="text-[#787486] dark:text-zinc-500 font-normal">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-[#787486] dark:text-zinc-400">Active Customers</CardTitle>
              <div className="p-1.5 bg-amber-500/10 dark:bg-amber-500/5 rounded-lg text-amber-600 dark:text-amber-500">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0D062D] dark:text-zinc-50">+573</div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-rose-600 dark:text-rose-500 font-medium font-sans">
                <ArrowDownRight className="h-3 w-3" />
                <span>-3.2%</span>
                <span className="text-[#787486] dark:text-zinc-500 font-normal">since yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Table Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="lg:col-span-4 shadow-xs border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/5 dark:bg-zinc-950/5 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-sm font-semibold text-[#0D062D] dark:text-zinc-50 font-sans">Revenue Overview</CardTitle>
                <CardDescription className="text-[10px] mt-0.5 text-[#787486] dark:text-zinc-400">Monthly revenue compared with sales volume.</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#5030E5]" />
                  <span className="text-[#787486]">Revenue</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5030E5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#5030E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.95)', 
                        borderColor: '#e4e4e7',
                        borderRadius: '8px',
                        fontSize: '11px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                      }} 
                      labelStyle={{ fontWeight: 'bold', color: '#18181b' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#5030E5" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      activeDot={{ r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-3 shadow-xs border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/5 dark:bg-zinc-950/5 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0D062D] dark:text-zinc-50 font-sans">Recent Sales</CardTitle>
              <CardDescription className="text-[10px] mt-0.5 text-[#787486] dark:text-zinc-500">You made 265 sales this week.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-zinc-100 dark:border-zinc-800">
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">{order.customer}</span>
                        <span className="text-[10px] text-[#787486] dark:text-zinc-500 mt-0.5">{order.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-[#0D062D] dark:text-zinc-50">${order.total.toFixed(2)}</span>
                      <Badge 
                        variant="outline" 
                        className={`
                          text-[8px] font-semibold px-1.5 py-0 rounded-full border-0 uppercase tracking-wide
                          ${order.status === 'delivered' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-500' 
                            : order.status === 'pending' 
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-500' 
                            : 'bg-red-500/10 text-red-600 dark:bg-red-500/5'
                          }
                        `}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
