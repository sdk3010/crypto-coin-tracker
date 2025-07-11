import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  lastUpdated: string;
}

export interface PortfolioItem {
  asset: CryptoAsset;
  amount: number;
  value: number;
}

interface CryptoContextType {
  assets: CryptoAsset[];
  portfolio: PortfolioItem[];
  totalPortfolioValue: number;
  totalPortfolioChange: number;
  totalPortfolioChangePercent: number;
  addToPortfolio: (asset: CryptoAsset, amount: number) => void;
  removeFromPortfolio: (assetId: string) => void;
  updatePortfolioAmount: (assetId: string, amount: number) => void;
  refreshPrices: () => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}

// Mock crypto data - in real app this would come from API
const mockCryptoData: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 43567.89,
    change24h: 1234.56,
    changePercent24h: 2.92,
    marketCap: 853000000000,
    volume24h: 23400000000,
    image: '₿',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2456.78,
    change24h: -67.23,
    changePercent24h: -2.66,
    marketCap: 295000000000,
    volume24h: 12300000000,
    image: 'Ξ',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.4567,
    change24h: 0.0234,
    changePercent24h: 5.41,
    marketCap: 16200000000,
    volume24h: 578000000,
    image: '₳',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    price: 6.789,
    change24h: -0.345,
    changePercent24h: -4.84,
    marketCap: 8900000000,
    volume24h: 234000000,
    image: '●',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    price: 14.56,
    change24h: 0.78,
    changePercent24h: 5.67,
    marketCap: 8100000000,
    volume24h: 456000000,
    image: '⛓',
    lastUpdated: new Date().toISOString(),
  },
];

interface CryptoProviderProps {
  children: React.ReactNode;
}

export function CryptoProvider({ children }: CryptoProviderProps) {
  const [assets, setAssets] = useState<CryptoAsset[]>(mockCryptoData);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('crypto-portfolio');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate portfolio totals
  const totalPortfolioValue = portfolio.reduce((total, item) => total + item.value, 0);
  const totalPortfolioChange = portfolio.reduce((total, item) => 
    total + (item.asset.change24h * item.amount), 0);
  const totalPortfolioChangePercent = totalPortfolioValue > 0 
    ? (totalPortfolioChange / (totalPortfolioValue - totalPortfolioChange)) * 100 
    : 0;

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crypto-portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          const randomChange = (Math.random() - 0.5) * 0.02; // ±1% random change
          const newPrice = asset.price * (1 + randomChange);
          const change24h = newPrice - asset.price;
          const changePercent24h = (change24h / asset.price) * 100;
          
          return {
            ...asset,
            price: newPrice,
            change24h,
            changePercent24h,
            lastUpdated: new Date().toISOString(),
          };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update portfolio values when asset prices change
  useEffect(() => {
    setPortfolio(prevPortfolio => 
      prevPortfolio.map(item => {
        const updatedAsset = assets.find(asset => asset.id === item.asset.id);
        if (updatedAsset) {
          return {
            ...item,
            asset: updatedAsset,
            value: updatedAsset.price * item.amount,
          };
        }
        return item;
      })
    );
  }, [assets]);

  const addToPortfolio = (asset: CryptoAsset, amount: number) => {
    setPortfolio(prev => {
      const existingItem = prev.find(item => item.asset.id === asset.id);
      if (existingItem) {
        return prev.map(item =>
          item.asset.id === asset.id
            ? { ...item, amount: item.amount + amount, value: asset.price * (item.amount + amount) }
            : item
        );
      } else {
        return [...prev, { asset, amount, value: asset.price * amount }];
      }
    });
  };

  const removeFromPortfolio = (assetId: string) => {
    setPortfolio(prev => prev.filter(item => item.asset.id !== assetId));
  };

  const updatePortfolioAmount = (assetId: string, amount: number) => {
    setPortfolio(prev =>
      prev.map(item =>
        item.asset.id === assetId
          ? { ...item, amount, value: item.asset.price * amount }
          : item
      )
    );
  };

  const refreshPrices = () => {
    // Simulate API refresh
    setAssets(prevAssets => 
      prevAssets.map(asset => ({
        ...asset,
        lastUpdated: new Date().toISOString(),
      }))
    );
  };

  return (
    <CryptoContext.Provider value={{
      assets,
      portfolio,
      totalPortfolioValue,
      totalPortfolioChange,
      totalPortfolioChangePercent,
      addToPortfolio,
      removeFromPortfolio,
      updatePortfolioAmount,
      refreshPrices,
    }}>
      {children}
    </CryptoContext.Provider>
  );
}