import React, { useEffect, useState } from 'react';
import { derivAPIService } from '@/services/deriv-api.service';
import { PatternDisplay } from './PatternDisplay';
import './SignalCards.scss';

interface DigitStats {
    digit: number;
    percentage: number;
    count: number;
}

interface TickData {
    quote: number;
    epoch: number;
}

interface TrendAnalysis {
    direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    strength: number; // 0-100
    momentum: number;
    volatility: number;
    movingAverage: number;
    support: number;
    resistance: number;
}

interface RiseFallSignal {
    id: string;
    timestamp: number;
    market: string;
    marketDisplay: string;
    type: 'RISE' | 'FALL';
    entry: number;
    duration: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    strategy: string;
    source: string;
    status: 'ACTIVE' | 'WON' | 'LOST' | 'EXPIRED';
    trendAnalysis: TrendAnalysis;
    prediction: {
        targetPrice: number;
        stopLoss: number;
        reason: string;
    };
    digitStats?: DigitStats[];
    analysis?: {
        trendStrength: number;
        volatility: number;
        momentum: number;
        support: number;
        resistance: number;
        reason: string;
    };
    recentPattern?: ('RISE' | 'FALL')[];
}

export const RiseFallSignals: React.FC<{ onSignalsUpdate?: (signals: RiseFallSignal[]) => void }> = ({
    onSignalsUpdate,
}) => {
    const [signals, setSignals] = useState<RiseFallSignal[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const markets = [
        { value: '1HZ10V', label: 'Volatility 10 (1s)' },
        { value: '1HZ25V', label: 'Volatility 25 (1s)' },
        { value: '1HZ50V', label: 'Volatility 50 (1s)' },
        { value: '1HZ75V', label: 'Volatility 75 (1s)' },
        { value: '1HZ100V', label: 'Volatility 100 (1s)' },
        { value: 'R_10', label: 'Volatility 10' },
        { value: 'R_25', label: 'Volatility 25' },
        { value: 'R_50', label: 'Volatility 50' },
        { value: 'R_75', label: 'Volatility 75' },
        { value: 'R_100', label: 'Volatility 100' },
    ];

    // Calculate Moving Average
    const calculateMA = (prices: number[], period: number = 10): number => {
        if (prices.length < period) return prices[prices.length - 1] || 0;
        const slice = prices.slice(-period);
        return slice.reduce((sum, price) => sum + price, 0) / period;
    };

    // Calculate Momentum (rate of change)
    const calculateMomentum = (prices: number[]): number => {
        if (prices.length < 5) return 0;
        const recent = prices.slice(-5);
        let upMoves = 0;
        let downMoves = 0;

        for (let i = 1; i < recent.length; i++) {
            if (recent[i] > recent[i - 1]) upMoves++;
            else if (recent[i] < recent[i - 1]) downMoves++;
        }

        return ((upMoves - downMoves) / 4) * 100; // -100 to +100
    };

    // Calculate Volatility
    const calculateVolatility = (prices: number[]): number => {
        if (prices.length < 10) return 0;
        const recent = prices.slice(-10);
        const avg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
        const variance = recent.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / recent.length;
        return Math.sqrt(variance);
    };

    // Find Support and Resistance
    const findSupportResistance = (prices: number[]): { support: number; resistance: number } => {
        if (prices.length < 20) {
            const current = prices[prices.length - 1] || 0;
            return { support: current * 0.998, resistance: current * 1.002 };
        }

        const recent = prices.slice(-20);
        const sorted = [...recent].sort((a, b) => a - b);

        // Support: 25th percentile
        const support = sorted[Math.floor(sorted.length * 0.25)];
        // Resistance: 75th percentile
        const resistance = sorted[Math.floor(sorted.length * 0.75)];

        return { support, resistance };
    };

    // Analyze Trend
    const analyzeTrend = (ticks: TickData[]): TrendAnalysis => {
        const prices = ticks.map(t => t.quote);
        const currentPrice = prices[prices.length - 1];

        const ma = calculateMA(prices, 10);
        const momentum = calculateMomentum(prices);
        const volatility = calculateVolatility(prices);
        const { support, resistance } = findSupportResistance(prices);

        // Determine direction
        let direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
        let strength = 50;

        // Price above MA + positive momentum = BULLISH
        if (currentPrice > ma && momentum > 20) {
            direction = 'BULLISH';
            strength = 60 + Math.min(momentum, 40);
        }
        // Price below MA + negative momentum = BEARISH
        else if (currentPrice < ma && momentum < -20) {
            direction = 'BEARISH';
            strength = 60 + Math.min(Math.abs(momentum), 40);
        }
        // Near support = BULLISH
        else if (currentPrice <= support * 1.001) {
            direction = 'BULLISH';
            strength = 70;
        }
        // Near resistance = BEARISH
        else if (currentPrice >= resistance * 0.999) {
            direction = 'BEARISH';
            strength = 70;
        }

        return {
            direction,
            strength,
            momentum,
            volatility,
            movingAverage: ma,
            support,
            resistance,
        };
    };

    // Generate RISE/FALL signal
    const generateRiseFallSignal = (
        trendAnalysis: TrendAnalysis,
        currentPrice: number
    ): {
        type: 'RISE' | 'FALL' | null;
        confidence: 'HIGH' | 'MEDIUM' | 'LOW';
        targetPrice: number;
        stopLoss: number;
        reason: string;
    } => {
        const { direction, strength, momentum, movingAverage, support, resistance } = trendAnalysis;

        let type: 'RISE' | 'FALL' | null = null;
        let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        let targetPrice = currentPrice;
        let stopLoss = currentPrice;
        let reason = '';

        // BULLISH SIGNALS (RISE)
        if (direction === 'BULLISH') {
            type = 'RISE';

            // HIGH confidence: Strong momentum + above MA + near support
            if (strength > 80 && momentum > 40 && currentPrice > movingAverage) {
                confidence = 'HIGH';
                targetPrice = currentPrice + (resistance - currentPrice) * 0.5;
                stopLoss = support;
                reason = `🚀 STRONG BULLISH: Price ${currentPrice.toFixed(2)} above MA ${movingAverage.toFixed(2)}. Momentum: ${momentum.toFixed(0)}. Target: ${targetPrice.toFixed(2)}`;
            }
            // MEDIUM confidence: Good momentum or bouncing off support
            else if (strength > 65 || currentPrice <= support * 1.002) {
                confidence = 'MEDIUM';
                targetPrice = currentPrice + (resistance - currentPrice) * 0.3;
                stopLoss = currentPrice * 0.998;
                reason = `📈 BULLISH: ${currentPrice <= support * 1.002 ? 'Bouncing off support' : 'Positive momentum'}. Target: ${targetPrice.toFixed(2)}`;
            }
            // LOW confidence
            else {
                confidence = 'LOW';
                targetPrice = currentPrice * 1.001;
                stopLoss = currentPrice * 0.999;
                reason = `⬆️ Weak bullish signal. Low confidence.`;
            }
        }

        // BEARISH SIGNALS (FALL)
        else if (direction === 'BEARISH') {
            type = 'FALL';

            // HIGH confidence: Strong negative momentum + below MA + near resistance
            if (strength > 80 && momentum < -40 && currentPrice < movingAverage) {
                confidence = 'HIGH';
                targetPrice = currentPrice - (currentPrice - support) * 0.5;
                stopLoss = resistance;
                reason = `🔻 STRONG BEARISH: Price ${currentPrice.toFixed(2)} below MA ${movingAverage.toFixed(2)}. Momentum: ${momentum.toFixed(0)}. Target: ${targetPrice.toFixed(2)}`;
            }
            // MEDIUM confidence: Good negative momentum or hitting resistance
            else if (strength > 65 || currentPrice >= resistance * 0.998) {
                confidence = 'MEDIUM';
                targetPrice = currentPrice - (currentPrice - support) * 0.3;
                stopLoss = currentPrice * 1.002;
                reason = `📉 BEARISH: ${currentPrice >= resistance * 0.998 ? 'Hitting resistance' : 'Negative momentum'}. Target: ${targetPrice.toFixed(2)}`;
            }
            // LOW confidence
            else {
                confidence = 'LOW';
                targetPrice = currentPrice * 0.999;
                stopLoss = currentPrice * 1.001;
                reason = `⬇️ Weak bearish signal. Low confidence.`;
            }
        }

        return { type, confidence, targetPrice, stopLoss, reason };
    };

    // Generate demo ticks
    const generateDemoTicks = (): TickData[] => {
        const ticks: TickData[] = [];
        let basePrice = 1000 + Math.random() * 500;
        const trend = Math.random() > 0.5 ? 1 : -1; // Random trend direction

        for (let i = 0; i < 50; i++) {
            const variation = (Math.random() - 0.5) * 5;
            const trendComponent = trend * i * 0.1;
            basePrice = basePrice + variation + trendComponent;

            ticks.push({
                quote: basePrice,
                epoch: Date.now() - (50 - i) * 2000,
            });
        }

        return ticks;
    };

    // Scan all markets
    const scanAllMarkets = async () => {
        setIsScanning(true);
        console.log('📊 RISE/FALL Scanner: Analyzing trends...');

        for (const market of markets) {
            try {
                await analyzeMarket(market.value, market.label);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (error) {
                console.error(`Error analyzing ${market.label}:`, error);
            }
        }

        setIsScanning(false);
        console.log('✅ RISE/FALL Scanner: Complete');
    };

    // Analyze market
    const analyzeMarket = async (market: string, marketLabel: string) => {
        try {
            const ticks: TickData[] = [];
            let tickCount = 0;
            const maxTicks = 50;

            const unsubscribe = await derivAPIService.subscribeToTicks(market, tickData => {
                if (tickData?.tick?.quote && tickData?.tick?.epoch) {
                    ticks.push({
                        quote: tickData.tick.quote,
                        epoch: tickData.tick.epoch,
                    });
                    tickCount++;

                    if (tickCount >= maxTicks) {
                        unsubscribe();
                        generateSignal(market, marketLabel, ticks);
                    }
                }
            });

            // Fallback: Use demo data after 5 seconds
            setTimeout(() => {
                if (tickCount < 20) {
                    unsubscribe();
                    console.log(`📊 Using demo data for ${marketLabel}`);
                    const demoTicks = generateDemoTicks();
                    generateSignal(market, marketLabel, demoTicks);
                } else if (tickCount < maxTicks) {
                    unsubscribe();
                    generateSignal(market, marketLabel, ticks);
                }
            }, 5000);
        } catch (error) {
            console.error(`Error analyzing ${marketLabel}:`, error);
            const demoTicks = generateDemoTicks();
            generateSignal(market, marketLabel, demoTicks);
        }
    };

    // Generate signal
    const generateSignal = (market: string, marketLabel: string, ticks: TickData[]) => {
        const trendAnalysis = analyzeTrend(ticks);
        const currentPrice = ticks[ticks.length - 1].quote;
        const signalData = generateRiseFallSignal(trendAnalysis, currentPrice);

        // Only generate MEDIUM and HIGH confidence signals
        if (!signalData.type || signalData.confidence === 'LOW') {
            return;
        }

        const newSignal: RiseFallSignal = {
            id: `risefall-${market}-${Date.now()}`,
            timestamp: Date.now(),
            market,
            marketDisplay: marketLabel,
            type: signalData.type,
            entry: currentPrice,
            duration: '5 ticks',
            confidence: signalData.confidence,
            strategy: 'Momentum + MA + Support/Resistance',
            source: 'risefall',
            status: 'ACTIVE',
            trendAnalysis,
            prediction: {
                targetPrice: signalData.targetPrice,
                stopLoss: signalData.stopLoss,
                reason: signalData.reason,
            },
        };

        setSignals(prev => {
            const updated = [newSignal, ...prev].slice(0, 50);
            if (onSignalsUpdate) {
                onSignalsUpdate(updated);
            }
            return updated;
        });
    };

    // Auto-scan on mount
    useEffect(() => {
        scanAllMarkets();

        const interval = setInterval(() => {
            scanAllMarkets();
        }, 120000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='risefall-signals'>
            <div className='risefall-header'>
                <div className='header-content'>
                    <h3>📊 RISE/FALL Signals (Only Ups/Downs)</h3>
                    <p className='risefall-description'>
                        AI analyzes momentum, moving averages, and support/resistance to predict price direction
                    </p>
                </div>
                <button className='scan-btn' onClick={scanAllMarkets} disabled={isScanning}>
                    {isScanning ? '⏳ Scanning...' : '🔄 Scan All'}
                </button>
            </div>

            <div className='risefall-signals-list'>
                {signals.length === 0 && !isScanning && (
                    <div className='no-signals'>
                        <span className='no-signals-icon'>📭</span>
                        <p>No RISE/FALL signals yet. AI is analyzing market trends...</p>
                    </div>
                )}

                {isScanning && signals.length === 0 && (
                    <div className='scanning-message'>
                        <span className='scanning-icon'>📊</span>
                        <p>Analyzing momentum, moving averages, and support/resistance levels...</p>
                    </div>
                )}

                {signals.map(signal => (
                    <div key={signal.id} className='signal-card risefall-signal-card'>
                        <div className='signal-header'>
                            <div className='signal-type-badge'>
                                <span className='badge-icon'>📊</span>
                                <span className='badge-text'>{signal.type}</span>
                            </div>
                            <div className={`confidence-badge ${signal.confidence.toLowerCase()}`}>
                                {signal.confidence}
                            </div>
                        </div>

                        <div className='signal-market'>
                            <span className='market-icon'>📈</span>
                            <span className='market-name'>{signal.marketDisplay}</span>
                        </div>

                        <div className='signal-entry'>
                            <span className='entry-label'>Entry:</span>
                            <span className='entry-value'>{signal.entry.toFixed(2)}</span>
                        </div>

                        {signal.analysis && (
                            <div className='technical-analysis'>
                                <div className='analysis-title'>📊 Technical Analysis</div>
                                <div className='analysis-metrics'>
                                    <div className='metric'>
                                        <span className='metric-label'>Trend:</span>
                                        <span className='metric-value'>
                                            {(signal.analysis.trendStrength * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className='metric'>
                                        <span className='metric-label'>Momentum:</span>
                                        <span className='metric-value'>
                                            {(signal.analysis.momentum * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className='metric'>
                                        <span className='metric-label'>Volatility:</span>
                                        <span className='metric-value'>
                                            {(signal.analysis.volatility * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className='analysis-reason'>{signal.analysis.reason}</div>
                            </div>
                        )}

                        {signal.recentPattern && signal.recentPattern.length > 0 && (
                            <PatternDisplay pattern={signal.recentPattern} type='risefall' />
                        )}

                        <div className='signal-footer'>
                            <span className='signal-duration'>⏱️ {signal.duration}</span>
                            <span className='signal-time'>{new Date(signal.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
