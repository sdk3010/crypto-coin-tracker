import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrypto } from '@/contexts/CryptoContext';

const Analytics = () => {
  const { portfolio, assets } = useCrypto();

  const portfolioData = useMemo(() => {
    return portfolio.map(item => ({
      name: item.asset.symbol,
      value: item.value,
      percentage: portfolio.length > 0 ? (item.value / portfolio.reduce((sum, p) => sum + p.value, 0)) * 100 : 0,
      color: getColorForAsset(item.asset.symbol),
    }));
  }, [portfolio]);

  const performanceData = useMemo(() => {
    return portfolio.map(item => ({
      name: item.asset.symbol,
      change: item.asset.changePercent24h,
      value: item.value,
    }));
  }, [portfolio]);

  const marketData = useMemo(() => {
    return assets.map(asset => ({
      name: asset.symbol,
      price: asset.price,
      change: asset.changePercent24h,
      marketCap: asset.marketCap / 1e9, // Convert to billions
    }));
  }, [assets]);

  function getColorForAsset(symbol: string) {
    const colors = [
      '#f97316', // orange (Bitcoin)
      '#3b82f6', // blue (Ethereum)
      '#ef4444', // red
      '#10b981', // green
      '#8b5cf6', // purple
      '#f59e0b', // amber
    ];
    const index = symbol.charCodeAt(0) % colors.length;
    return colors[index];
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (portfolio.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Analytics
        </h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                📊
              </div>
              <h3 className="text-xl font-semibold">No data to analyze</h3>
              <p className="text-muted-foreground">
                Add some cryptocurrencies to your portfolio to see analytics
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Analytics
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Portfolio Distribution */}
        <Card className="hover-lift card-shadow">
          <CardHeader>
            <CardTitle>Portfolio Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 24h Performance */}
        <Card className="hover-lift card-shadow">
          <CardHeader>
            <CardTitle>24h Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)}%`, '24h Change']}
                  />
                  <Bar 
                    dataKey="change" 
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {/* Market Overview Chart */}
        <Card className="hover-lift card-shadow">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Summary Table */}
        <Card className="hover-lift card-shadow">
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Asset</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Value</th>
                    <th className="text-right py-2">24h Change</th>
                    <th className="text-right py-2">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((item, index) => {
                    const portfolioItem = portfolio.find(p => p.asset.symbol === item.name);
                    if (!portfolioItem) return null;
                    
                    return (
                      <tr key={item.name} className="border-b hover:bg-muted/50">
                        <td className="py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{portfolioItem.asset.image}</span>
                            <div>
                              <p className="font-medium">{portfolioItem.asset.name}</p>
                              <p className="text-sm text-muted-foreground">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3">{portfolioItem.amount.toFixed(6)}</td>
                        <td className="text-right py-3">{formatCurrency(portfolioItem.asset.price)}</td>
                        <td className="text-right py-3 font-medium">{formatCurrency(item.value)}</td>
                        <td className={`text-right py-3 ${portfolioItem.asset.changePercent24h >= 0 ? 'text-accent' : 'text-destructive'}`}>
                          {portfolioItem.asset.changePercent24h >= 0 ? '+' : ''}{portfolioItem.asset.changePercent24h.toFixed(2)}%
                        </td>
                        <td className="text-right py-3">{formatPercentage(item.percentage)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;