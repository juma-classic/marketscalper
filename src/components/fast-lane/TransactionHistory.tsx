import React, { useEffect, useRef, useState } from 'react';
import './TransactionHistory.scss';

export interface Transaction {
    id: string;
    contractId: string;
    type: string;
    market: string;
    entryTick: number;
    exitTick: number;
    stake: number;
    profit: number;
    outcome: 'win' | 'loss' | 'pending';
    timestamp: number;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
    onExport?: () => void;
    onReset?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onExport, onReset }) => {
    const [filter, setFilter] = useState<'all' | 'wins' | 'losses' | 'pending'>('all');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const prevTransactionCountRef = useRef(transactions.length);

    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'all') return true;
        if (filter === 'wins') return tx.outcome === 'win';
        if (filter === 'losses') return tx.outcome === 'loss';
        if (filter === 'pending') return tx.outcome === 'pending';
        return true;
    });

    // Auto-scroll to top when new transactions are added (since newest appear at top)
    useEffect(() => {
        if (transactions.length > prevTransactionCountRef.current && listRef.current) {
            // Smooth scroll to top to show the latest transaction
            listRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
        prevTransactionCountRef.current = transactions.length;
    }, [transactions.length]);

    const summary = {
        total: transactions.length,
        wins: transactions.filter(tx => tx.outcome === 'win').length,
        losses: transactions.filter(tx => tx.outcome === 'loss').length,
        totalProfit: transactions.reduce((sum, tx) => sum + tx.profit, 0),
        totalStake: transactions.reduce((sum, tx) => sum + tx.stake, 0),
    };

    const handleExport = () => {
        console.log('📤 TransactionHistory: Export function called');

        if (transactions.length === 0) {
            console.log('⚠️ No transactions to export');
            return;
        }

        try {
            console.log('📊 Preparing to export', transactions.length, 'transactions');

            // Create CSV content
            const headers = ['ID', 'Type', 'Market', 'Entry', 'Exit', 'Stake', 'Profit', 'Outcome', 'Time'];
            const rows = transactions.map(tx => [
                tx.id,
                tx.type,
                tx.market,
                tx.entryTick.toFixed(2),
                tx.exitTick.toFixed(2),
                tx.stake.toFixed(2),
                tx.profit.toFixed(2),
                tx.outcome,
                new Date(tx.timestamp).toLocaleString(),
            ]);

            const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
            console.log('📄 CSV content prepared, length:', csv.length, 'characters');

            // Download CSV
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const filename = `fast-lane-transactions-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;

            a.href = url;
            a.download = filename;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);

            console.log('✅ Export completed successfully:', filename);

            // Call parent callback
            onExport?.();
        } catch (error) {
            console.error('❌ Export failed:', error);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className='transaction-history'>
            <div className='transaction-history__header'>
                <div className='transaction-history__header-content'>
                    <h2 className='transaction-history__title'>Transaction History</h2>
                </div>
                <div className='transaction-history__actions'>
                    <button
                        className={`transaction-history__toggle ${isCollapsed ? 'transaction-history__toggle--collapsed' : ''}`}
                        type='button'
                        onClick={() => setIsCollapsed(!isCollapsed)}
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
                    <button
                        className='transaction-history__action-btn transaction-history__action-btn--reset'
                        onClick={() => {
                            console.log('🔄 Reset button clicked in TransactionHistory');
                            onReset?.();
                        }}
                        disabled={transactions.length === 0}
                        title='Reset History'
                    >
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                            <path
                                d='M2 8a6 6 0 0110.472-4.472M14 8A6 6 0 013.528 12.472M14 3v3h-3M2 13v-3h3'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </button>
                    <button
                        className='transaction-history__action-btn transaction-history__action-btn--export'
                        onClick={() => {
                            console.log('📤 Export button clicked in TransactionHistory');
                            handleExport();
                        }}
                        disabled={transactions.length === 0}
                        title='Export to CSV'
                    >
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                            <path
                                d='M8 1v10M8 11l-3-3M8 11l3-3M2 11v3a1 1 0 001 1h10a1 1 0 001-1v-3'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`transaction-history__content ${isCollapsed ? 'transaction-history__content--collapsed' : ''}`}
            >
                {/* Summary Card */}
                <div className='transaction-history__summary'>
                    <div className='transaction-history__summary-item'>
                        <div className='transaction-history__summary-label'>Total</div>
                        <div className='transaction-history__summary-value'>{summary.total}</div>
                    </div>
                    <div className='transaction-history__summary-item'>
                        <div className='transaction-history__summary-label'>Wins</div>
                        <div className='transaction-history__summary-value transaction-history__summary-value--success'>
                            {summary.wins}
                        </div>
                    </div>
                    <div className='transaction-history__summary-item'>
                        <div className='transaction-history__summary-label'>Losses</div>
                        <div className='transaction-history__summary-value transaction-history__summary-value--danger'>
                            {summary.losses}
                        </div>
                    </div>
                    <div className='transaction-history__summary-item transaction-history__summary-item--full'>
                        <div className='transaction-history__summary-label'>Net P&L</div>
                        <div
                            className={`transaction-history__summary-value transaction-history__summary-value--large ${
                                summary.totalProfit >= 0
                                    ? 'transaction-history__summary-value--success'
                                    : 'transaction-history__summary-value--danger'
                            }`}
                        >
                            ${summary.totalProfit.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className='transaction-history__filter'>
                    <button
                        className={`transaction-history__filter-btn ${filter === 'all' ? 'transaction-history__filter-btn--active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({summary.total})
                    </button>
                    <button
                        className={`transaction-history__filter-btn ${filter === 'wins' ? 'transaction-history__filter-btn--active' : ''}`}
                        onClick={() => setFilter('wins')}
                    >
                        Wins ({summary.wins})
                    </button>
                    <button
                        className={`transaction-history__filter-btn ${filter === 'losses' ? 'transaction-history__filter-btn--active' : ''}`}
                        onClick={() => setFilter('losses')}
                    >
                        Losses ({summary.losses})
                    </button>
                    <button
                        className={`transaction-history__filter-btn ${filter === 'pending' ? 'transaction-history__filter-btn--active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({transactions.filter(tx => tx.outcome === 'pending').length})
                    </button>
                </div>

                {/* Transaction List */}
                <div className='transaction-history__list' ref={listRef}>
                    {filteredTransactions.length === 0 ? (
                        <div className='transaction-history__empty'>
                            <svg width='48' height='48' viewBox='0 0 48 48' fill='none'>
                                <circle cx='24' cy='24' r='20' stroke='currentColor' strokeWidth='2' opacity='0.3' />
                                <path
                                    d='M24 16v12M24 32v2'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                />
                            </svg>
                            <p>No transactions yet</p>
                            <small>Your trade history will appear here</small>
                        </div>
                    ) : (
                        filteredTransactions.map(tx => (
                            <div
                                key={tx.id}
                                className={`transaction-history__item transaction-history__item--${tx.outcome}`}
                            >
                                <div className='transaction-history__item-header'>
                                    <span className='transaction-history__item-type'>{tx.type}</span>
                                    <span className='transaction-history__item-time'>{formatTime(tx.timestamp)}</span>
                                </div>
                                <div className='transaction-history__item-details'>
                                    <div className='transaction-history__item-ticks'>
                                        <span>{tx.entryTick.toFixed(2)}</span>
                                        <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                                            <path
                                                d='M2 6h8M8 6l-2-2M8 6l-2 2'
                                                stroke='currentColor'
                                                strokeWidth='1.5'
                                                strokeLinecap='round'
                                            />
                                        </svg>
                                        <span>{tx.outcome === 'pending' ? '...' : tx.exitTick.toFixed(2)}</span>
                                    </div>
                                    <div className='transaction-history__item-stake'>Stake: ${tx.stake.toFixed(2)}</div>
                                </div>
                                <div className='transaction-history__item-footer'>
                                    <span
                                        className={`transaction-history__item-outcome transaction-history__item-outcome--${tx.outcome}`}
                                    >
                                        {tx.outcome === 'win'
                                            ? '✓ WIN'
                                            : tx.outcome === 'loss'
                                              ? '✗ LOSS'
                                              : '⏳ PENDING'}
                                    </span>
                                    <span
                                        className={`transaction-history__item-profit ${
                                            tx.profit >= 0
                                                ? 'transaction-history__item-profit--positive'
                                                : 'transaction-history__item-profit--negative'
                                        }`}
                                    >
                                        {tx.profit >= 0 ? '+' : ''}${tx.profit.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
