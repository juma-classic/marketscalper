import React, { useEffect, useRef, useState } from 'react';
import TradingConfig, { TradingSettings } from '@/components/fast-lane/TradingConfig';
import TradingEngine from '@/components/fast-lane/TradingEngine';
import TransactionHistory, { Transaction } from '@/components/fast-lane/TransactionHistory';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import './fast-lane.scss';

const FastLane: React.FC = () => {
    const { isAuthorized, connectionStatus } = useApiBase();
    const { client } = useStore();
    const accountBalance =
        typeof client.balance === 'number' ? client.balance : parseFloat(client.balance as string) || 0;

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Collapsible sections state for mobile
    const [collapsedSections, setCollapsedSections] = useState({
        config: false,
        engine: false,
        history: false,
    });
    const [settings, setSettings] = useState<TradingSettings>({
        market: 'R_50',
        tradeType: 'DIGITEVEN',
        stake: 1.0,
        duration: 1,
        stopLoss: 100,
        takeProfit: 200,
        maxConsecutiveLosses: 3,
        dailyLossLimit: 500,
        targetTrades: 10,
        delayBetweenTrades: 1000,
        strategy: 'momentum',
        // Martingale defaults
        enableMartingale: false,
        martingaleMultiplier: 2,
        martingaleMaxSteps: 5,
        martingaleResetOnWin: true,
        // Stop After Wins defaults
        stopAfterWins: false,
        stopAfterWinsCount: 5,
        // Trade Every Tick defaults
        enableTickTrading: false,
        tickTradingMaxTrades: 100,
    });

    const handleSettingsChange = (newSettings: TradingSettings) => {
        setSettings(newSettings);
    };

    const handleTradeExecuted = (transaction: Transaction) => {
        console.log('📥 Fast Lane received trade:', transaction);
        setTransactions(prev => {
            const updated = [transaction, ...prev];
            console.log('📊 Updated transactions array:', updated.length, 'trades');
            return updated;
        });
    };

    const handleExport = () => {
        console.log('📤 Export button clicked - transactions count:', transactions.length);
        // The actual export functionality is handled in TransactionHistory component
        // This is just a callback for additional actions if needed
        if (transactions.length > 0) {
            console.log('✅ Export initiated for', transactions.length, 'transactions');
        } else {
            console.log('⚠️ No transactions to export');
        }
    };

    const handleReset = () => {
        console.log('🔄 Reset button clicked - current transactions:', transactions.length);

        if (transactions.length === 0) {
            console.log('⚠️ No transactions to reset');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to clear all ${transactions.length} transactions from history? This cannot be undone.`
        );

        if (confirmed) {
            setTransactions([]);
            console.log('✅ Transaction history cleared successfully');

            // Optional: Show a brief success message
            setTimeout(() => {
                console.log('📊 Transaction history is now empty');
            }, 100);
        } else {
            console.log('❌ Reset cancelled by user');
        }
    };

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                setShowScrollTop(scrollTop > 300);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const toggleSection = (section: keyof typeof collapsedSections) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    return (
        <div className='fast-lane-container'>
            <div className='fast-lane' ref={containerRef}>
                <div className='fast-lane__header'>
                    <h1 className='fast-lane__title'>
                        Fast Lane Trading
                        <span className='fast-lane__beta-badge'>BETA</span>
                    </h1>
                    <p className='fast-lane__description'>
                        High-frequency 1-second trading with advanced rate limiting and risk management
                    </p>
                </div>

                {!isAuthorized ? (
                    <div className='fast-lane__not-authorized'>
                        <div className='fast-lane__not-authorized-content'>
                            <svg width='64' height='64' viewBox='0 0 64 64' fill='none'>
                                <circle cx='32' cy='32' r='28' stroke='#ffd700' strokeWidth='3' opacity='0.3' />
                                <path d='M32 20v16M32 44v2' stroke='#ffd700' strokeWidth='3' strokeLinecap='round' />
                            </svg>
                            <h2>Please Log In</h2>
                            <p>You need to be logged in to your Deriv account to use Fast Lane Trading</p>
                            <small>Connection Status: {connectionStatus}</small>
                        </div>
                    </div>
                ) : (
                    <div className='fast-lane__content'>
                        {/* Desktop Layout */}
                        <div className='fast-lane__desktop-layout'>
                            <div className='fast-lane__sidebar'>
                                <TradingConfig
                                    settings={settings}
                                    onSettingsChange={handleSettingsChange}
                                    accountBalance={accountBalance}
                                />
                            </div>
                            <div className='fast-lane__main'>
                                <TradingEngine settings={settings} onTradeExecuted={handleTradeExecuted} />
                            </div>
                            <div className='fast-lane__sidebar'>
                                <TransactionHistory
                                    transactions={transactions}
                                    onExport={handleExport}
                                    onReset={handleReset}
                                />
                            </div>
                        </div>

                        {/* Mobile Layout - Collapsible Sections */}
                        <div className='fast-lane__mobile-layout'>
                            {/* Trading Configuration Section */}
                            <div className='fast-lane__mobile-section'>
                                <div
                                    className='fast-lane__mobile-section-header'
                                    onClick={() => toggleSection('config')}
                                >
                                    <h3 className='fast-lane__mobile-section-title'>⚙️ Trading Configuration</h3>
                                    <button
                                        className={`fast-lane__mobile-section-toggle ${collapsedSections.config ? 'fast-lane__mobile-section-toggle--collapsed' : ''}`}
                                        type='button'
                                    >
                                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                                            <path
                                                d='M5 7.5L10 12.5L15 7.5'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className={`fast-lane__mobile-section-content ${collapsedSections.config ? 'fast-lane__mobile-section-content--collapsed' : ''}`}
                                >
                                    <TradingConfig
                                        settings={settings}
                                        onSettingsChange={handleSettingsChange}
                                        accountBalance={accountBalance}
                                    />
                                </div>
                            </div>

                            {/* Trading Engine Section */}
                            <div className='fast-lane__mobile-section'>
                                <div
                                    className='fast-lane__mobile-section-header'
                                    onClick={() => toggleSection('engine')}
                                >
                                    <h3 className='fast-lane__mobile-section-title'>🚀 Trading Engine</h3>
                                    <button
                                        className={`fast-lane__mobile-section-toggle ${collapsedSections.engine ? 'fast-lane__mobile-section-toggle--collapsed' : ''}`}
                                        type='button'
                                    >
                                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                                            <path
                                                d='M5 7.5L10 12.5L15 7.5'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className={`fast-lane__mobile-section-content ${collapsedSections.engine ? 'fast-lane__mobile-section-content--collapsed' : ''}`}
                                >
                                    <TradingEngine settings={settings} onTradeExecuted={handleTradeExecuted} />
                                </div>
                            </div>

                            {/* Transaction History Section */}
                            <div className='fast-lane__mobile-section'>
                                <div
                                    className='fast-lane__mobile-section-header'
                                    onClick={() => toggleSection('history')}
                                >
                                    <h3 className='fast-lane__mobile-section-title'>📊 Transaction History</h3>
                                    <button
                                        className={`fast-lane__mobile-section-toggle ${collapsedSections.history ? 'fast-lane__mobile-section-toggle--collapsed' : ''}`}
                                        type='button'
                                    >
                                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                                            <path
                                                d='M5 7.5L10 12.5L15 7.5'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className={`fast-lane__mobile-section-content ${collapsedSections.history ? 'fast-lane__mobile-section-content--collapsed' : ''}`}
                                >
                                    <TransactionHistory
                                        transactions={transactions}
                                        onExport={handleExport}
                                        onReset={handleReset}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button className='fast-lane__scroll-top' onClick={scrollToTop} title='Scroll to top'>
                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
                            <path
                                d='M10 15V5M10 5l-4 4M10 5l4 4'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default FastLane;
