import React, { useEffect, useRef, useState } from 'react';
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import { useStore } from '@/hooks/useStore';
import type { TradingSettings } from './TradingConfig';
import type { Transaction } from './TransactionHistory';
import './TradingEngine.scss';

interface TradingStats {
    totalTrades: number;
    wins: number;
    losses: number;
    totalProfit: number;
    winRate: number;
    currentStreak: number;
    consecutiveLosses: number;
}

interface TradingEngineProps {
    settings: TradingSettings;
    onTradeExecuted?: (transaction: Transaction) => void;
}

export const TradingEngine: React.FC<TradingEngineProps> = ({ settings, onTradeExecuted }) => {
    const { client } = useStore();
    const currency = client.currency || 'USD';
    const [currentTick, setCurrentTick] = useState<number>(0);
    const [lastDigit, setLastDigit] = useState<number>(0);
    const [isAutoTrading, setIsAutoTrading] = useState(false);
    const [isTrading, setIsTrading] = useState(false);
    const [tradeError, setTradeError] = useState('');
    const [stats, setStats] = useState<TradingStats>({
        totalTrades: 0,
        wins: 0,
        losses: 0,
        totalProfit: 0,
        winRate: 0,
        currentStreak: 0,
        consecutiveLosses: 0,
    });
    const [lastTradeResult, setLastTradeResult] = useState<'win' | 'loss' | null>(null);
    const tickSubscriptionRef = useRef<string | null>(null);
    const autoTradingRef = useRef(false);
    const lastTickRef = useRef<number>(0);

    // Martingale state
    const [martingaleStep, setMartingaleStep] = useState(0);
    const [consecutiveLosses, setConsecutiveLosses] = useState(0);

    // Trade Every Tick state
    const [tickTradeCount, setTickTradeCount] = useState(0);

    // Get current base stake (always use latest settings)
    const getBaseStake = () => settings.stake;

    // Calculate current Martingale stake based on consecutive losses
    const getCurrentMartingaleStake = (): number => {
        if (!settings.enableMartingale || consecutiveLosses === 0) {
            return getBaseStake();
        }

        const multiplier = settings.martingaleMultiplier || 2;
        const maxSteps = settings.martingaleMaxSteps || 5;
        const effectiveStep = Math.min(consecutiveLosses, maxSteps);

        const calculatedStake = getBaseStake() * Math.pow(multiplier, effectiveStep);
        console.log('🎯 Martingale Calculation:', {
            baseStake: getBaseStake(),
            consecutiveLosses,
            effectiveStep,
            multiplier,
            calculatedStake,
        });

        return calculatedStake;
    };

    // Update Martingale state after trade result
    const updateMartingaleAfterTrade = (isWin: boolean) => {
        if (!settings.enableMartingale) {
            return;
        }

        console.log('📊 Updating Martingale after trade:', { isWin, currentConsecutiveLosses: consecutiveLosses });

        if (isWin) {
            // Reset on win (if resetOnWin is enabled)
            if (settings.martingaleResetOnWin !== false) {
                console.log('✅ Win - Resetting Martingale to base stake');
                setConsecutiveLosses(0);
                setMartingaleStep(0);
            }
        } else {
            // Increase step on loss
            const newConsecutiveLosses = consecutiveLosses + 1;
            const maxSteps = settings.martingaleMaxSteps || 5;
            const newStep = Math.min(newConsecutiveLosses, maxSteps);

            console.log('❌ Loss - Increasing Martingale:', {
                newConsecutiveLosses,
                newStep,
                nextStake: getBaseStake() * Math.pow(settings.martingaleMultiplier || 2, newStep),
            });

            setConsecutiveLosses(newConsecutiveLosses);
            setMartingaleStep(newStep);
        }
    };

    // Reset Martingale when settings change
    useEffect(() => {
        console.log('⚙️ Settings changed - Resetting Martingale');
        setMartingaleStep(0);
        setConsecutiveLosses(0);
    }, [settings.stake, settings.enableMartingale, settings.martingaleMultiplier, settings.martingaleMaxSteps]);

    // Subscribe to real tick data
    useEffect(() => {
        const subscribeTicks = async () => {
            try {
                console.log('📡 Subscribing to ticks for:', settings.market);
                const response = await api_base.api?.send({
                    ticks: settings.market,
                    subscribe: 1,
                });

                console.log('📡 Tick subscription response:', response);

                if (response?.subscription) {
                    tickSubscriptionRef.current = response.subscription.id;
                    console.log('✅ Tick subscription ID:', response.subscription.id);

                    // Set initial tick if available
                    if (response.tick) {
                        console.log('📊 Initial tick received:', response.tick.quote);
                        setCurrentTick(response.tick.quote);
                        setLastDigit(Math.floor((response.tick.quote * 100) % 10));
                    }

                    // Listen for tick updates
                    const subscription = api_base.api?.onMessage().subscribe((message: any) => {
                        if (message.tick && message.tick.symbol === settings.market) {
                            const tick = message.tick;
                            console.log('📊 Tick update:', tick.quote);
                            setCurrentTick(tick.quote);
                            // Calculate last digit from quote (multiply by 100 to get 2 decimal places, then mod 10)
                            setLastDigit(Math.floor((tick.quote * 100) % 10));

                            // Auto Trade Every Tick: Place contract on every price movement when auto trading is enabled
                            if (
                                autoTradingRef.current &&
                                settings.enableTickTrading &&
                                tick.quote !== lastTickRef.current
                            ) {
                                lastTickRef.current = tick.quote;
                                handleAutoTickTrade();
                            }
                        }
                    });

                    api_base.pushSubscription({
                        id: response.subscription.id,
                        unsubscribe: () => subscription?.unsubscribe(),
                    });
                } else {
                    console.error('❌ No subscription in response');
                }
            } catch (error) {
                console.error('❌ Failed to subscribe to ticks:', error);
            }
        };

        subscribeTicks();

        return () => {
            if (tickSubscriptionRef.current) {
                console.log('🔌 Unsubscribing from ticks:', tickSubscriptionRef.current);
                api_base.api?.send({ forget: tickSubscriptionRef.current });
                tickSubscriptionRef.current = null;
            }
        };
    }, [settings.market]);

    const trackContract = async (contractId: string, entryTick: number): Promise<Transaction> => {
        console.log('🔍 Tracking contract:', contractId);

        // Poll contract status every 500ms
        let attempts = 0;
        const maxAttempts = 10; // 5 seconds max

        while (attempts < maxAttempts) {
            try {
                console.log(`📡 Polling attempt ${attempts + 1}/${maxAttempts}`);

                const response = await api_base.api?.send({
                    proposal_open_contract: 1,
                    contract_id: contractId,
                });

                if (response?.proposal_open_contract) {
                    const contract = response.proposal_open_contract;
                    console.log('📋 Contract status:', {
                        is_sold: contract.is_sold,
                        status: contract.status,
                        buy_price: contract.buy_price,
                        sell_price: contract.sell_price,
                        profit: contract.profit,
                    });

                    // Check if finished
                    if (contract.is_sold || contract.status === 'sold') {
                        const profit = parseFloat(contract.profit || '0');
                        const outcome = profit > 0 ? 'win' : 'loss';

                        const transaction: Transaction = {
                            id: contractId,
                            contractId: contractId,
                            type: settings.tradeType,
                            market: settings.market,
                            entryTick: contract.entry_tick || entryTick,
                            exitTick: contract.exit_tick || contract.current_spot,
                            stake: parseFloat(contract.buy_price || settings.stake.toString()),
                            profit: profit,
                            outcome: outcome,
                            timestamp: Date.now(),
                        };

                        console.log('💰 Trade completed:', transaction);
                        setLastTradeResult(outcome);
                        onTradeExecuted?.(transaction);

                        // Update stats
                        setStats(prev => {
                            const newTotalTrades = prev.totalTrades + 1;
                            const newWins = outcome === 'win' ? prev.wins + 1 : prev.wins;
                            const newLosses = outcome === 'loss' ? prev.losses + 1 : prev.losses;
                            const newTotalProfit = prev.totalProfit + profit;
                            const newWinRate = (newWins / newTotalTrades) * 100;
                            const newConsecutiveLosses = outcome === 'loss' ? prev.consecutiveLosses + 1 : 0;

                            return {
                                totalTrades: newTotalTrades,
                                wins: newWins,
                                losses: newLosses,
                                totalProfit: newTotalProfit,
                                winRate: newWinRate,
                                currentStreak: outcome === 'win' ? prev.currentStreak + 1 : 0,
                                consecutiveLosses: newConsecutiveLosses,
                            };
                        });

                        // Update Martingale progression
                        updateMartingaleAfterTrade(outcome === 'win');

                        // Check Stop After Wins
                        if (settings.stopAfterWins && outcome === 'win') {
                            const currentWins = stats.wins + (outcome === 'win' ? 1 : 0);
                            if (currentWins >= (settings.stopAfterWinsCount || 5)) {
                                setIsAutoTrading(false);
                                autoTradingRef.current = false;
                                setTradeError(
                                    `🎯 Target Achieved: Stopped after ${settings.stopAfterWinsCount || 5} winning trades!`
                                );
                            }
                        }

                        setIsTrading(false);
                        return transaction;
                    }
                }

                // Wait 500ms before next poll
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            } catch (error) {
                console.error('❌ Polling error:', error);
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        // Timeout
        console.log('⏱️ Polling timeout');
        setIsTrading(false);
        throw new Error('Contract did not complete');
    };

    const executeSingleTrade = async (): Promise<Transaction> => {
        setIsTrading(true);
        setTradeError('');
        setLastTradeResult(null);

        // Calculate the stake to use for this trade (including Martingale)
        const tradeStake = settings.enableMartingale ? getCurrentMartingaleStake() : settings.stake;

        console.log('💰 Trade Stake Calculation:', {
            enableMartingale: settings.enableMartingale,
            baseStake: settings.stake,
            consecutiveLosses,
            martingaleStep,
            calculatedStake: tradeStake,
        });

        // Check balance before trading
        const balance = typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0;
        if (balance < tradeStake) {
            const errorMsg = `❌ Insufficient Balance: You have ${balance.toFixed(2)} ${currency}, but need ${tradeStake.toFixed(2)} ${currency}. Please add funds or lower your stake.`;
            setTradeError(errorMsg);
            setIsTrading(false);
            throw new Error(errorMsg);
        }

        try {
            // Build trade parameters
            const parameters: any = {
                contract_type: settings.tradeType,
                symbol: settings.market,
                duration: settings.duration,
                duration_unit: 't',
                basis: 'stake',
                amount: tradeStake,
                currency: currency,
            };

            // Add barrier for Over/Under
            if (['DIGITOVER', 'DIGITUNDER'].includes(settings.tradeType)) {
                parameters.barrier = settings.barrier || '5';
            }

            // Add prediction for Matches/Differs
            if (['DIGITMATCH', 'DIGITDIFF'].includes(settings.tradeType)) {
                parameters.barrier = settings.prediction?.toString() || '5';
            }

            console.log('Executing trade with parameters:', parameters);

            // Execute trade
            const response = await api_base.api?.send({
                buy: 1,
                price: tradeStake,
                parameters,
            });

            if (response?.buy) {
                const contractId = response.buy.contract_id;
                const entryTick = response.buy.start_time || currentTick;
                console.log('✅ Trade executed:', contractId);

                // Reset button immediately after successful trade placement
                setIsTrading(false);

                // Track contract result in background (non-blocking)
                trackContract(contractId, entryTick).catch(trackError => {
                    console.error('❌ Contract tracking failed:', trackError);
                });

                // Return a placeholder transaction for immediate feedback
                const placeholderTransaction: Transaction = {
                    id: contractId,
                    contractId: contractId,
                    type: settings.tradeType,
                    market: settings.market,
                    entryTick: entryTick,
                    exitTick: 0,
                    stake: tradeStake,
                    profit: 0,
                    outcome: 'pending' as any,
                    timestamp: Date.now(),
                };

                return placeholderTransaction;
            } else if (response?.error) {
                setTradeError(response.error.message || 'Trade failed');
                setIsTrading(false);
                throw new Error(response.error.message);
            }

            setIsTrading(false);
            throw new Error('No response from API');
        } catch (error: any) {
            setTradeError(error.message || 'Trade failed');
            console.error('Trade error:', error);
            setIsTrading(false);
            throw error;
        }
    };

    // Manual Trade: Place one contract per click
    const handleManualTrade = async () => {
        try {
            console.log('🎯 Manual trade - placing one contract');
            executeSingleTrade().catch(error => {
                console.error('Manual trade failed:', error);
            });
        } catch (error) {
            console.error('Manual trade failed:', error);
        }
    };

    // Start Auto Trading
    const handleStartAuto = async () => {
        if (settings.enableTickTrading) {
            // Start Auto Trade Every Tick - trades on every price movement
            setIsAutoTrading(true);
            autoTradingRef.current = true;
            setTickTradeCount(0);
            setTradeError('');
            console.log('🚀 Auto Trade Every Tick started - will place contract on every price movement');
        } else {
            // Normal auto-trading (time-based with delays)
            setIsAutoTrading(true);
            autoTradingRef.current = true;
            console.log('🚀 Normal auto-trading started');

            try {
                let tradesExecuted = 0;

                while (autoTradingRef.current && tradesExecuted < settings.targetTrades) {
                    console.log(`🔄 Loop iteration ${tradesExecuted + 1}/${settings.targetTrades}`);

                    // Check if we should stop
                    if (!autoTradingRef.current) {
                        console.log('⏹️ Stopped by user');
                        break;
                    }

                    // Check risk limits
                    if (stats.consecutiveLosses >= settings.maxConsecutiveLosses) {
                        setTradeError(`Stopped: Max consecutive losses (${settings.maxConsecutiveLosses}) reached`);
                        break;
                    }

                    if (Math.abs(stats.totalProfit) >= settings.stopLoss && stats.totalProfit < 0) {
                        setTradeError(`Stopped: Stop loss (${settings.stopLoss}) reached`);
                        break;
                    }

                    if (stats.totalProfit >= settings.takeProfit) {
                        setTradeError(`Stopped: Take profit (${settings.takeProfit}) reached`);
                        break;
                    }

                    try {
                        // Execute trade and wait for result
                        console.log(`📊 Executing trade ${tradesExecuted + 1}...`);
                        await executeSingleTrade();
                        tradesExecuted++;
                        console.log(`✅ Trade ${tradesExecuted} completed. Continuing loop...`);

                        // Delay before next trade
                        if (settings.delayBetweenTrades > 0 && autoTradingRef.current) {
                            console.log(`⏳ Waiting ${settings.delayBetweenTrades}ms before next trade...`);
                            await new Promise(resolve => setTimeout(resolve, settings.delayBetweenTrades));
                            console.log(`✓ Delay complete`);
                        }
                    } catch (error: any) {
                        console.error('❌ Auto-trade failed:', error);
                        setTradeError(error.message || 'Trade failed');

                        // If balance error, stop the loop
                        if (error.message?.includes('Insufficient Balance')) {
                            console.log('🛑 Stopping auto-trading: Insufficient balance');
                            break;
                        }

                        // Continue to next trade even if one fails
                        console.log('⏳ Waiting 1s before retry...');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                console.log(`Auto-trading stopped. Executed ${tradesExecuted} trades.`);
            } finally {
                setIsAutoTrading(false);
                autoTradingRef.current = false;
            }
        }
    };

    const handleStopAuto = () => {
        autoTradingRef.current = false;
        setIsAutoTrading(false);
        console.log('Auto-trading stopped by user');
    };

    const handleEmergencyStop = () => {
        setIsAutoTrading(false);
        autoTradingRef.current = false;
        console.log('EMERGENCY STOP');
    };

    // Auto Trade Every Tick: Called on every price movement when auto trading is enabled
    const handleAutoTickTrade = async () => {
        // Check if we should stop auto tick trading
        if (!autoTradingRef.current || !settings.enableTickTrading) return;

        // Check tick trade count limit
        if (tickTradeCount >= (settings.tickTradingMaxTrades || 100)) {
            setTradeError(
                `Auto Trade Every Tick Stopped: Max tick trades (${settings.tickTradingMaxTrades || 100}) reached`
            );
            setIsAutoTrading(false);
            autoTradingRef.current = false;
            return;
        }

        // Check risk limits
        if (stats.consecutiveLosses >= settings.maxConsecutiveLosses) {
            setTradeError(
                `Auto Trade Every Tick Stopped: Max consecutive losses (${settings.maxConsecutiveLosses}) reached`
            );
            setIsAutoTrading(false);
            autoTradingRef.current = false;
            return;
        }

        if (Math.abs(stats.totalProfit) >= settings.stopLoss && stats.totalProfit < 0) {
            setTradeError(`Auto Trade Every Tick Stopped: Stop loss (${settings.stopLoss}) reached`);
            setIsAutoTrading(false);
            autoTradingRef.current = false;
            return;
        }

        if (stats.totalProfit >= settings.takeProfit) {
            setTradeError(`Auto Trade Every Tick Stopped: Take profit (${settings.takeProfit}) reached`);
            setIsAutoTrading(false);
            autoTradingRef.current = false;
            return;
        }

        // Check Stop After Wins
        if (settings.stopAfterWins && stats.wins >= (settings.stopAfterWinsCount || 5)) {
            setTradeError(
                `🎯 Auto Trade Every Tick Stopped: Target achieved after ${settings.stopAfterWinsCount || 5} wins!`
            );
            setIsAutoTrading(false);
            autoTradingRef.current = false;
            return;
        }

        // Check balance
        const balance = typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0;
        const tradeStake = settings.enableMartingale ? getCurrentMartingaleStake() : settings.stake;
        console.log('💰 Auto Tick Trade Balance Check:', {
            balance,
            tradeStake,
            enableMartingale: settings.enableMartingale,
            consecutiveLosses,
        });

        if (balance < tradeStake) {
            setTradeError(
                `Auto Trade Every Tick Stopped: Insufficient balance (need ${tradeStake.toFixed(2)} ${currency})`
            );
            setIsAutoTrading(false);
            autoTradingRef.current = false;
            return;
        }

        // Increment tick trade counter
        setTickTradeCount(prev => prev + 1);

        try {
            // Execute trade without waiting for completion (fire and forget)
            executeSingleTrade().catch(error => {
                console.error('Auto tick trade failed:', error);
                // Don't stop auto trading for individual trade failures
            });
        } catch (error) {
            console.error('Auto tick trade error:', error);
        }
    };

    return (
        <div className='trading-engine'>
            <div className='trading-engine__header'>
                <h2 className='trading-engine__title'>Trading Engine</h2>
                <div className='trading-engine__status-container'>
                    {isAutoTrading && !settings.enableTickTrading && (
                        <span className='trading-engine__status trading-engine__status--active'>AUTO TRADING</span>
                    )}
                    {isAutoTrading && settings.enableTickTrading && (
                        <span className='trading-engine__status trading-engine__status--tick'>
                            AUTO TRADE EVERY TICK
                        </span>
                    )}
                </div>
            </div>

            {/* Balance Display */}
            <div
                className={`trading-engine__balance ${
                    (typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0) <
                    settings.stake * 2
                        ? 'trading-engine__balance--warning'
                        : ''
                }`}
            >
                <div className='trading-engine__balance-label'>Account Balance</div>
                <div className='trading-engine__balance-value'>
                    $
                    {(typeof client.balance === 'number'
                        ? client.balance
                        : parseFloat(client.balance as string) || 0
                    ).toFixed(2)}{' '}
                    {currency}
                </div>
                {(typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0) <
                    settings.stake && (
                    <div className='trading-engine__balance-alert'>⚠️ Insufficient funds for trading</div>
                )}
                {(typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0) >=
                    settings.stake &&
                    (typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0) <
                        settings.stake * 2 && (
                        <div className='trading-engine__balance-alert'>⚠️ Low balance - add funds soon</div>
                    )}
            </div>

            {/* Martingale Display */}
            {settings.enableMartingale && (
                <div className='trading-engine__martingale'>
                    <div className='trading-engine__martingale-header'>
                        <h3 className='trading-engine__martingale-title'>Martingale Status</h3>
                        <span
                            className={`trading-engine__martingale-step ${consecutiveLosses > 0 ? 'trading-engine__martingale-step--active' : ''}`}
                        >
                            Step {consecutiveLosses}/{settings.martingaleMaxSteps || 5}
                        </span>
                    </div>
                    <div className='trading-engine__martingale-info'>
                        <div className='trading-engine__martingale-stakes'>
                            <div className='trading-engine__stake-info'>
                                <span className='trading-engine__stake-label'>Base Stake:</span>
                                <span className='trading-engine__stake-value'>${getBaseStake().toFixed(2)}</span>
                            </div>
                            <div className='trading-engine__stake-info'>
                                <span className='trading-engine__stake-label'>Current Stake:</span>
                                <span
                                    className={`trading-engine__stake-value ${getCurrentMartingaleStake() > getBaseStake() ? 'trading-engine__stake-value--increased' : ''}`}
                                >
                                    ${getCurrentMartingaleStake().toFixed(2)}
                                </span>
                            </div>
                            <div className='trading-engine__stake-info'>
                                <span className='trading-engine__stake-label'>Consecutive Losses:</span>
                                <span className='trading-engine__stake-value'>{consecutiveLosses}</span>
                            </div>
                        </div>
                        {consecutiveLosses > 0 && (
                            <div className='trading-engine__martingale-multiplier'>
                                Multiplier: {settings.martingaleMultiplier || 2}x (Loss #{consecutiveLosses})
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Trade Every Tick Display */}
            {isAutoTrading && settings.enableTickTrading && (
                <div className='trading-engine__tick-trading'>
                    <div className='trading-engine__tick-trading-header'>
                        <h3 className='trading-engine__tick-trading-title'>⚡ Auto Trade Every Tick Status</h3>
                        <span className='trading-engine__tick-trading-counter'>
                            {tickTradeCount}/{settings.tickTradingMaxTrades || 100}
                        </span>
                    </div>
                    <div className='trading-engine__tick-trading-info'>
                        <div className='trading-engine__tick-trading-stats'>
                            <div className='trading-engine__tick-stat'>
                                <span className='trading-engine__tick-stat-label'>Tick Trades:</span>
                                <span className='trading-engine__tick-stat-value'>{tickTradeCount}</span>
                            </div>
                            <div className='trading-engine__tick-stat'>
                                <span className='trading-engine__tick-stat-label'>Remaining:</span>
                                <span className='trading-engine__tick-stat-value'>
                                    {(settings.tickTradingMaxTrades || 100) - tickTradeCount}
                                </span>
                            </div>
                        </div>
                        <div className='trading-engine__tick-trading-warning'>
                            ⚠️ Auto trading on every price movement - Monitor closely!
                        </div>
                    </div>
                </div>
            )}

            {/* Tick Display */}
            <div className='trading-engine__tick-display'>
                <div className='trading-engine__tick-label'>Current Tick</div>
                <div className='trading-engine__tick-value'>{currentTick.toFixed(2)}</div>
                <div className='trading-engine__last-digit'>
                    <span>Last Digit:</span>
                    <span className='trading-engine__digit'>{lastDigit}</span>
                </div>
            </div>

            {/* Error Display */}
            {tradeError && (
                <div className='trading-engine__error'>
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                        <circle cx='8' cy='8' r='7' stroke='currentColor' strokeWidth='2' />
                        <path d='M8 4v5M8 11v1' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
                    </svg>
                    {tradeError}
                </div>
            )}

            {/* Trade Result Indicator */}
            {lastTradeResult && (
                <div className={`trading-engine__result trading-engine__result--${lastTradeResult}`}>
                    {lastTradeResult === 'win' ? '✓ WIN' : '✗ LOSS'}
                </div>
            )}

            {/* Controls */}
            <div className='trading-engine__controls'>
                <button
                    className='trading-engine__button trading-engine__button--primary'
                    onClick={handleManualTrade}
                    disabled={isTrading}
                    title={
                        settings.enableTickTrading ? 'Place one contract (Trade Every Tick Mode)' : 'Place one contract'
                    }
                >
                    {isTrading ? (
                        <>
                            <span className='trading-engine__spinner' />
                            Placing Trade...
                        </>
                    ) : (
                        'Trade Now'
                    )}
                </button>

                {!isAutoTrading ? (
                    <button
                        className='trading-engine__button trading-engine__button--success'
                        onClick={handleStartAuto}
                        title={
                            settings.enableTickTrading
                                ? 'Start auto trading on every price movement'
                                : 'Start normal auto trading with delays'
                        }
                    >
                        Start Auto
                    </button>
                ) : (
                    <button className='trading-engine__button trading-engine__button--warning' onClick={handleStopAuto}>
                        Stop Auto
                    </button>
                )}

                <button className='trading-engine__button trading-engine__button--danger' onClick={handleEmergencyStop}>
                    🛑 Emergency Stop
                </button>
            </div>

            {/* Statistics */}
            <div className='trading-engine__stats'>
                <h3 className='trading-engine__stats-title'>Statistics</h3>
                <div className='trading-engine__stats-grid'>
                    <div className='trading-engine__stat'>
                        <div className='trading-engine__stat-label'>Total Trades</div>
                        <div className='trading-engine__stat-value'>{stats.totalTrades}</div>
                    </div>
                    <div className='trading-engine__stat'>
                        <div className='trading-engine__stat-label'>Wins</div>
                        <div className='trading-engine__stat-value trading-engine__stat-value--success'>
                            {stats.wins}
                        </div>
                    </div>
                    <div className='trading-engine__stat'>
                        <div className='trading-engine__stat-label'>Losses</div>
                        <div className='trading-engine__stat-value trading-engine__stat-value--danger'>
                            {stats.losses}
                        </div>
                    </div>
                    <div className='trading-engine__stat'>
                        <div className='trading-engine__stat-label'>Win Rate</div>
                        <div className='trading-engine__stat-value'>{stats.winRate.toFixed(1)}%</div>
                    </div>
                    <div className='trading-engine__stat'>
                        <div className='trading-engine__stat-label'>Total P&L</div>
                        <div
                            className={`trading-engine__stat-value ${
                                stats.totalProfit >= 0
                                    ? 'trading-engine__stat-value--success'
                                    : 'trading-engine__stat-value--danger'
                            }`}
                        >
                            ${stats.totalProfit.toFixed(2)}
                        </div>
                    </div>
                    <div className='trading-engine__stat'>
                        <div className='trading-engine__stat-label'>Consecutive Losses</div>
                        <div className='trading-engine__stat-value'>{stats.consecutiveLosses}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingEngine;
