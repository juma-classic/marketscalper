# Speed Mode - Real Trading Implementation Guide

## 🚀 Overview

Speed Mode now supports **REAL TRADING** with the Deriv API! This feature allows automated high-frequency trading on Deriv's synthetic indices with full configuration and risk management.

## ✅ What's Been Implemented

### 1. Real Deriv Trading API Integration (`src/utils/deriv-trading-api.ts`)

-   ✅ WebSocket connection to Deriv API
-   ✅ Account authorization using stored tokens
-   ✅ Balance checking
-   ✅ Contract proposal generation
-   ✅ Real trade execution (buy contracts)
-   ✅ Contract result monitoring
-   ✅ Error handling and timeout management

### 2. Configuration Panel (`src/components/speed-mode/SpeedModeConfig.tsx`)

-   ✅ Market selection (R_10, R_25, R_50, R_75, R_100, 1HZ indices)
-   ✅ Strategy selector (Momentum, Reversal, Scalping, Zeus AI)
-   ✅ Trade type selection (DIGITEVEN, DIGITODD, DIGITMATCH, DIGITDIFF)
-   ✅ Stake amount input with balance-based limits
-   ✅ Target runs configuration
-   ✅ Contract duration settings (ticks or minutes)
-   ✅ Risk management (Stop Loss & Take Profit)
-   ✅ Real-time account balance display
-   ✅ Risk warning messages

### 3. Enhanced Trading Engine (`src/components/speed-mode/SpeedTradingEngine.tsx`)

-   ✅ Real trade execution via Deriv API
-   ✅ Multiple trading strategies:
    -   **Momentum**: Follow trend direction
    -   **Reversal**: Trade against trends
    -   **Scalping**: Quick digit-based trades
    -   **Zeus AI**: AI-powered predictions
-   ✅ Risk management enforcement (stop loss/take profit)
-   ✅ Real-time trade result display
-   ✅ Contract details (ID, buy price, payout, profit)
-   ✅ Error handling and display
-   ✅ Connection status indicators
-   ✅ Trade execution notifications

### 4. Enhanced UI/UX

-   ✅ Configuration toggle button
-   ✅ Real-time stats display (runs, wins, losses, profit)
-   ✅ Current tick information
-   ✅ Last trade result card
-   ✅ Error banners
-   ✅ Loading states
-   ✅ Toast notifications for trade results
-   ✅ Responsive design

## 📋 How to Use

### Step 1: Enable Speed Mode

1. Navigate to the **Bot Builder** tab
2. Look for the **Speed Mode** toggle at the top
3. Click to enable Speed Mode

### Step 2: Configure Settings

1. Click **"⚙️ Show Config"** to open the configuration panel
2. Configure your trading parameters:
    - **Market**: Choose your preferred synthetic index
    - **Strategy**: Select trading strategy
    - **Trade Type**: Choose contract type
    - **Stake**: Set your stake amount (max 10% of balance or $100)
    - **Target Runs**: Number of trades to execute
    - **Duration**: Contract duration in ticks or minutes
    - **Stop Loss**: Maximum loss before stopping
    - **Take Profit**: Target profit before stopping

### Step 3: Start Trading

1. Click **"🚀 Start Speed Trading"**
2. The system will:
    - Connect to Deriv API
    - Authorize your account
    - Start monitoring live ticks
    - Execute trades based on your strategy
3. Monitor real-time stats and trade results

### Step 4: Stop Trading

-   Click **"🛑 Stop Trading"** to stop at any time
-   Trading will auto-stop when:
    -   Target runs are reached
    -   Stop loss is hit
    -   Take profit is achieved

## 🎯 Trading Strategies Explained

### 1. Momentum Strategy 📈

-   Analyzes last 5 ticks
-   Follows the trend direction
-   Best for: Trending markets

### 2. Reversal Strategy 🔄

-   Analyzes last 3 ticks
-   Trades against the trend
-   Best for: Range-bound markets

### 3. Scalping Strategy ⚡

-   Quick digit-based trades
-   Uses last digit patterns
-   Best for: High-frequency trading

### 4. Zeus AI Strategy 🧠

-   AI-powered predictions
-   Frequency analysis of last 10 digits
-   Best for: Pattern recognition

## 🛡️ Risk Management

### Built-in Safety Features

