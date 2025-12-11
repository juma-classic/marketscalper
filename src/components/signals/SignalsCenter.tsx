import React, { useEffect, useState } from 'react';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useStore } from '@/hooks/useStore';
import { derivAPIService } from '@/services/deriv-api.service';
import { signalAnalysisService } from '@/services/signal-analysis.service';
import { SignalTradeResult, signalTradingService } from '@/services/signal-trading.service';
import { EntryAnalysis, EvenOddEntrySuggester } from '@/utils/evenodd-entry-suggester';
import { AutoTradeSettings } from './AutoTradeSettings';
import { ConnectionPoolStatus } from './ConnectionPoolStatus';
import { ConnectionStatus } from './ConnectionStatus';
import { DynamicSignals } from './DynamicSignals';
import { EvenOddSignals } from './EvenOddSignals';
import { FlippingToolSignals } from './FlippingToolSignals';

import { PatternDisplay } from './PatternDisplay';
import { PerformanceDashboard } from './PerformanceDashboard';
import { RiseFallSignals } from './RiseFallSignals';
import { RiskManagementSettings } from './RiskManagementSettings';

import './SignalsCenter.scss';
import './SignalsCenter-visibility.scss';
import './FlippingToolSignals.scss';
import './EvenOddSignals.scss';
import './DynamicSignals.scss';
import './RiseFallSignals.scss';

import './ConnectionPoolStatus.scss';

interface SignalsCenterSignal {
    id: string;
    timestamp: number;
    market: string;
    marketDisplay: string;
    type:
        | 'RISE'
        | 'FALL'
        | 'EVEN'
        | 'ODD'
        | 'OVER1'
        | 'OVER2'
        | 'OVER3'
        | 'OVER4'
        | 'OVER5'
        | 'UNDER1'
        | 'UNDER2'
        | 'UNDER3'
        | 'UNDER4'
        | 'UNDER5';
    entry: number;
    duration: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'CONSERVATIVE' | 'AGGRESSIVE';
    strategy: string;
    source: string;
    status: 'ACTIVE' | 'WON' | 'LOST' | 'EXPIRED' | 'TRADING';
    result?: number;
    entryDigit?: number;
    digitPattern?: number[];
    reason?: string;
    isTrading?: boolean;
    tradeResult?: SignalTradeResult;
    entryAnalysis?: EntryAnalysis;
    recentPattern?: ('EVEN' | 'ODD' | 'RISE' | 'FALL' | 'OVER' | 'UNDER')[];
}

