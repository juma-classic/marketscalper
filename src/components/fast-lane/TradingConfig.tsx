import React, { useState } from 'react';
import './TradingConfig.scss';

export interface TradingSettings {
    market: string;
    tradeType: string;
    stake: number;
    duration: number;
    barrier?: string;
    prediction?: number;
    stopLoss: number;
    takeProfit: number;
    maxConsecutiveLosses: number;
    dailyLossLimit: number;
    targetTrades: number;
    delayBetweenTrades: number;
    strategy: 'momentum' | 'mean-reversion' | 'pattern' | 'random' | 'martingale';
    // Martingale-specific settings
    enableMartingale?: boolean;
    martingaleMultiplier?: number;
    martingaleMaxSteps?: number;
    martingaleResetOnWin?: boolean;
    // Stop after wins feature
    stopAfterWins?: boolean;
    stopAfterWinsCount?: number;
    // Trade Every Tick settings
    enableTickTrading?: boolean;
    tickTradingMaxTrades?: number;
}

interface TradingConfigProps {
    settings: TradingSettings;
    onSettingsChange: (settings: TradingSettings) => void;
    accountBalance: number;
}

export const TradingConfig: React.FC<TradingConfigProps> = ({ settings, onSettingsChange, accountBalance }) => {
    const [localSettings, setLocalSettings] = useState<TradingSettings>(settings);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleChange = (field: keyof TradingSettings, value: any) => {
        const updated = { ...localSettings, [field]: value };
        setLocalSettings(updated);
        onSettingsChange(updated);
    };

    const needsBarrier = ['DIGITOVER', 'DIGITUNDER'].includes(localSettings.tradeType);
    const needsPrediction = ['DIGITMATCH', 'DIGITDIFF'].includes(localSettings.tradeType);

    return (
        <div className='trading-config'>
            <div className='trading-config__header trading-config__header--mobile-simple'>
                <div className='trading-config__header-content'>
                    <h2 className='trading-config__title'>Trading Configuration</h2>
                    <div className='trading-config__balance'>
                        Balance: <span>${accountBalance.toFixed(2)}</span>
                    </div>
                </div>
                <button
                    className={`trading-config__toggle ${isCollapsed ? 'trading-config__toggle--collapsed' : ''}`}
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
            </div>

            {/* Toggle Buttons Container */}
            <div className='trading-config__toggles-container'>
                {/* Trade Every Tick Toggle Button */}
                <div className='trading-config__tick-toggle'>
                    <button
                        className={`trading-config__tick-button ${localSettings.enableTickTrading ? 'trading-config__tick-button--active' : ''}`}
                        onClick={() => handleChange('enableTickTrading', !localSettings.enableTickTrading)}
                        type='button'
                    >
                        <div className='trading-config__tick-button-content'>
                            <div className='trading-config__tick-button-icon'>⚡</div>
                            <div className='trading-config__tick-button-text'>
                                <span className='trading-config__tick-button-title'>Trade Every Tick</span>
                                <span className='trading-config__tick-button-subtitle'>
                                    {localSettings.enableTickTrading
                                        ? 'Ultra High-Frequency Mode Active'
                                        : 'Click to Enable Ultra High-Frequency'}
                                </span>
                            </div>
                            <div className='trading-config__tick-button-status'>
                                {localSettings.enableTickTrading ? 'ON' : 'OFF'}
                            </div>
                        </div>
                    </button>
                    {localSettings.enableTickTrading && (
                        <div className='trading-config__tick-settings'>
                            <div className='trading-config__tick-setting'>
                                <label>Max Tick Trades:</label>
                                <input
                                    type='number'
                                    className='trading-config__tick-input'
                                    value={localSettings.tickTradingMaxTrades || 100}
                                    onChange={e => handleChange('tickTradingMaxTrades', parseInt(e.target.value))}
                                    min='10'
                                    max='1000'
                                />
                            </div>
                            <div className='trading-config__tick-warning'>
                                ⚠️ Places contracts on EVERY price movement - Use with extreme caution!
                            </div>
                        </div>
                    )}
                </div>

                {/* Martingale Toggle Button */}
                <div className='trading-config__martingale-toggle'>
                    <button
                        className={`trading-config__martingale-button ${localSettings.enableMartingale ? 'trading-config__martingale-button--active' : ''}`}
                        onClick={() => handleChange('enableMartingale', !localSettings.enableMartingale)}
                        type='button'
                    >
                        <div className='trading-config__martingale-button-content'>
                            <div className='trading-config__martingale-button-icon'>📈</div>
                            <div className='trading-config__martingale-button-text'>
                                <span className='trading-config__martingale-button-title'>Martingale Strategy</span>
                                <span className='trading-config__martingale-button-subtitle'>
                                    {localSettings.enableMartingale
                                        ? 'Progressive Stake Increase Active'
                                        : 'Click to Enable Progressive Stakes'}
                                </span>
                            </div>
                            <div className='trading-config__martingale-button-status'>
                                {localSettings.enableMartingale ? 'ON' : 'OFF'}
                            </div>
                        </div>
                    </button>
                    {localSettings.enableMartingale && (
                        <div className='trading-config__martingale-settings'>
                            <div className='trading-config__martingale-grid'>
                                <div className='trading-config__martingale-setting'>
                                    <label>Multiplier:</label>
                                    <input
                                        type='number'
                                        className='trading-config__martingale-input'
                                        value={localSettings.martingaleMultiplier || 2}
                                        onChange={e => handleChange('martingaleMultiplier', parseFloat(e.target.value))}
                                        min='1.1'
                                        max='10'
                                        step='0.1'
                                    />
                                </div>
                                <div className='trading-config__martingale-setting'>
                                    <label>Max Steps:</label>
                                    <input
                                        type='number'
                                        className='trading-config__martingale-input'
                                        value={localSettings.martingaleMaxSteps || 5}
                                        onChange={e => handleChange('martingaleMaxSteps', parseInt(e.target.value))}
                                        min='1'
                                        max='10'
                                    />
                                </div>
                            </div>
                            <div className='trading-config__martingale-checkbox'>
                                <label className='trading-config__martingale-checkbox-label'>
                                    <input
                                        type='checkbox'
                                        className='trading-config__martingale-checkbox-input'
                                        checked={localSettings.martingaleResetOnWin !== false}
                                        onChange={e => handleChange('martingaleResetOnWin', e.target.checked)}
                                    />
                                    Reset to base stake on win
                                </label>
                            </div>
                            <div className='trading-config__martingale-warning'>
                                ⚠️ Martingale increases stakes after losses - Monitor your balance carefully!
                            </div>
                        </div>
                    )}
                </div>

                {/* Stop After Wins Toggle Button */}
                <div className='trading-config__stop-wins-toggle'>
                    <button
                        className={`trading-config__stop-wins-button ${localSettings.stopAfterWins ? 'trading-config__stop-wins-button--active' : ''}`}
                        onClick={() => handleChange('stopAfterWins', !localSettings.stopAfterWins)}
                        type='button'
                    >
                        <div className='trading-config__stop-wins-button-content'>
                            <div className='trading-config__stop-wins-button-icon'>🎯</div>
                            <div className='trading-config__stop-wins-button-text'>
                                <span className='trading-config__stop-wins-button-title'>Stop After Wins</span>
                                <span className='trading-config__stop-wins-button-subtitle'>
                                    {localSettings.stopAfterWins
                                        ? 'Auto-Stop After Target Wins Active'
                                        : 'Click to Enable Win Target Stop'}
                                </span>
                            </div>
                            <div className='trading-config__stop-wins-button-status'>
                                {localSettings.stopAfterWins ? 'ON' : 'OFF'}
                            </div>
                        </div>
                    </button>
                    {localSettings.stopAfterWins && (
                        <div className='trading-config__stop-wins-settings'>
                            <div className='trading-config__stop-wins-setting'>
                                <label>Stop After Wins:</label>
                                <input
                                    type='number'
                                    className='trading-config__stop-wins-input'
                                    value={localSettings.stopAfterWinsCount || 5}
                                    onChange={e => handleChange('stopAfterWinsCount', parseInt(e.target.value))}
                                    min='1'
                                    max='100'
                                />
                            </div>
                            <div className='trading-config__stop-wins-info'>
                                ✅ Trading will stop automatically after {localSettings.stopAfterWinsCount || 5} winning
                                trades
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={`trading-config__form ${isCollapsed ? 'trading-config__form--collapsed' : ''}`}>
                {/* Market Selection */}
                <div className='trading-config__section'>
                    <h3 className='trading-config__section-title'>Market</h3>
                    <select
                        className='trading-config__select'
                        value={localSettings.market}
                        onChange={e => handleChange('market', e.target.value)}
                    >
                        <option value='R_10'>Volatility 10 Index</option>
                        <option value='R_25'>Volatility 25 Index</option>
                        <option value='R_50'>Volatility 50 Index</option>
                        <option value='R_75'>Volatility 75 Index</option>
                        <option value='R_100'>Volatility 100 Index</option>
                        <option value='1HZ10V'>Volatility 10 (1s) Index</option>
                        <option value='1HZ25V'>Volatility 25 (1s) Index</option>
                        <option value='1HZ50V'>Volatility 50 (1s) Index</option>
                        <option value='1HZ75V'>Volatility 75 (1s) Index</option>
                        <option value='1HZ100V'>Volatility 100 (1s) Index</option>
                    </select>
                </div>

                {/* Trade Type */}
                <div className='trading-config__section'>
                    <h3 className='trading-config__section-title'>Trade Type</h3>
                    <select
                        className='trading-config__select'
                        value={localSettings.tradeType}
                        onChange={e => handleChange('tradeType', e.target.value)}
                    >
                        <option value='DIGITEVEN'>Even/Odd - Even</option>
                        <option value='DIGITODD'>Even/Odd - Odd</option>
                        <option value='DIGITOVER'>Over</option>
                        <option value='DIGITUNDER'>Under</option>
                        <option value='CALL'>Rise</option>
                        <option value='PUT'>Fall</option>
                        <option value='DIGITMATCH'>Matches</option>
                        <option value='DIGITDIFF'>Differs</option>
                    </select>
                </div>

                {/* Conditional: Barrier */}
                {needsBarrier && (
                    <div className='trading-config__section'>
                        <h3 className='trading-config__section-title'>Barrier (0-9)</h3>
                        <input
                            type='number'
                            className='trading-config__input'
                            value={localSettings.barrier || '5'}
                            onChange={e => handleChange('barrier', e.target.value)}
                            min='0'
                            max='9'
                        />
                    </div>
                )}

                {/* Conditional: Prediction */}
                {needsPrediction && (
                    <div className='trading-config__section'>
                        <h3 className='trading-config__section-title'>Prediction Digit (0-9)</h3>
                        <input
                            type='number'
                            className='trading-config__input'
                            value={localSettings.prediction || '5'}
                            onChange={e => handleChange('prediction', parseInt(e.target.value))}
                            min='0'
                            max='9'
                        />
                    </div>
                )}

                {/* Stake */}
                <div className='trading-config__section'>
                    <h3 className='trading-config__section-title'>Stake ($)</h3>
                    <input
                        type='number'
                        className='trading-config__input'
                        value={localSettings.stake}
                        onChange={e => handleChange('stake', parseFloat(e.target.value))}
                        min='0.35'
                        max='50000'
                        step='0.01'
                    />
                </div>

                {/* Duration */}
                <div className='trading-config__section'>
                    <h3 className='trading-config__section-title'>Duration (ticks)</h3>
                    <input
                        type='number'
                        className='trading-config__input'
                        value={localSettings.duration}
                        onChange={e => handleChange('duration', parseInt(e.target.value))}
                        min='1'
                        max='5'
                    />
                </div>

                {/* Risk Management */}
                <div className='trading-config__section trading-config__section--full'>
                    <h3 className='trading-config__section-title'>Risk Management</h3>
                    <div className='trading-config__grid'>
                        <div className='trading-config__field'>
                            <label>Stop Loss ($)</label>
                            <input
                                type='number'
                                className='trading-config__input'
                                value={localSettings.stopLoss}
                                onChange={e => handleChange('stopLoss', parseFloat(e.target.value))}
                                min='0'
                                step='0.01'
                            />
                        </div>
                        <div className='trading-config__field'>
                            <label>Take Profit ($)</label>
                            <input
                                type='number'
                                className='trading-config__input'
                                value={localSettings.takeProfit}
                                onChange={e => handleChange('takeProfit', parseFloat(e.target.value))}
                                min='0'
                                step='0.01'
                            />
                        </div>
                        <div className='trading-config__field'>
                            <label>Max Consecutive Losses</label>
                            <input
                                type='number'
                                className='trading-config__input'
                                value={localSettings.maxConsecutiveLosses}
                                onChange={e => handleChange('maxConsecutiveLosses', parseInt(e.target.value))}
                                min='1'
                                max='20'
                            />
                        </div>
                        <div className='trading-config__field'>
                            <label>Daily Loss Limit ($)</label>
                            <input
                                type='number'
                                className='trading-config__input'
                                value={localSettings.dailyLossLimit}
                                onChange={e => handleChange('dailyLossLimit', parseFloat(e.target.value))}
                                min='0'
                                step='0.01'
                            />
                        </div>
                    </div>
                </div>

                {/* Auto-Trading Settings */}
                <div className='trading-config__section trading-config__section--full'>
                    <h3 className='trading-config__section-title'>Auto-Trading</h3>
                    <div className='trading-config__grid'>
                        <div className='trading-config__field'>
                            <label>Target Trades</label>
                            <input
                                type='number'
                                className='trading-config__input'
                                value={localSettings.targetTrades}
                                onChange={e => handleChange('targetTrades', parseInt(e.target.value))}
                                min='1'
                                max='1000'
                            />
                        </div>
                        <div className='trading-config__field'>
                            <label>Delay Between Trades (ms)</label>
                            <input
                                type='number'
                                className='trading-config__input'
                                value={localSettings.delayBetweenTrades}
                                onChange={e => handleChange('delayBetweenTrades', parseInt(e.target.value))}
                                min='100'
                                max='5000'
                                step='100'
                            />
                        </div>
                        <div className='trading-config__field trading-config__field--full'>
                            <label>Strategy</label>
                            <select
                                className='trading-config__select'
                                value={localSettings.strategy}
                                onChange={e => handleChange('strategy', e.target.value)}
                            >
                                <option value='momentum'>Momentum</option>
                                <option value='mean-reversion'>Mean Reversion</option>
                                <option value='pattern'>Pattern Recognition</option>
                                <option value='martingale'>Martingale</option>
                                <option value='random'>Random (Testing)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingConfig;
