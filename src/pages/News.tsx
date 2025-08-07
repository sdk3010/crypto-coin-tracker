import React from 'react';
import { ExternalLink, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

const CRYPTO_NEWS_API_KEY = '2f8b5402-afb0-4ecd-bce7-59341a196c72';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  tags: string[];
  sentiment: string;
}

interface ApiResponse {
  status: string;
  data: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  try {
    console.log('Fetching crypto news...');
    const response = await fetch('https://api.cryptonewsapi.online/api/v1/news', {
      headers: {
        'X-API-KEY': CRYPTO_NEWS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    console.log('API Response:', data);
    
    if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Unexpected data structure:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return []; // Always return an array
  }
};

const News = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['crypto-news'],
    queryFn: fetchCryptoNews,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Crypto News
        </h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading latest crypto news...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Crypto News
        </h1>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Failed to load crypto news. Please try again later.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Crypto News
      </h1>

      <div className="grid gap-6">
        {(news || []).map((article) => (
          <Card key={article.id} className="hover-lift card-shadow">
            <CardHeader>
              <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                </div>
                <span>•</span>
                <span>{article.source}</span>
                {article.sentiment && (
                  <>
                    <span>•</span>
                    <span className={`capitalize ${
                      article.sentiment === 'positive' ? 'text-green-500' :
                      article.sentiment === 'negative' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {article.sentiment}
                    </span>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {article.summary.length > 200 ? `${article.summary.substring(0, 200)}...` : article.summary}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover-lift"
                onClick={() => window.open(`#article-${article.id}`, '_blank')}
              >
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