import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock news data - in real app this would come from NewsAPI
const mockNews = [
  {
    id: 1,
    title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
    description: "Major financial institutions continue to embrace Bitcoin as a store of value, driving unprecedented demand.",
    url: "#",
    publishedAt: "2 hours ago",
    source: "CryptoNews",
  },
  {
    id: 2,
    title: "Ethereum 2.0 Staking Rewards Hit Record Levels",
    description: "The transition to proof-of-stake has created new opportunities for passive income generation.",
    url: "#",
    publishedAt: "4 hours ago",
    source: "DeFi Daily",
  },
  {
    id: 3,
    title: "Regulatory Clarity Boosts Crypto Market Confidence",
    description: "New guidelines from financial regulators provide clearer framework for cryptocurrency operations.",
    url: "#",
    publishedAt: "6 hours ago",
    source: "Blockchain Tribune",
  },
  {
    id: 4,
    title: "NFT Market Shows Signs of Recovery",
    description: "Trading volumes increase as new utility-focused projects gain traction.",
    url: "#",
    publishedAt: "8 hours ago",
    source: "Digital Assets Today",
  },
];

const News = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Crypto News
      </h1>

      <div className="grid gap-6">
        {mockNews.map((article) => (
          <Card key={article.id} className="hover-lift card-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{article.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.publishedAt}</span>
                </div>
                <span>•</span>
                <span>{article.source}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{article.description}</p>
              <Button variant="outline" size="sm" className="hover-lift">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;