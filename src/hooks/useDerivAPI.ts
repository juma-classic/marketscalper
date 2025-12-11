import { useCallback, useEffect, useRef, useState } from 'react';
import { derivAPIService } from '@/services/deriv-api.service';
import type {
    TCandlesSubscribeResponse,
    TPortfolioResponse,
    TTicksSubscribeResponse,
} from '@/types/deriv-api.types';

/**
 * Hook for using Deriv API service with React
 */
export const useDerivAPI = () => {
    return derivAPIService;
};

/**
 * Hook for subscribing to real-time ticks
 */
export const useTicksSubscription = (symbol: string, enabled = true) => {
    const [tickData, setTickData] = useState<TTicksSubscribeResponse['tick'] | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const subscriptionIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled || !symbol) return;

        const subscribe = async () => {
            try {
                const id = await derivAPIService.subscribeToTicks(symbol, data => {
                    setTickData(data.tick);
                });
                subscriptionIdRef.current = id || null;
                setIsSubscribed(true);
            } catch (error) {
                console.error('Failed to subscribe to ticks:', error);
            }
        };

        subscribe();

        return () => {
            if (subscriptionIdRef.current) {
                derivAPIService.unsubscribe(subscriptionIdRef.current);
                setIsSubscribed(false);
            }
        };
    }, [symbol, enabled]);

    return { tickData, isSubscribed };
};

/**
 * Hook for subscribing to real-time candles
 */
export const useCandlesSubscription = (symbol: string, granularity: number, enabled = true) => {
    const [candleData, setCandleData] = useState<TCandlesSubscribeResponse['ohlc'] | null>(null);
    const [candles, setCandles] = useState<TCandlesSubscribeResponse['candles']>([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const subscriptionIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled || !symbol) return;

        const subscribe = async () => {
            try {
                const id = await derivAPIService.subscribeToCandles(symbol, granularity, data => {
                    if (data.ohlc) {
                        setCandleData(data.ohlc);
                    }
                    if (data.candles) {
                        setCandles(data.candles);
                    }
                });
                subscriptionIdRef.current = id || null;
                setIsSubscribed(true);
            } catch (error) {
                console.error('Failed to subscribe to candles:', error);
            }
        };

        subscribe();

        return () => {
            if (subscriptionIdRef.current) {
                derivAPIService.unsubscribe(subscriptionIdRef.current);
                setIsSubscribed(false);
            }
        };
    }, [symbol, granularity, enabled]);

    return { candleData, candles, isSubscribed };
};

/**
 * Hook for subscribing to portfolio changes
 */
export const usePortfolioSubscription = (enabled = true) => {
    const [portfolio, setPortfolio] = useState<TPortfolioResponse['portfolio'] | null>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const subscriptionIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const subscribe = async () => {
            try {
                const id = await derivAPIService.subscribeToPortfolio(data => {
                    setPortfolio(data.portfolio);
                });
                subscriptionIdRef.current = id || null;
                setIsSubscribed(true);
            } catch (error) {
                console.error('Failed to subscribe to portfolio:', error);
            }
        };

        subscribe();

        return () => {
            if (subscriptionIdRef.current) {
                derivAPIService.unsubscribe(subscriptionIdRef.current);
                setIsSubscribed(false);
            }
        };
    }, [enabled]);

    return { portfolio, isSubscribed };
};

/**
 * Hook for fetching portfolio data
 */
export const usePortfolio = () => {
    const [portfolio, setPortfolio] = useState<TPortfolioResponse['portfolio'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchPortfolio = useCallback(async (contract_type?: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const response = await derivAPIService.getPortfolio(contract_type);
            setPortfolio(response.portfolio);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { portfolio, loading, error, fetchPortfolio };
};

/**
 * Hook for fetching profit table
 */
export const useProfitTable = () => {
    const [profitTable, setProfitTable] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfitTable = useCallback(async (options?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await derivAPIService.getProfitTable(options);
            setProfitTable(response.profit_table);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { profitTable, loading, error, fetchProfitTable };
};

/**
 * Hook for fetching statement
 */
export const useStatement = () => {
    const [statement, setStatement] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStatement = useCallback(async (options?: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await derivAPIService.getStatement(options);
            setStatement(response.statement);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { statement, loading, error, fetchStatement };
};
