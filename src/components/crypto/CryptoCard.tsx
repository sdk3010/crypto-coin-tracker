import React from 'react';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CryptoAsset } from '@/contexts/CryptoContext';

interface CryptoCardProps {
  asset: CryptoAsset;
  onAddToPortfolio: (asset: CryptoAsset) => void;
}

const CryptoCard = ({ asset, onAddToPortfolio }: CryptoCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: asset.price < 1 ? 6 : 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return formatCurrency(value);
  };

  const isPositive = asset.changePercent24h >= 0;

  return (
    <Card className="hover-lift card-shadow smooth-transition group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg font-bold">
            {asset.image}
          </div>
          <div>
            <p className="text-lg font-semibold">{asset.name}</p>
            <p className="text-sm text-muted-foreground">{asset.symbol}</p>
          </div>
        </CardTitle>
        <Button
          size="sm"
          onClick={() => onAddToPortfolio(asset)}
          className="opacity-0 group-hover:opacity-100 smooth-transition"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{formatCurrency(asset.price)}</span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-accent' : 'text-destructive'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-medium">
                {isPositive ? '+' : ''}{asset.changePercent24h.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">24h Change</p>
              <p className={`font-medium ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                {isPositive ? '+' : ''}{formatCurrency(asset.change24h)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Market Cap</p>
              <p className="font-medium">{formatNumber(asset.marketCap)}</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="text-muted-foreground">24h Volume</p>
            <p className="font-medium">{formatNumber(asset.volume24h)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoCard;