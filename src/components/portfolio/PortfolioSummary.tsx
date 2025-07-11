import React from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCrypto } from '@/contexts/CryptoContext';

const PortfolioSummary = () => {
  const { totalPortfolioValue, totalPortfolioChange, totalPortfolioChangePercent, portfolio } = useCrypto();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const isPositive = totalPortfolioChange >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover-lift card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
          <p className="text-xs text-muted-foreground">
            Across {portfolio.length} assets
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Change</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-accent" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? 'text-accent' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{formatCurrency(totalPortfolioChange)}
          </div>
          <p className={`text-xs ${isPositive ? 'text-accent' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{totalPortfolioChangePercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          {portfolio.length > 0 ? (
            (() => {
              const bestPerformer = portfolio.reduce((best, current) => 
                current.asset.changePercent24h > best.asset.changePercent24h ? current : best
              );
              return (
                <>
                  <div className="text-2xl font-bold">{bestPerformer.asset.symbol}</div>
                  <p className="text-xs text-accent">
                    +{bestPerformer.asset.changePercent24h.toFixed(2)}%
                  </p>
                </>
              );
            })()
          ) : (
            <>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">No assets</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="hover-lift card-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Assets</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{portfolio.length}</div>
          <p className="text-xs text-muted-foreground">
            Active holdings
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;