1. **Maximum Stake Limit**: 10% of balance or $100 (whichever is lower)
2. **Stop Loss**: Automatically stops when loss limit is reached
3. **Take Profit**: Automatically stops when profit target is achieved
4. **Balance Checking**: Verifies sufficient balance before each trade
5. **Error Handling**: Graceful handling of API errors

### Best Practices

-   ✅ Start with small stakes ($0.35 - $1)
-   ✅ Use demo account for testing
-   ✅ Set conservative stop loss limits
-   ✅ Monitor trades actively
-   ✅ Don't risk more than you can afford to lose

## 📊 Real-Time Information

### Stats Display

-   **Runs**: Number of completed trades
-   **Wins**: Successful trades
-   **Losses**: Unsuccessful trades
-   **Profit**: Total profit/loss

### Trade Result Card

-   Contract ID
-   Buy Price
-   Payout
-   Profit/Loss

### Notifications

-   Toast notifications for each trade result
-   Success (green) for wins
-   Error (red) for losses

## 🔧 Technical Details

### API Integration

```typescript
// Connect to Deriv API
await derivAPI.connect();

// Authorize account
const accountInfo = await derivAPI.authorize();

// Execute trade
const result = await derivAPI.executeTrade({
    market: 'R_50',
    tradeType: 'DIGITEVEN',
    stake: 1,
    duration: 1,
    durationType: 't',
});
```

### Trade Flow

1. **Tick Received** → Strategy analyzes tick data
2. **Prediction Made** → Based on selected strategy
3. **Proposal Requested** → Get contract proposal from Deriv
4. **Trade Executed** → Buy contract via API
5. **Result Monitored** → Wait for contract settlement
6. **Stats Updated** → Update UI with results

## 🚨 Important Notes

### Account Requirements

-   Must be logged into Deriv account
-   Account token must be available in localStorage
-   Sufficient balance required

### Supported Markets

-   Volatility 10, 25, 50, 75, 100 Indices
-   Volatility 10, 25, 50 (1s) Indices

### Supported Contract Types

-   Even/Odd (DIGITEVEN, DIGITODD)
-   Matches (DIGITMATCH)
-   Differs (DIGITDIFF)

## 🐛 Troubleshooting

### "No auth token available"

-   Ensure you're logged into Deriv
-   Check that account token exists in localStorage

### "Not connected to Deriv API"

-   Check internet connection
-   Verify Deriv API is accessible
-   Try reconnecting

### "Insufficient balance"

-   Check account balance
-   Reduce stake amount
-   Top up account

### Trades not executing

-   Verify market is open
-   Check stake meets minimum requirements ($0.35)
-   Ensure contract type is supported for selected market

## 📈 Performance Tips

1. **Choose the right market**: 1s indices for faster trading
2. **Optimize strategy**: Test different strategies in demo
3. **Set realistic targets**: Don't aim for unrealistic profits
4. **Monitor actively**: Keep an eye on performance
5. **Adjust parameters**: Fine-tune based on results

## 🎨 UI Enhancements

### Visual Indicators

-   🟢 Green dot: Trading active
-   🟠 Orange dot: Connecting
-   🔴 Red dot: Stopped
-   ✅ Green card: Successful trade
-   ❌ Red card: Failed trade

### Responsive Design

-   Works on desktop and mobile
-   Adaptive grid layouts
-   Touch-friendly controls

## 🔐 Security

-   No API tokens stored in code
-   Uses existing Deriv session
-   Secure WebSocket connection (WSS)
-   Request timeout protection
-   Error message sanitization

## 📝 Future Enhancements

Potential improvements:

-   [ ] Trade history log
-   [ ] Advanced strategy builder
-   [ ] Backtesting capabilities
-   [ ] Multi-market trading
-   [ ] Custom indicators
-   [ ] Performance analytics
-   [ ] Export trade data

## ⚠️ Disclaimer

**Speed Mode involves real money trading and carries significant risk. Only trade with money you can afford to lose. Past performance does not guarantee future results. Always use risk management features and trade responsibly.**

---

## 🎉 Ready to Trade!

Your Speed Mode is now fully configured with real Deriv API integration. Start with small stakes, test your strategies, and trade responsibly!

For support or questions, refer to the Deriv API documentation or contact support.
