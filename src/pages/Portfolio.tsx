import React, { useState } from 'react';
import { Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import { useCrypto } from '@/contexts/CryptoContext';
import { toast } from '@/hooks/use-toast';

const Portfolio = () => {
  const { portfolio, removeFromPortfolio, updatePortfolioAmount } = useCrypto();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleRemove = (assetId: string, assetName: string) => {
    removeFromPortfolio(assetId);
    toast({
      title: "Removed from Portfolio",
      description: `${assetName} has been removed from your portfolio`,
    });
  };

  const handleEdit = (assetId: string, currentAmount: number) => {
    setEditingItem(assetId);
    setNewAmount(currentAmount.toString());
  };

  const handleUpdateAmount = () => {
    if (editingItem && newAmount && parseFloat(newAmount) > 0) {
      updatePortfolioAmount(editingItem, parseFloat(newAmount));
      toast({
        title: "Portfolio Updated",
        description: "Asset amount has been updated",
      });
      setEditingItem(null);
      setNewAmount('');
    }
  };

  if (portfolio.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Portfolio
        </h1>
        <PortfolioSummary />
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Your portfolio is empty</h3>
              <p className="text-muted-foreground">
                Start by adding some cryptocurrencies from the dashboard
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
        Portfolio
      </h1>
      
      <PortfolioSummary />

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Holdings</h2>
        <div className="grid gap-4">
          {portfolio.map((item) => {
            const isPositive = item.asset.changePercent24h >= 0;
            const dailyChange = item.asset.change24h * item.amount;
            
            return (
              <Card key={item.asset.id} className="hover-lift card-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl font-bold">
                      {item.asset.image}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{item.asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.amount} {item.asset.symbol}
                      </p>
                    </div>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item.asset.id, item.amount)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.asset.id, item.asset.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Price</p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(item.asset.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(item.value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">24h Change</p>
                      <div className={`flex items-center space-x-1 ${isPositive ? 'text-accent' : 'text-destructive'}`}>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {isPositive ? '+' : ''}{item.asset.changePercent24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily P&L</p>
                      <p className={`font-semibold ${dailyChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {dailyChange >= 0 ? '+' : ''}{formatCurrency(dailyChange)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Amount Dialog */}
      <Dialog open={editingItem !== null} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newAmount">New Amount</Label>
              <Input
                id="newAmount"
                type="number"
                step="0.001"
                placeholder="Enter new amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateAmount}
                disabled={!newAmount || parseFloat(newAmount) <= 0}
                className="flex-1"
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;