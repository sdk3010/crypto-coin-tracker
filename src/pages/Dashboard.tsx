import React, { useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CryptoCard from '@/components/crypto/CryptoCard';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import { useCrypto, CryptoAsset } from '@/contexts/CryptoContext';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { assets, addToPortfolio, refreshPrices } = useCrypto();
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [amount, setAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToPortfolio = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const handleConfirmAdd = () => {
    if (selectedAsset && amount && parseFloat(amount) > 0) {
      addToPortfolio(selectedAsset, parseFloat(amount));
      toast({
        title: "Added to Portfolio",
        description: `${amount} ${selectedAsset.symbol} added to your portfolio`,
      });
      setAmount('');
      setIsDialogOpen(false);
      setSelectedAsset(null);
    }
  };

  const lastUpdated = new Date(assets[0]?.lastUpdated || Date.now()).toLocaleTimeString();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Portfolio Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Button
            onClick={refreshPrices}
            variant="outline"
            size="sm"
            className="hover-lift"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <PortfolioSummary />
      </div>

      {/* Market Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Market Overview</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <CryptoCard
              key={asset.id}
              asset={asset}
              onAddToPortfolio={handleAddToPortfolio}
            />
          ))}
        </div>
      </div>

      {/* Add to Portfolio Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {selectedAsset?.name} to Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({selectedAsset?.symbol})</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>
            
            {selectedAsset && amount && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span>Price per {selectedAsset.symbol}:</span>
                  <span className="font-medium">
                    ${selectedAsset.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: selectedAsset.price < 1 ? 6 : 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Value:</span>
                  <span className="text-primary">
                    ${(selectedAsset.price * parseFloat(amount || '0')).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAdd}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Portfolio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;