export const SignalsCenter: React.FC = () => {
    const { dashboard } = useStore();
    const { setActiveTab } = dashboard;
    const [signals, setSignals] = useState<SignalsCenterSignal[]>([]);
    const [flippingSignals, setFlippingSignals] = useState<SignalsCenterSignal[]>([]);
    const [evenOddSignals, setEvenOddSignals] = useState<SignalsCenterSignal[]>([]);
    const [dynamicSignals, setDynamicSignals] = useState<SignalsCenterSignal[]>([]);
    const [riseFallSignals, setRiseFallSignals] = useState<SignalsCenterSignal[]>([]);
    const [activeSource, setActiveSource] = useState<
        'all' | 'ai' | 'pattern' | 'technical' | 'flipping' | 'evenodd' | 'dynamic' | 'risefall'
    >('all');
    const [filterMarket, setFilterMarket] = useState<string>('all');
    const [filterStrategy, setFilterStrategy] = useState<string>('all');
    const [filterTime, setFilterTime] = useState<'1m' | '2m' | '3m' | '5m' | '10m' | 'all'>('5m');
    const [showNotifications] = useState(true);
    const [latestSignal, setLatestSignal] = useState<SignalsCenterSignal | null>(null);
    const [defaultStake] = useState<number>(1);
    const [, setTradeStats] = useState(signalTradingService.getStats());
    const [showDashboard, setShowDashboard] = useState(false);
    const [showRiskSettings, setShowRiskSettings] = useState(false);
    const [showAutoTradeSettings, setShowAutoTradeSettings] = useState(false);
    const [isMyTradesExpanded, setIsMyTradesExpanded] = useState(true);
    const [autoTradeEnabled, setAutoTradeEnabled] = useState(signalTradingService.getAutoTradeConfig().enabled);
    const [, forceUpdate] = useState({});
    const [tradeRuns, setTradeRuns] = useState<Record<string, number>>({});
    const [martingalePredictions, setMartingalePredictions] = useState<Record<string, string>>({});
    const [autoLoopRuns, setAutoLoopRuns] = useState<Record<string, number>>({});
    const [isAutoLooping, setIsAutoLooping] = useState<Record<string, boolean>>({});
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [useMartingale, setUseMartingale] = useState<Record<string, boolean>>({});
    const [martingaleMultiplier, setMartingaleMultiplier] = useState<Record<string, number>>({});
    const [tickDuration, setTickDuration] = useState<Record<string, number>>({});
    const [loadingSignals] = useState<Set<string>>(new Set());
    const [loadedSignals] = useState<Set<string>>(new Set());

    const [showConnectionPool, setShowConnectionPool] = useState(false);

    // Request notification permission
    useEffect(() => {
        signalTradingService.requestNotificationPermission();
    }, []);

    // Update trades list when new trades complete
    useEffect(() => {
        const updateInterval = setInterval(() => {
            forceUpdate({});
        }, 1000);

        return () => clearInterval(updateInterval);
    }, []);

    // Auto-trade logic
    useEffect(() => {
        if (!autoTradeEnabled) return;

        const checkAutoTrade = () => {
            console.log('🤖 Auto-trade checking', signals.length, 'signals...');

            signals.forEach(signal => {
                if (signal.isTrading) {
                    console.log('⏭️ Skipping signal (already trading):', signal.id);
                    return;
                }

                const shouldTrade = signalTradingService.shouldAutoTrade(signal);
                console.log('🔍 Signal', signal.id, '- Should trade:', shouldTrade, {
                    market: signal.market,
                    type: signal.type,
                    confidence: signal.confidence,
                    status: signal.status,
                });

                if (shouldTrade) {
                    console.log('✅ Auto-trading signal:', signal.id);
                    handleAutoTrade(signal);
                }
            });
        };

        const interval = setInterval(checkAutoTrade, 2000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signals, autoTradeEnabled]);

    // Handle auto-trade (uses optimal stake from service and multiple runs)
    const handleAutoTrade = async (signal: SignalsCenterSignal) => {
        console.log('🤖 Auto-trading signal:', signal.id);

        // Get auto-trade config
        const autoTradeConfig = signalTradingService.getAutoTradeConfig();
        const numberOfRuns = autoTradeConfig.numberOfRuns || 1;

        // Get optimal stake from service (considers adaptive stake)
        const optimalStake = signalTradingService.getOptimalStake();
        console.log('💰 Using optimal stake:', optimalStake);
        console.log('🔄 Number of runs:', numberOfRuns);

        // Update signal status
        setSignals(prev => prev.map(s => (s.id === signal.id ? { ...s, isTrading: true, status: 'TRADING' } : s)));

        // Get duration from auto-trade settings (overrides signal duration)
        const duration = signalTradingService.getTradeDuration();
        const durationUnit = 't'; // Always use ticks for auto-trade

        console.log(`⏱️ Using configured duration: ${duration} ticks`);

        // Get barrier for digit contracts
        let barrier: string | undefined;
        if (signal.entryDigit !== undefined) {
            barrier = signal.entryDigit.toString();
        }

        // Execute multiple runs
        let totalProfit = 0;
        let successfulRuns = 0;
        let failedRuns = 0;
        const maxTrades = numberOfRuns;

        for (let run = 1; run <= maxTrades; run++) {
            console.log(`🤖 Auto-trade run ${run}/${maxTrades}`);

            const result = await signalTradingService.executeSignalTrade(
                {
                    signalId: `${signal.id}-auto-run${run}`,
                    market: signal.market,
                    type: signal.type,
                    stake: optimalStake,
                    duration,
                    durationUnit: durationUnit as 't' | 'm' | 'h',
                    barrier,
                },
                tradeResult => {
                    console.log(`✅ Auto-trade run ${run} completed:`, tradeResult.profit);
                    totalProfit += tradeResult.profit || 0;
                    if (tradeResult.isWon) {
                        successfulRuns++;
                    } else {
                        failedRuns++;
                    }
                    setTradeStats(signalTradingService.getStats());
                }
            );

            if (!result.success) {
                console.error(`❌ Auto-trade run ${run} failed`);
                failedRuns++;
            }

            // Check if we should stop early (take profit/stop loss)
            if (autoTradeConfig.takeProfit > 0 && totalProfit >= autoTradeConfig.takeProfit) {
                console.log(`🎯 Take profit reached after ${run} runs`);
                break;
            }
            if (autoTradeConfig.stopLoss > 0 && totalProfit <= -autoTradeConfig.stopLoss) {
                console.log(`🛑 Stop loss reached after ${run} runs`);
                break;
            }

            // Small delay between runs (except for last run)
            if (run < maxTrades) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Update signal with final results
        console.log(`🏁 Auto-trade completed. Total profit: ${totalProfit.toFixed(2)}`);
        setSignals(prev =>
            prev.map(s =>
                s.id === signal.id
                    ? {
                          ...s,
                          isTrading: false,
                          status: successfulRuns > failedRuns ? 'WON' : 'LOST',
                          result: totalProfit,
                      }
                    : s
            )
        );
    };

    // Market display mapping
    const getMarketDisplay = (market: string): string => {
        const marketMap: Record<string, string> = {
            '1HZ10V': 'Volatility 10 (1s)',
            '1HZ25V': 'Volatility 25 (1s)',
            '1HZ50V': 'Volatility 50 (1s)',
            '1HZ75V': 'Volatility 75 (1s)',
            '1HZ100V': 'Volatility 100 (1s)',
            R_10: 'Volatility 10',
            R_25: 'Volatility 25',
            R_50: 'Volatility 50',
            R_75: 'Volatility 75',
            R_100: 'Volatility 100',
        };
        return marketMap[market] || market;
    };

    // Subscribe to tick data and generate real signals
    useEffect(() => {
        const markets = ['1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V', 'R_10', 'R_25', 'R_50', 'R_75', 'R_100'];
        const selectedMarket = 'R_50'; // Use R_50 for better compatibility
        let unsubscribeFunc: (() => void) | undefined;

        const subscribeToTicks = async () => {
            try {
                const unsub = await derivAPIService.subscribeToTicks(selectedMarket, tickData => {
                    // Add tick to analysis service with safe access
                    if (tickData?.tick?.quote && tickData?.tick?.epoch) {
                        signalAnalysisService.addTick({
                            quote: tickData.tick.quote,
                            epoch: tickData.tick.epoch,
                        });
                    }
                });
                unsubscribeFunc = unsub;
            } catch (error) {
                console.error('Failed to subscribe to ticks:', error);
                // Generate some initial demo ticks for analysis
                generateDemoTicks();
            }
        };

        // Generate demo ticks for initial analysis
        const generateDemoTicks = () => {
            const basePrice = 1000 + Math.random() * 500;
            for (let i = 0; i < 50; i++) {
                const variation = (Math.random() - 0.5) * 10;
                signalAnalysisService.addTick({
                    quote: basePrice + variation + i * 0.1,
                    epoch: Date.now() - (50 - i) * 2000,
                });
            }
        };

        // Generate initial demo ticks immediately
        generateDemoTicks();

        // Continue generating demo ticks to simulate live data
        const tickInterval = setInterval(() => {
            const basePrice = 1000 + Math.random() * 500;
            const variation = (Math.random() - 0.5) * 10;
            signalAnalysisService.addTick({
                quote: basePrice + variation,
                epoch: Date.now(),
            });
        }, 2000); // New tick every 2 seconds

        subscribeToTicks();

        // Generate initial signals immediately
        const generateInitialSignals = () => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    generateSignalFromAnalysis();
                }, i * 500);
            }
        };

        const generateSignalFromAnalysis = () => {
            const signalResult = signalAnalysisService.generateSignal();

            if (signalResult) {
                const stats = signalAnalysisService.getStatistics();
                const currentMarket = markets[Math.floor(Math.random() * markets.length)];

                // Generate entry analysis and pattern for EVEN/ODD signals
                let entryAnalysis: EntryAnalysis | undefined;
                let recentPattern: ('EVEN' | 'ODD' | 'RISE' | 'FALL')[] | undefined;

                if (signalResult.type === 'EVEN' || signalResult.type === 'ODD') {
                    try {
                        const recentTicks = (
                            signalAnalysisService as unknown as {
                                getRecentTicks: (count: number) => Array<{ quote: number }>;
                            }
                        ).getRecentTicks(100);
                        if (recentTicks && recentTicks.length >= 20) {
                            const quotes = recentTicks.map((t: { quote: number }) => t.quote);

                            // Generate entry analysis
                            entryAnalysis = EvenOddEntrySuggester.analyzeEntry(quotes);
                            console.log('🎯 Entry Analysis for', signalResult.type, ':', entryAnalysis);

                            // Generate pattern (last 18 results)
                            recentPattern = quotes.slice(-18).map((quote: number) => {
                                const lastDigit = Math.abs(Math.floor(quote * 100)) % 10;
                                return lastDigit % 2 === 0 ? 'EVEN' : 'ODD';
                            });
                        }
                    } catch (error) {
                        console.warn('Could not generate entry analysis:', error);
                    }
                }

                // Generate pattern for RISE/FALL signals
                if (signalResult.type === 'RISE' || signalResult.type === 'FALL') {
                    try {
                        const recentTicks = (
                            signalAnalysisService as unknown as {
                                getRecentTicks: (count: number) => Array<{ quote: number }>;
                            }
                        ).getRecentTicks(100);
                        if (recentTicks && recentTicks.length >= 19) {
                            const quotes = recentTicks.map((t: { quote: number }) => t.quote);

                            // Generate pattern (last 18 results)
                            recentPattern = [];
                            for (let i = 1; i < Math.min(19, quotes.length); i++) {
                                recentPattern.push(quotes[i] > quotes[i - 1] ? 'RISE' : 'FALL');
                            }
                            recentPattern = recentPattern.slice(-18);
                        }
                    } catch (error) {
                        console.warn('Could not generate pattern:', error);
                    }
                }

                // Generate pattern for OVER/UNDER signals
                if (signalResult.type.startsWith('OVER') || signalResult.type.startsWith('UNDER')) {
                    try {
                        const recentTicks = (
                            signalAnalysisService as unknown as {
                                getRecentTicks: (count: number) => Array<{ quote: number }>;
                            }
                        ).getRecentTicks(100);
                        if (recentTicks && recentTicks.length >= 18) {
                            const quotes = recentTicks.map((t: { quote: number }) => t.quote);

                            // Get the prediction digit from signal type (e.g., "OVER3" -> 3)
                            const predictionDigit = parseInt(signalResult.type.replace(/[^0-9]/g, ''));

                            // Generate pattern (last 18 results)
                            recentPattern = quotes.slice(-18).map((quote: number) => {
                                const lastDigit = Math.abs(Math.floor(quote * 100)) % 10;
                                return lastDigit > predictionDigit ? 'OVER' : 'UNDER';
                            }) as ('EVEN' | 'ODD' | 'RISE' | 'FALL' | 'OVER' | 'UNDER')[];
                        }
                    } catch (error) {
                        console.warn('Could not generate OVER/UNDER pattern:', error);
                    }
                }

                const newSignal: SignalsCenterSignal = {
                    id: `signal-${Date.now()}-${Math.random()}`,
                    timestamp: Date.now(),
                    market: currentMarket,
                    marketDisplay: getMarketDisplay(currentMarket),
                    type: signalResult.type,
                    entry: stats.tickCount > 0 ? Math.random() * 1000 + 100 : 0,
                    duration: ['1 tick', '5 ticks', '10 ticks'][Math.floor(Math.random() * 3)],
                    confidence: signalResult.confidence,
                    strategy: signalResult.strategy,
                    source: signalResult.strategy.includes('Trend')
                        ? 'technical'
                        : signalResult.strategy.includes('Pattern')
                          ? 'pattern'
                          : 'ai',
                    status: 'ACTIVE',
                    entryDigit: signalResult.entryDigit,
                    digitPattern: signalResult.digitPattern,
                    reason: signalResult.reason,
                    entryAnalysis,
                    recentPattern,
                };

                setSignals(prev => [newSignal, ...prev].slice(0, 50));
                setLatestSignal(newSignal);

                // Show notification
                if (showNotifications) {
                    setTimeout(() => setLatestSignal(null), 5000);
                }
            }
        };

        // Generate initial signals
        generateInitialSignals();

        // Continue generating signals periodically
        const signalInterval = setInterval(() => {
            generateSignalFromAnalysis();
        }, 15000); // Generate signal every 15 seconds

        return () => {
            if (unsubscribeFunc) {
                try {
                    unsubscribeFunc();
                } catch (error) {
                    console.error('Error unsubscribing:', error);
                }
            }
            clearInterval(signalInterval);
            clearInterval(tickInterval);
        };
    }, [showNotifications]);

    // Combine all signals
    const allSignals = [...signals, ...flippingSignals, ...evenOddSignals, ...dynamicSignals, ...riseFallSignals];

    // Filter signals
    const filteredSignals = allSignals.filter(signal => {
        if (activeSource !== 'all' && signal.source !== activeSource) return false;
        if (filterMarket !== 'all' && signal.market !== filterMarket) return false;
        if (filterStrategy !== 'all' && signal.strategy !== filterStrategy) return false;

        if (filterTime !== 'all') {
            const now = Date.now();
            const timeLimits: Record<string, number> = {
                '1m': 1 * 60 * 1000,
                '2m': 2 * 60 * 1000,
                '3m': 3 * 60 * 1000,
                '5m': 5 * 60 * 1000,
                '10m': 10 * 60 * 1000,
            };
            const timeLimit = timeLimits[filterTime];
            if (timeLimit && now - signal.timestamp > timeLimit) return false;
        }

        return true;
    });

    // Execute single trade batch
    const executeTradeBatch = async (signal: SignalsCenterSignal, batchNumber: number, totalBatches: number) => {
        const numberOfRuns = tradeRuns[signal.id] || 1;
        const selectedPrediction = martingalePredictions[signal.id] || signal.type;
        const enableMartingale = useMartingale[signal.id] || false;
        const multiplier = martingaleMultiplier[signal.id] || 2;
        const ticks = tickDuration[signal.id] || 5;
        const maxTrades = autoLoopRuns[signal.id] || 1;

        console.log(`🔄 Batch ${batchNumber}/${totalBatches} - Executing ${numberOfRuns} run(s)...`);
        console.log(`⚙️ Settings: Ticks=${ticks}, Martingale=${enableMartingale ? `ON (${multiplier}x)` : 'OFF'}`);

        // Use custom tick duration
        const duration = ticks;
        const durationUnit = 't';

        // Get barrier for digit contracts
        let barrier: string | undefined;
        if (signal.entryDigit !== undefined) {
            barrier = signal.entryDigit.toString();
        }

        let totalProfit = 0;
        let successfulRuns = 0;
        let failedRuns = 0;
        let currentStake = defaultStake;

        for (let run = 1; run <= maxTrades; run++) {
            const tradeWon = false;
            console.log(`📍 Trade ${run}/${maxTrades} - Stake: $${currentStake.toFixed(2)}`);

            const result = await signalTradingService.executeSignalTrade(
                {
                    signalId: `${signal.id}-batch${batchNumber}-run${run}`,
                    market: signal.market,
                    type: selectedPrediction as SignalsCenterSignal['type'],
                    stake: currentStake,
                    duration,
                    durationUnit: durationUnit as 't' | 'm' | 'h',
                    barrier,
                },
                tradeResult => {
                    totalProfit += tradeResult.profit || 0;
                    if (tradeResult.isWon) {
                        successfulRuns++;
                        // Reset stake on win if martingale is enabled
                        if (enableMartingale) {
                            currentStake = defaultStake;
                            console.log(`✅ Win! Stake reset to $${currentStake.toFixed(2)}`);
                        }
                    } else {
                        failedRuns++;
                        // Increase stake on loss if martingale is enabled
                        if (enableMartingale) {
                            currentStake = currentStake * multiplier;
                            console.log(`❌ Loss! Stake increased to $${currentStake.toFixed(2)}`);
                        }
                    }
                    setTradeStats(signalTradingService.getStats());
                }
            );

            if (!result.success) {
                failedRuns++;
                // Increase stake on failed trade if martingale is enabled

                if (enableMartingale) {
                    currentStake = currentStake * multiplier;
                }

                // Stop on win when martingale is enabled

                if (enableMartingale && tradeWon) {
                    console.log(`✅ Win! Stopping martingale sequence.`);

                    break;
                }
            }

            if (run < maxTrades) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return { totalProfit, successfulRuns, failedRuns };
    };

    // Handle auto-loop trading
    const handleAutoLoopTrade = async (signal: SignalsCenterSignal) => {
        console.log('🔁 Auto-Loop Trade started for signal:', signal.id);

        if (signal.isTrading || isAutoLooping[signal.id]) {
            console.log('⚠️ Signal already trading, ignoring click');
            return;
        }

        const loopCount = autoLoopRuns[signal.id] || 1;
        if (loopCount <= 1) {
            // If loop count is 1 or less, just do regular trade
            return handleTradeSignal(signal);
        }

        // Mark as auto-looping
        setIsAutoLooping(prev => ({ ...prev, [signal.id]: true }));
        setSignals(prev => prev.map(s => (s.id === signal.id ? { ...s, isTrading: true, status: 'TRADING' } : s)));

        let grandTotalProfit = 0;
        let grandTotalWins = 0;
        let grandTotalLosses = 0;

        for (let batch = 1; batch <= loopCount; batch++) {
            // Check if user stopped the loop
            if (!isAutoLooping[signal.id]) {
                console.log('🛑 Auto-loop stopped by user');
                break;
            }

            console.log(`\n🔄 === BATCH ${batch}/${loopCount} ===`);
            const batchResult = await executeTradeBatch(signal, batch, loopCount);

            grandTotalProfit += batchResult.totalProfit;
            grandTotalWins += batchResult.successfulRuns;
            grandTotalLosses += batchResult.failedRuns;

            console.log(`✅ Batch ${batch} complete. Profit: ${batchResult.totalProfit.toFixed(2)}`);
            console.log(`📊 Grand Total: ${grandTotalProfit.toFixed(2)} (${grandTotalWins}W/${grandTotalLosses}L)`);

            // Delay between batches (except for last batch)
            if (batch < loopCount) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Update signal with final results
        console.log(`\n🏁 Auto-loop completed. Grand Total: ${grandTotalProfit.toFixed(2)}`);
        setIsAutoLooping(prev => ({ ...prev, [signal.id]: false }));
        setSignals(prev =>
            prev.map(s =>
                s.id === signal.id
                    ? {
                          ...s,
                          isTrading: false,
                          status: grandTotalWins > grandTotalLosses ? 'WON' : 'LOST',
                          result: grandTotalProfit,
                      }
                    : s
            )
        );
    };

    // Stop auto-loop
    const stopAutoLoop = (signalId: string) => {
        console.log('🛑 Stopping auto-loop for signal:', signalId);
        setIsAutoLooping(prev => ({ ...prev, [signalId]: false }));
    };

    // Load Dollar Printer for RISE/FALL and EVEN/ODD signals (kept for reference, not currently used)
    const loadDollarPrinter = async (signal: SignalsCenterSignal) => {
        try {
            console.log('💵 Loading Dollar Printer for', signal.type);

            // Fetch Dollar Printer XML
            const response = await fetch('/$Dollar printer .xml');
            if (!response.ok) {
                throw new Error(`Failed to fetch Dollar Printer: ${response.statusText}`);
            }

            let botXml = await response.text();

            // Parse and configure XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(botXml, 'text/xml');

            // Update market (SYMBOL_LIST)
            const symbolFields = xmlDoc.querySelectorAll('field[name="SYMBOL_LIST"]');
            symbolFields.forEach(field => {
                field.textContent = signal.market;
                console.log(`📊 Market set to: ${signal.market}`);
            });

            // Determine trade type category, trade type, and contract type based on signal
            let tradeTypeCat = '';
            let tradeType = '';
            let contractType = '';

            if (signal.type === 'RISE' || signal.type === 'FALL') {
                tradeTypeCat = 'callput';
                tradeType = 'risefall';
                contractType = signal.type === 'RISE' ? 'CALL' : 'PUT';
            } else if (signal.type === 'EVEN' || signal.type === 'ODD') {
                tradeTypeCat = 'digits';
                tradeType = 'evenodd';
                contractType = signal.type === 'EVEN' ? 'DIGITEVEN' : 'DIGITODD';
            }

            // Update TRADETYPECAT_LIST (trade type category)
            const tradeTypeCatFields = xmlDoc.querySelectorAll('field[name="TRADETYPECAT_LIST"]');
            tradeTypeCatFields.forEach(field => {
                field.textContent = tradeTypeCat;
                console.log(`📂 Trade type category set to: ${tradeTypeCat}`);
            });

            // Update TRADETYPE_LIST (specific trade type)
            const tradeTypeFields = xmlDoc.querySelectorAll('field[name="TRADETYPE_LIST"]');
            tradeTypeFields.forEach(field => {
                field.textContent = tradeType;
                console.log(`📝 Trade type set to: ${tradeType}`);
            });

            // Update TYPE_LIST (contract type in trade definition)
            const typeFields = xmlDoc.querySelectorAll('field[name="TYPE_LIST"]');
            typeFields.forEach(field => {
                field.textContent = contractType;
                console.log(`📝 Contract type set to: ${contractType}`);
            });

            // Update PURCHASE_LIST (contract type in purchase block)
            const purchaseFields = xmlDoc.querySelectorAll('field[name="PURCHASE_LIST"]');
            purchaseFields.forEach(field => {
                field.textContent = contractType;
                console.log(`💰 Purchase type set to: ${contractType}`);
            });

            // Serialize back to XML
            const serializer = new XMLSerializer();
            botXml = serializer.serializeToString(xmlDoc);

            // Switch to Bot Builder tab
            setActiveTab(DBOT_TABS.BOT_BUILDER);

            // Wait for tab to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // Load the bot XML
            const event = new CustomEvent('bot.load', { detail: { xml: botXml } });
            window.dispatchEvent(event);

            console.log('✅ Dollar Printer loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load Dollar Printer:', error);
            alert(`Failed to load bot: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Load Elvis Speed Bot for OVER/UNDER signals
    const loadElvisSpeedBot = async (signal: SignalsCenterSignal) => {
        try {
            console.log('⚡ Loading Elvis Speed Bot for', signal.type);
            console.log('📋 Signal details:', {
                type: signal.type,
                market: signal.market,
                marketDisplay: signal.marketDisplay,
                entryDigit: signal.entryDigit,
            });

            // Verify market value
            if (!signal.market) {
                throw new Error('Signal market is not defined');
            }

            // Fetch Elvis Speed Bot XML
            const response = await fetch('/Elvis SpeedBot(With Entry).xml');
            if (!response.ok) {
                throw new Error(`Failed to fetch Elvis Speed Bot: ${response.statusText}`);
            }

            let botXml = await response.text();

            // Parse and configure XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(botXml, 'text/xml');

            // Update market (SYMBOL_LIST) - This sets the exact volatility from the signal
            const symbolFields = xmlDoc.querySelectorAll('field[name="SYMBOL_LIST"]');
            console.log('🔍 Found', symbolFields.length, 'SYMBOL_LIST fields');

            if (symbolFields.length === 0) {
                console.warn('⚠️ No SYMBOL_LIST fields found in XML template');
            }

            symbolFields.forEach((field, index) => {
                const oldValue = field.textContent;
                field.textContent = signal.market;
                console.log(`📊 Market Field ${index}: "${oldValue}" → "${signal.market}" (${signal.marketDisplay})`);
            });

            // Determine contract type (DIGITOVER or DIGITUNDER)
            const contractType = signal.type.startsWith('OVER') ? 'DIGITOVER' : 'DIGITUNDER';

            // Update TYPE_LIST (contract type in trade definition)
            const typeFields = xmlDoc.querySelectorAll('field[name="TYPE_LIST"]');
            console.log('🔍 Found', typeFields.length, 'TYPE_LIST fields');
            typeFields.forEach((field, index) => {
                console.log(`📝 Field ${index} before:`, field.textContent);
                field.textContent = contractType;
                console.log(`📝 Field ${index} after:`, field.textContent);
            });

            // Update PURCHASE_LIST (contract type in purchase block)
            const purchaseFields = xmlDoc.querySelectorAll('field[name="PURCHASE_LIST"]');
            purchaseFields.forEach(field => {
                field.textContent = contractType;
                console.log('💰 Set purchase type to:', contractType);
            });

            // Keep the original prompts for Search Number and Stake
            // User will manually enter the entry point and stake values
            console.log('ℹ️ Bot will prompt user for entry point and stake');

            // Extract prediction digit from signal type (e.g., 5 from OVER5, 3 from UNDER3)
            const predictionDigit = parseInt(signal.type.replace(/[^0-9]/g, ''));

            if (!isNaN(predictionDigit)) {
                const predictionValues = xmlDoc.querySelectorAll('value[name="PREDICTION"]');
                console.log('🔍 Found', predictionValues.length, 'PREDICTION value elements');
                console.log('🎯 Setting PREDICTION to:', predictionDigit, '(from', signal.type + ')');

                let predictionUpdated = false;
                predictionValues.forEach((predictionValue, index) => {
                    // Find the shadow block with math_number_positive
                    const shadowBlock = predictionValue.querySelector('shadow[type="math_number_positive"]');
                    if (shadowBlock) {
                        const numField = shadowBlock.querySelector('field[name="NUM"]');
                        if (numField) {
                            const oldValue = numField.textContent;
                            numField.textContent = predictionDigit.toString();
                            predictionUpdated = true;
                            console.log(`✅ PREDICTION ${index}: "${oldValue}" → "${predictionDigit}"`);
                        }
                    }
                });

                if (!predictionUpdated && predictionValues.length > 0) {
                    console.warn('⚠️ PREDICTION field found but could not update');
                }
            }

            // Serialize back to XML
            const serializer = new XMLSerializer();
            botXml = serializer.serializeToString(xmlDoc);

            // Switch to Bot Builder tab
            setActiveTab(DBOT_TABS.BOT_BUILDER);

            // Wait for tab to load
            await new Promise(resolve => setTimeout(resolve, 500));

            // Load the bot
            if (window.load_modal && typeof window.load_modal.loadStrategyToBuilder === 'function') {
                console.log('📤 Loading Elvis Speed Bot to builder...');
                console.log('🎯 Configuration Summary:');
                console.log(`   Market: ${signal.market} (${signal.marketDisplay})`);
                console.log(`   Type: ${signal.type} (${contractType})`);
                console.log(`   Entry Digit: ${signal.entryDigit}`);

                await window.load_modal.loadStrategyToBuilder({
                    id: `elvis-speed-${signal.id}`,
                    name: `Elvis Speed - ${signal.marketDisplay} - ${signal.type} ${signal.entryDigit}`,
                    xml: botXml,
                    save_type: 'LOCAL',
                    timestamp: Date.now(),
                });

                console.log('✅ Elvis Speed Bot loaded successfully!');
                console.log(`✅ Bot is now configured for ${signal.marketDisplay}`);

                // Optional: Show a success notification
                // You can uncomment this if you want a visual confirmation
                // alert(`✅ Bot loaded!\n\nMarket: ${signal.marketDisplay}\nType: ${signal.type}\nEntry: ${signal.entryDigit}`);
            } else {
                throw new Error('Bot loader not available');
            }
        } catch (error) {
            console.error('❌ Failed to load Elvis Speed Bot:', error);
            alert(`Failed to load bot: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    // Handle signal card click
    const handleCardClick = async (signal: SignalsCenterSignal, event: React.MouseEvent) => {
        // Don't trigger if clicking on interactive elements
        const target = event.target as HTMLElement;
        if (
            target.tagName === 'BUTTON' ||
            target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.closest('button') ||
            target.closest('input') ||
            target.closest('select') ||
            target.closest('.trade-controls')
        ) {
            return;
        }

        // Handle active signals
        if (signal.status === 'ACTIVE' && !signal.isTrading && !isAutoLooping[signal.id]) {
            // Check signal type and load appropriate bot
            const isOverUnderSignal = signal.type.startsWith('OVER') || signal.type.startsWith('UNDER');
            const isEvenOddSignal = signal.type === 'EVEN' || signal.type === 'ODD';
            const isRiseFallSignal = signal.type === 'RISE' || signal.type === 'FALL';

            if (isOverUnderSignal && signal.entryDigit !== undefined) {
                // Auto-load Elvis Speed Bot for OVER/UNDER signals
                console.log('🎯 Auto-loading Elvis Speed Bot for signal:', signal.type);
                await loadElvisSpeedBot(signal);
            } else if (isEvenOddSignal) {
                // Auto-load CFX-EvenOdd for EVEN/ODD signals
                console.log('🎯 Auto-loading CFX-EvenOdd for signal:', signal.type);
                const event = new CustomEvent('load.cfx.bot', {
                    detail: {
                        botFile: 'CFX-EvenOdd.xml',
                        signalType: signal.type,
                        market: signal.market,
                    },
                });
                window.dispatchEvent(event);
            } else if (isRiseFallSignal) {
                // Auto-load CFX-RiseFall for RISE/FALL signals
                console.log('🎯 Auto-loading CFX-RiseFall for signal:', signal.type);
                const event = new CustomEvent('load.cfx.bot', {
                    detail: {
                        botFile: 'CFX-RiseFall.xml',
                        signalType: signal.type,
                        market: signal.market,
                    },
                });
                window.dispatchEvent(event);
            } else {
                // Open Free Bots tab for other signals
                console.log('🎯 Opening Free Bots tab for signal:', signal.type);
                setActiveTab(DBOT_TABS.FREE_BOTS);
            }
        }
    };

    // Handle trade from signal with multiple runs
    const handleTradeSignal = async (signal: SignalsCenterSignal) => {
        console.log('🎯 Trade Now clicked for signal:', signal.id);

        if (signal.isTrading) {
            console.log('⚠️ Signal already trading, ignoring click');
            return;
        }

        // Get settings for this signal - Use Auto-Loop as max trades
        const maxTrades = autoLoopRuns[signal.id] || 1;
        const selectedPrediction = martingalePredictions[signal.id] || signal.type;
        const enableMartingale = useMartingale[signal.id] || false;
        const multiplier = martingaleMultiplier[signal.id] || 2;
        const ticks = tickDuration[signal.id] || 5;

        console.log('📊 Signal details:', {
            market: signal.market,
            type: signal.type,
            selectedPrediction: selectedPrediction,
            ticks: ticks,
            stake: defaultStake,
            maxTrades: maxTrades,
            martingale: enableMartingale ? `${multiplier}x` : 'OFF',
        });

        // Update signal status
        setSignals(prev => prev.map(s => (s.id === signal.id ? { ...s, isTrading: true, status: 'TRADING' } : s)));

        // Use custom tick duration
        const duration = ticks;
        const durationUnit = 't';

        console.log('⏱️ Duration:', duration, 'ticks');

        // Get barrier for digit contracts
        let barrier: string | undefined;
        if (signal.entryDigit !== undefined) {
            barrier = signal.entryDigit.toString();
            console.log('🎲 Digit contract barrier:', barrier);
        }

        // Execute trades with martingale - stop on win if martingale enabled
        console.log(`🚀 Starting martingale trading (max ${maxTrades} trades)...`);
        let totalProfit = 0;
        let successfulRuns = 0;
        let failedRuns = 0;
        let currentStake = defaultStake;

        for (let run = 1; run <= maxTrades; run++) {
            let tradeWon = false;
            console.log(`📍 Trade ${run}/${maxTrades} - Stake: $${currentStake.toFixed(2)}`);

            const result = await signalTradingService.executeSignalTrade(
                {
                    signalId: `${signal.id}-run${run}`,
                    market: signal.market,
                    type: selectedPrediction as SignalsCenterSignal['type'],
                    stake: currentStake,
                    duration,
                    durationUnit: durationUnit as 't' | 'm' | 'h',
                    barrier,
                },
                tradeResult => {
                    console.log(`✅ Trade ${run} completed:`, tradeResult.profit);
                    totalProfit += tradeResult.profit || 0;
                    tradeWon = tradeResult.isWon || false;
                    if (tradeResult.isWon) {
                        successfulRuns++;
                        // Reset stake on win if martingale is enabled
                        if (enableMartingale) {
                            currentStake = defaultStake;
                            console.log(`✅ Win! Stake reset to $${currentStake.toFixed(2)}`);
                        }
                    } else {
                        failedRuns++;
                        // Increase stake on loss if martingale is enabled
                        if (enableMartingale) {
                            currentStake = currentStake * multiplier;
                            console.log(`❌ Loss! Stake increased to $${currentStake.toFixed(2)}`);
                        }
                    }

                    // Update stats after each run
                    setTradeStats(signalTradingService.getStats());
                }
            );

            if (!result.success) {
                console.error(`❌ Trade ${run} failed`);
                failedRuns++;
                // Increase stake on failed trade if martingale is enabled

                if (enableMartingale) {
                    currentStake = currentStake * multiplier;
                }

                // Stop on win when martingale is enabled

                if (enableMartingale && tradeWon) {
                    console.log(`✅ Win! Stopping martingale sequence.`);

                    break;
                }
            }

            // Small delay between runs (except for last run)
            if (run < maxTrades) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Update signal with final results
        console.log(`🏁 All runs completed. Total profit: ${totalProfit.toFixed(2)}`);
        setSignals(prev =>
            prev.map(s =>
                s.id === signal.id
                    ? {
                          ...s,
                          isTrading: false,
                          status: successfulRuns > failedRuns ? 'WON' : 'LOST',
                          result: totalProfit,
                      }
                    : s
            )
        );
    };

    // Statistics
    const stats = {
        total: filteredSignals.length,
        active: filteredSignals.filter(s => s.status === 'ACTIVE').length,
        won: filteredSignals.filter(s => s.status === 'WON').length,
        lost: filteredSignals.filter(s => s.status === 'LOST').length,
        winRate:
            filteredSignals.filter(s => s.status !== 'ACTIVE').length > 0
                ? (filteredSignals.filter(s => s.status === 'WON').length /
                      filteredSignals.filter(s => s.status !== 'ACTIVE').length) *
                  100
                : 0,
    };

    return (
        <div className='signals-center-container'>
            {/* Notification */}
            {latestSignal && showNotifications && (
                <div className='signal-notification'>
                    <div className='notification-content'>
                        <span className='notification-icon'>🔔</span>
                        <div className='notification-details'>
                            <strong>New Signal!</strong>
                            <span>
                                {latestSignal.marketDisplay} - {latestSignal.type} - {latestSignal.confidence}{' '}
                                Confidence
                            </span>
                        </div>
                        <button className='notification-close' onClick={() => setLatestSignal(null)}>
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Compact Header Bar */}
            <div className='signals-header-bar'>
                <div className='header-bar-left'>
                    <h2>📡 Signals Center</h2>
                    <ConnectionStatus />
                    <ConnectionPoolStatus compact={true} />
                </div>
                <button
                    className='collapse-toggle-btn'
                    onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                    title={isHeaderCollapsed ? 'Show controls' : 'Hide controls'}
                >
                    {isHeaderCollapsed ? '▼ Show Controls' : '▲ Hide Controls'}
                </button>
            </div>

            {/* Collapsible Header Content */}
            {!isHeaderCollapsed && (
                <>
                    <div className='signals-header'>
                        <div className='header-controls'>
                            <button
                                className={`control-btn ${autoTradeEnabled ? 'active' : ''}`}
                                onClick={() => setShowAutoTradeSettings(true)}
                                title='Configure auto-trade settings'
                            >
                                🤖 Auto-Trade {autoTradeEnabled && '(ON)'}
                            </button>
                            <button
                                className='control-btn'
                                onClick={() => setShowRiskSettings(true)}
                                title='Configure risk management'
                            >
                                ⚠️ Risk
                            </button>
                            <button
                                className='control-btn'
                                onClick={() => setShowDashboard(true)}
                                title='View performance analytics'
                            >
                                📊 Analytics
                            </button>
                            <button
                                className='control-btn'
                                onClick={() => setShowConnectionPool(true)}
                                title='View connection pool status'
                            >
                                🔗 Connections
                            </button>
                        </div>
                    </div>

                    {/* Signal Sources */}
                    <div className='signal-sources'>
                        <button
                            className={activeSource === 'all' ? 'active' : ''}
                            onClick={() => setActiveSource('all')}
                        >
                            🌐 All Sources
                        </button>
                        <button className={activeSource === 'ai' ? 'active' : ''} onClick={() => setActiveSource('ai')}>
                            🤖 AI Signals
                        </button>
                        <button
                            className={activeSource === 'pattern' ? 'active' : ''}
                            onClick={() => setActiveSource('pattern')}
                        >
                            🔍 Pattern Signals
                        </button>
                        <button
                            className={activeSource === 'technical' ? 'active' : ''}
                            onClick={() => setActiveSource('technical')}
                        >
                            📊 Technical Signals
                        </button>
                        <button
                            className={activeSource === 'flipping' ? 'active' : ''}
                            onClick={() => setActiveSource('flipping')}
                        >
                            🔄 Flipping Tool Signals
                        </button>
                        <button
                            className={activeSource === 'evenodd' ? 'active' : ''}
                            onClick={() => setActiveSource('evenodd')}
                        >
                            🎲 EVEN/ODD Signals
                        </button>
                        <button
                            className={activeSource === 'dynamic' ? 'active' : ''}
                            onClick={() => setActiveSource('dynamic')}
                        >
                            🧲 Dynamic Signals
                        </button>
                        <button
                            className={activeSource === 'risefall' ? 'active' : ''}
                            onClick={() => setActiveSource('risefall')}
                        >
                            📊 RISE/FALL Signals
                        </button>
                    </div>

                    {/* Filters */}
                    <div className='signal-filters'>
                        <div className='filter-group'>
                            <label>Market:</label>
                            <select value={filterMarket} onChange={e => setFilterMarket(e.target.value)}>
                                <option value='all'>🌐 All Markets</option>
                                <optgroup label='⚡ 1-Second Indices'>
                                    <option value='1HZ10V'>📊 Volatility 10 (1s)</option>
                                    <option value='1HZ25V'>📊 Volatility 25 (1s)</option>
                                    <option value='1HZ50V'>📊 Volatility 50 (1s)</option>
                                    <option value='1HZ75V'>📊 Volatility 75 (1s)</option>
                                    <option value='1HZ100V'>📊 Volatility 100 (1s)</option>
                                </optgroup>
                                <optgroup label='📈 Standard Indices'>
                                    <option value='R_10'>📉 Volatility 10</option>
                                    <option value='R_25'>📉 Volatility 25</option>
                                    <option value='R_50'>📉 Volatility 50</option>
                                    <option value='R_75'>📉 Volatility 75</option>
                                    <option value='R_100'>📉 Volatility 100</option>
                                </optgroup>
                            </select>
                        </div>

                        <div className='filter-group'>
                            <label>Strategy:</label>
                            <select value={filterStrategy} onChange={e => setFilterStrategy(e.target.value)}>
                                <option value='all'>All Strategies</option>
                                <option value='Trend Following'>📈 Trend Following</option>
                                <option value='Mean Reversion'>🔄 Mean Reversion</option>
                                <option value='Pattern Recognition'>🎯 Pattern Recognition</option>
                                <option value='Hot Digits'>🔥 Hot Digits</option>
                                <option value='Cold Digits'>❄️ Cold Digits</option>
                                <option value='Martingale'>💰 Martingale</option>
                                <option value='Anti-Martingale'>💎 Anti-Martingale</option>
                                <option value='Fibonacci'>🌀 Fibonacci</option>
                                <option value='Breakout'>⚡ Breakout</option>
                                <option value='Support/Resistance'>🎚️ Support/Resistance</option>
                            </select>
                        </div>

                        <div className='filter-group'>
                            <label>Time:</label>
                            <div className='time-buttons'>
                                <button
                                    className={filterTime === '1m' ? 'active' : ''}
                                    onClick={() => setFilterTime('1m')}
                                >
                                    1M
                                </button>
                                <button
                                    className={filterTime === '2m' ? 'active' : ''}
                                    onClick={() => setFilterTime('2m')}
                                >
                                    2M
                                </button>
                                <button
                                    className={filterTime === '3m' ? 'active' : ''}
                                    onClick={() => setFilterTime('3m')}
                                >
                                    3M
                                </button>
                                <button
                                    className={filterTime === '5m' ? 'active' : ''}
                                    onClick={() => setFilterTime('5m')}
                                >
                                    5M
                                </button>
                                <button
                                    className={filterTime === '10m' ? 'active' : ''}
                                    onClick={() => setFilterTime('10m')}
                                >
                                    10M
                                </button>
                                <button
                                    className={filterTime === 'all' ? 'active' : ''}
                                    onClick={() => setFilterTime('all')}
                                >
                                    All
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}



            {/* Hidden Signal Scanners */}
            <div style={{ display: 'none' }}>
                <FlippingToolSignals
                    onSignalsUpdate={newSignals => {
                        setFlippingSignals(newSignals as Signal[]);
                    }}
                />
                <EvenOddSignals
                    onSignalsUpdate={newSignals => {
                        setEvenOddSignals(newSignals as Signal[]);
                    }}
                />
                <DynamicSignals
                    onSignalsUpdate={newSignals => {
                        setDynamicSignals(newSignals as Signal[]);
                    }}
                />
                <RiseFallSignals
                    onSignalsUpdate={newSignals => {
                        setRiseFallSignals(newSignals as Signal[]);
                    }}
                />
            </div>

            {/* Signals List */}
            <div className='signals-list'>
                {filteredSignals.length === 0 ? (
                    <div className='no-signals'>
                        <span className='no-signals-icon'>📭</span>
                        <p>No signals match your filters</p>
                    </div>
                ) : (
                    filteredSignals.map(signal => (
                        <div
                            key={signal.id}
                            className={`signal-card ${signal.status.toLowerCase()} ${loadingSignals.has(signal.id) ? 'loading' : ''} ${loadedSignals.has(signal.id) ? 'loaded' : ''}`}
                            onClick={e => handleCardClick(signal, e)}
                            role='button'
                            tabIndex={0}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    handleCardClick(signal, e as any);
                                }
                            }}
                            title={
                                signal.status === 'ACTIVE' && !signal.isTrading && !isAutoLooping[signal.id]
                                    ? 'Click to load bot with pre-filled parameters'
                                    : undefined
                            }
                        >
                            {/* Loading overlay */}
                            {loadingSignals.has(signal.id) && (
                                <div className='card-loading-overlay'>
                                    <div className='spinner-circle'></div>
                                    <span>Loading bot...</span>
                                </div>
                            )}

                            {/* Loaded indicator */}
                            {loadedSignals.has(signal.id) && (
                                <div className='card-loaded-badge'>
                                    <span>✓ Loaded</span>
                                </div>
                            )}

                            {/* Bot info banner - Show on all active signals */}
                            {signal.status === 'ACTIVE' && !signal.isTrading && !isAutoLooping[signal.id] && (
                                <div className='bot-info-banner'>
                                    <div className='banner-content'>
                                        <span className='bot-icon'>⚡</span>
                                        <div className='banner-info'>
                                            <span className='banner-title'>
                                                {signal.type} • {signal.marketDisplay}
                                                {signal.entryDigit !== undefined && ` • Entry: ${signal.entryDigit}`}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className='load-bot-button'
                                        onClick={e => {
                                            e.stopPropagation();
                                            const isOverUnder =
                                                signal.type.startsWith('OVER') || signal.type.startsWith('UNDER');
                                            const isRiseFall = signal.type === 'RISE' || signal.type === 'FALL';
                                            const isEvenOdd = signal.type === 'EVEN' || signal.type === 'ODD';

                                            if (isOverUnder) {
                                                loadElvisSpeedBot(signal);
                                            } else if (isRiseFall || isEvenOdd) {
                                                loadDollarPrinter(signal);
                                            }
                                        }}
                                        title={
                                            signal.type.startsWith('OVER') || signal.type.startsWith('UNDER')
                                                ? `Load Elvis Speed Bot for ${signal.type}`
                                                : `Load Dollar Printer for ${signal.type}`
                                        }
                                    >
                                        <span>
                                            {signal.type.startsWith('OVER') || signal.type.startsWith('UNDER')
                                                ? '⚡'
                                                : '💵'}
                                        </span>
                                        <span>Load Bot</span>
                                    </button>
                                </div>
                            )}

                            <div className='signal-header'>
                                <div className='signal-market'>
                                    <span className='market-name'>{signal.marketDisplay}</span>
                                    <span className={`confidence-badge ${signal.confidence.toLowerCase()}`}>
                                        {signal.confidence}
                                    </span>
                                </div>
                                <div className='signal-time'>{new Date(signal.timestamp).toLocaleTimeString()}</div>
                            </div>

                            <div className='signal-body'>
                                <div className='signal-type'>
                                    <span className={`type-badge ${signal.type.toLowerCase()}`}>{signal.type}</span>
                                    <span className='duration'>{signal.duration}</span>
                                </div>

                                {signal.entryDigit !== undefined && (
                                    <div className='entry-digit-section'>
                                        <span className='entry-label'>Entry Digit:</span>
                                        <span className='entry-digit-highlight'>{signal.entryDigit}</span>
                                    </div>
                                )}

                                {signal.digitPattern && signal.digitPattern.length > 0 && (
                                    <div className='digit-pattern-section'>
                                        <span className='pattern-label'>Recent Pattern:</span>
                                        <div className='digit-pattern'>
                                            {signal.digitPattern.map((digit, idx) => (
                                                <span key={idx} className='pattern-digit'>
                                                    {digit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {signal.reason && (
                                    <div className='signal-reason'>
                                        <span className='reason-icon'>💡</span>
                                        <span className='reason-text'>{signal.reason}</span>
                                    </div>
                                )}

                                {/* Pattern Display for EVEN/ODD, RISE/FALL, and OVER/UNDER signals */}
                                {signal.recentPattern && signal.recentPattern.length > 0 && (
                                    <PatternDisplay
                                        pattern={signal.recentPattern}
                                        type={
                                            signal.type === 'EVEN' || signal.type === 'ODD'
                                                ? 'evenodd'
                                                : signal.type === 'RISE' || signal.type === 'FALL'
                                                  ? 'risefall'
                                                  : 'overunder'
                                        }
                                    />
                                )}

                                {/* Entry Suggestion for EVEN/ODD signals */}
                                {(signal.type === 'EVEN' || signal.type === 'ODD') &&
                                    signal.entryAnalysis &&
                                    (() => {
                                        const entry = signal.entryAnalysis;
                                        console.log('🔍 Displaying Entry Suggestion for:', signal.id, entry);
                                        return (
                                            <div
                                                className={`entry-suggestion ${entry.confidence.toLowerCase()}-confidence ${entry.suggestedEntry === 'WAIT' ? 'wait-signal' : ''}`}
                                            >
                                                <div className='suggestion-header'>
                                                    <span className='suggestion-icon'>
                                                        {entry.suggestedEntry === 'WAIT' ? '⏸️' : '🎯'}
                                                    </span>
                                                    <span className='suggestion-text'>
                                                        {entry.suggestedEntry === 'WAIT'
                                                            ? 'WAIT'
                                                            : `TRADE ${entry.suggestedEntry}`}
                                                    </span>
                                                    <span
                                                        className={`confidence-badge ${entry.confidence.toLowerCase()}`}
                                                    >
                                                        {entry.confidence}
                                                    </span>
                                                </div>
                                                <div className='suggestion-reason'>{entry.reason}</div>
                                                {entry.suggestedEntry !== 'WAIT' && (
                                                    <div className='suggestion-timing'>
                                                        {entry.timing === 'ENTER_NOW' && '⚡ Enter Now'}
                                                        {entry.timing === 'WAIT_1_TICK' && '⏱️ Wait 1 Tick'}
                                                        {entry.timing === 'WAIT_2_TICKS' && '⏱️ Wait 2 Ticks'}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                <div className='signal-details'>
                                    <div className='detail-item'>
                                        <span className='detail-label'>Strategy:</span>
                                        <span className='detail-value'>{signal.strategy}</span>
                                    </div>
                                    <div className='detail-item'>
                                        <span className='detail-label'>Source:</span>
                                        <span className='detail-value'>
                                            {signal.source === 'ai' && '🤖 AI'}
                                            {signal.source === 'pattern' && '🔍 Pattern'}
                                            {signal.source === 'technical' && '📊 Technical'}
                                            {signal.source === 'flipping' && '🔄 Flipping Tool'}
                                            {signal.source === 'evenodd' && '🎲 EVEN/ODD'}
                                            {signal.source === 'dynamic' && '🧲 Dynamic AI'}
                                            {signal.source === 'risefall' && '📊 RISE/FALL'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='signal-footer'>
                                <div className='footer-left'>
                                    <span className={`status-badge ${signal.status.toLowerCase()}`}>
                                        {signal.status}
                                    </span>
                                    {signal.result !== undefined && (
                                        <span className={`result ${signal.result >= 0 ? 'profit' : 'loss'}`}>
                                            {signal.result >= 0 ? '+' : ''}
                                            {signal.result.toFixed(2)} USD
                                        </span>
                                    )}
                                </div>
                                {signal.status === 'ACTIVE' && !signal.isTrading && !isAutoLooping[signal.id] && (
                                    <div className='trade-controls'>
                                        <div className='martingale-control'>
                                            <label>Prediction:</label>
                                            <select
                                                value={martingalePredictions[signal.id] || signal.type}
                                                onChange={e => {
                                                    setMartingalePredictions(prev => ({
                                                        ...prev,
                                                        [signal.id]: e.target.value,
                                                    }));
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                title='Select prediction for martingale strategy'
                                            >
                                                <optgroup label='Rise/Fall'>
                                                    <option value='RISE'>📈 RISE</option>
                                                    <option value='FALL'>📉 FALL</option>
                                                </optgroup>
                                                <optgroup label='Even/Odd'>
                                                    <option value='EVEN'>⚪ EVEN</option>
                                                    <option value='ODD'>⚫ ODD</option>
                                                </optgroup>
                                                <optgroup label='Over'>
                                                    <option value='OVER1'>⬆️ OVER 1</option>
                                                    <option value='OVER2'>⬆️ OVER 2</option>
                                                    <option value='OVER3'>⬆️ OVER 3</option>
                                                    <option value='OVER4'>⬆️ OVER 4</option>
                                                    <option value='OVER5'>⬆️ OVER 5</option>
                                                </optgroup>
                                                <optgroup label='Under'>
                                                    <option value='UNDER1'>⬇️ UNDER 1</option>
                                                    <option value='UNDER2'>⬇️ UNDER 2</option>
                                                    <option value='UNDER3'>⬇️ UNDER 3</option>
                                                    <option value='UNDER4'>⬇️ UNDER 4</option>
                                                    <option value='UNDER5'>⬇️ UNDER 5</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                        <div className='runs-control'>
                                            <label>Runs:</label>
                                            <input
                                                type='number'
                                                min='1'
                                                max='10'
                                                value={tradeRuns[signal.id] || 1}
                                                onChange={e => {
                                                    const value = parseInt(e.target.value);
                                                    setTradeRuns(prev => ({
                                                        ...prev,
                                                        [signal.id]:
                                                            isNaN(value) || value < 1 ? 1 : Math.min(value, 10),
                                                    }));
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                title='Number of times to execute this trade (1-10)'
                                            />
                                        </div>
                                        <div className='auto-loop-control'>
                                            <label>Auto-Loop:</label>
                                            <input
                                                type='number'
                                                min='1'
                                                max='100'
                                                value={autoLoopRuns[signal.id] || 1}
                                                onChange={e => {
                                                    const value = parseInt(e.target.value);
                                                    setAutoLoopRuns(prev => ({
                                                        ...prev,
                                                        [signal.id]:
                                                            isNaN(value) || value < 1 ? 1 : Math.min(value, 100),
                                                    }));
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                title='Number of times to repeat the batch automatically (1-100)'
                                            />
                                        </div>
                                        <div className='tick-duration-control'>
                                            <label>Ticks:</label>
                                            <input
                                                type='number'
                                                min='1'
                                                max='10'
                                                value={tickDuration[signal.id] || 5}
                                                onChange={e => {
                                                    const value = parseInt(e.target.value);
                                                    setTickDuration(prev => ({
                                                        ...prev,
                                                        [signal.id]:
                                                            isNaN(value) || value < 1 ? 5 : Math.min(value, 10),
                                                    }));
                                                }}
                                                onClick={e => e.stopPropagation()}
                                                title='Number of ticks for each trade (1-10)'
                                            />
                                        </div>
                                        <div className='martingale-control-section'>
                                            <label className='martingale-checkbox'>
                                                <input
                                                    type='checkbox'
                                                    checked={useMartingale[signal.id] || false}
                                                    onChange={e => {
                                                        setUseMartingale(prev => ({
                                                            ...prev,
                                                            [signal.id]: e.target.checked,
                                                        }));
                                                    }}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                                <span>Martingale</span>
                                            </label>
                                            {useMartingale[signal.id] && (
                                                <input
                                                    type='number'
                                                    min='1.1'
                                                    max='5'
                                                    step='0.1'
                                                    value={martingaleMultiplier[signal.id] || 2}
                                                    onChange={e => {
                                                        const value = parseFloat(e.target.value);
                                                        setMartingaleMultiplier(prev => ({
                                                            ...prev,
                                                            [signal.id]:
                                                                isNaN(value) || value < 1.1 ? 2 : Math.min(value, 5),
                                                        }));
                                                    }}
                                                    onClick={e => e.stopPropagation()}
                                                    title='Martingale multiplier (1.1-5x)'
                                                    className='martingale-multiplier-input'
                                                />
                                            )}
                                        </div>
                                        <button
                                            className='trade-now-btn'
                                            onClick={() => {
                                                const loopCount = autoLoopRuns[signal.id] || 1;
                                                if (loopCount > 1) {
                                                    handleAutoLoopTrade(signal);
                                                } else {
                                                    handleTradeSignal(signal);
                                                }
                                            }}
                                            title={`Execute ${tradeRuns[signal.id] || 1} run(s) per batch, ${autoLoopRuns[signal.id] || 1} batch(es) total`}
                                        >
                                            {(autoLoopRuns[signal.id] || 1) > 1 ? '🔁' : '🎯'} Trade Now{' '}
                                            {(tradeRuns[signal.id] || 1) > 1 && `(${tradeRuns[signal.id]}x)`}
                                            {(autoLoopRuns[signal.id] || 1) > 1 && ` ×${autoLoopRuns[signal.id]} loops`}
                                        </button>
                                    </div>
                                )}
                                {(signal.isTrading || isAutoLooping[signal.id]) && (
                                    <div className='trading-controls'>
                                        <span className='trading-indicator'>
                                            {isAutoLooping[signal.id] ? '🔁 Auto-Looping...' : '⏳ Trading...'}
                                        </span>
                                        {isAutoLooping[signal.id] && (
                                            <button
                                                className='stop-loop-btn'
                                                onClick={() => stopAutoLoop(signal.id)}
                                                title='Stop the auto-loop after current batch completes'
                                            >
                                                🛑 Stop Loop
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* My Trades Section */}
            <div className='my-trades-section'>
                <div className='my-trades-header' onClick={() => setIsMyTradesExpanded(!isMyTradesExpanded)}>
                    <h3>📝 My Signal Trades</h3>
                    <div className='header-actions'>
                        {isMyTradesExpanded && (
                            <button
                                className='view-all-btn'
                                onClick={e => {
                                    e.stopPropagation();
                                    setShowDashboard(true);
                                }}
                            >
                                View All
                            </button>
                        )}
                        <button className='toggle-btn'>{isMyTradesExpanded ? '▼' : '▶'}</button>
                    </div>
                </div>
                {isMyTradesExpanded && (
                    <div className='my-trades-list'>
                        {signalTradingService.getHistory().length === 0 ? (
                            <div className='no-trades-message'>
                                <span className='no-trades-icon'>📭</span>
                                <p>No trades yet. Click &quot;Trade Now&quot; on a signal to start!</p>
                            </div>
                        ) : (
                            signalTradingService
                                .getHistory()
                                .slice(0, 5)
                                .map((trade, idx) => (
                                    <div key={idx} className='trade-item'>
                                        <div className='trade-time'>
                                            {new Date(trade.timestamp).toLocaleTimeString()}
                                        </div>
                                        <div className='trade-contract'>
                                            {trade.contractId ? `#${trade.contractId}` : 'Pending'}
                                        </div>
                                        <div className='trade-signal'>Signal: {trade.signalId.slice(0, 12)}...</div>
                                        <div
                                            className={`trade-result ${trade.isWon ? 'success' : trade.profit !== undefined ? 'danger' : 'pending'}`}
                                        >
                                            {trade.profit !== undefined
                                                ? `${trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)} USD`
                                                : trade.error
                                                  ? 'Failed'
                                                  : 'Pending'}
                                        </div>
                                        <div className='trade-status'>
                                            {trade.isWon ? '✅' : trade.profit !== undefined ? '❌' : '⏳'}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                )}
            </div>

            {/* Statistics Footer */}
            <div className='signals-footer'>
                <div className='footer-stat'>
                    <span className='footer-label'>Total Signals:</span>
                    <span className='footer-value'>{stats.total}</span>
                </div>
                <div className='footer-stat'>
                    <span className='footer-label'>Won:</span>
                    <span className='footer-value success'>{stats.won}</span>
                </div>
                <div className='footer-stat'>
                    <span className='footer-label'>Lost:</span>
                    <span className='footer-value danger'>{stats.lost}</span>
                </div>
                <div className='footer-stat'>
                    <span className='footer-label'>Win Rate:</span>
                    <span className='footer-value'>{stats.winRate.toFixed(1)}%</span>
                </div>
            </div>

            {/* Modal Components */}
            {showDashboard && <PerformanceDashboard onClose={() => setShowDashboard(false)} />}

            {showRiskSettings && <RiskManagementSettings onClose={() => setShowRiskSettings(false)} />}

            {showAutoTradeSettings && (
                <AutoTradeSettings
                    onClose={() => {
                        setShowAutoTradeSettings(false);
                        setAutoTradeEnabled(signalTradingService.getAutoTradeConfig().enabled);
                    }}
                />
            )}

            {showConnectionPool && (
                <div className="modal-overlay" onClick={() => setShowConnectionPool(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🔗 Connection Pool Status</h2>
                            <button className="modal-close" onClick={() => setShowConnectionPool(false)}>×</button>
                        </div>
                        <ConnectionPoolStatus compact={false} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignalsCenter;
