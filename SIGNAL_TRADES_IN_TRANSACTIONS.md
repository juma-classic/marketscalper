# Signal Trades in Transactions 📊

## How It Works

When you click "🎯 Trade Now" on a signal, the trade is executed through the **Deriv API** as a real contract. This means:

✅ **Trades appear in Transactions tab automatically**
✅ **Same as bot trades** - they're real Deriv contracts
✅ **Full transaction details** available
✅ **Profit/loss tracked** in statistics
✅ **Can be viewed in detail** by clicking on them

## Where to Find Your Signal Trades

### 1. Transactions Tab (Main View)

**Location**: Run Panel → Transactions Tab

**What you'll see**:

-   All your trades listed chronologically
-   Entry/Exit spots
-   Buy price and P/L
-   Contract type (RISE, FALL, etc.)

**Signal trades appear exactly like bot trades** because they ARE real trades!

### 2. Transaction Details

**How to access**:

1. Go to Transactions tab
2. Click "View Detail" button
3. See full transaction history with:
    - Date and time
    - Contract ID
    - Entry/Exit prices
    - Profit/Loss
    - Duration
    - Market

### 3. Performance Dashboard

**Location**: Signals Center → Click "📊 Analytics"

**What you'll see**:

-   Signal-specific statistics
-   Recent trades list
-   Win/loss breakdown
-   Export option for CSV

## Identifying Signal Trades

### In Transactions Tab

Signal trades appear with the same format as other trades:

-   Contract type badge (RISE/FALL/EVEN/ODD)
-   Entry and exit spots
-   Buy price and profit/loss
-   Timestamp

### In Analytics Dashboard

Signal trades are tracked separately with:

-   Signal ID reference
-   Market and type
-   Timestamp
-   Full profit/loss details

## Example Flow

```
1. You see a HIGH confidence RISE signal
   ↓
2. Click "🎯 Trade Now"
   ↓
3. Trade executes via Deriv API
   ↓
4. Contract ID: 123456789 created
   ↓
5. Trade appears in Transactions tab immediately
   ↓
6. Contract monitored in real-time
   ↓
7. When closed, profit/loss updates
   ↓
8. Statistics update in both:
   - Transactions tab
   - Analytics dashboard
```

## Viewing Trade Details

### In Transactions Tab

1. **Find your trade** in the list
2. **Click on it** to see details:

    - Contract ID
    - Entry price
    - Exit price
    - Profit/Loss
    - Duration
    - Barrier (for digit contracts)

3. **Click "View Detail"** for full history:
    - All trades in table format
    - Sortable columns
    - Filterable by date
    - Downloadable

### In Analytics Dashboard

1. **Click "📊 Analytics"** in Signals Center
2. **See "Recent Trades"** section
3. **View last 10 trades** with:

    - Time
    - Contract ID
    - Result (WIN/LOSS)
    - Profit/Loss amount

4. **Click "Export History"** to download CSV with:
    - All signal trades
    - Full details
    - Ready for analysis

## Statistics Integration

### Transactions Tab Statistics

Your signal trades contribute to:

-   **Total Runs**: Increments with each trade
-   **Won Contracts**: Increments on winning trades
-   **Lost Contracts**: Increments on losing trades
-   **Total Profit**: Adds/subtracts profit/loss
-   **Total Stake**: Adds buy price
-   **Total Payout**: Adds payout on wins

### Analytics Dashboard Statistics

Separate statistics for signal trades only:

-   **Total Trades**: Signal trades count
-   **Win Rate**: Signal-specific win percentage
-   **Total Profit**: Signal trades profit/loss
-   **Average Profit**: Per-trade average
-   **Best Trade**: Highest profit
-   **Worst Trade**: Biggest loss
-   **Today's Trades**: Trades today
-   **Today's Profit**: Profit today
-   **Last Hour**: Trades in last hour

## Comparing Views

### Transactions Tab

-   **Shows**: ALL trades (bot + signals + manual)
-   **Purpose**: Complete trading history
-   **Best for**: Overall performance tracking

### Analytics Dashboard

-   **Shows**: ONLY signal trades
-   **Purpose**: Signal-specific performance
-   **Best for**: Evaluating signal quality

## Downloading Trade History

### From Transactions Tab

1. Click "Download" button
2. Select format (CSV/JSON)
3. Get all transactions including signal trades

### From Analytics Dashboard

1. Click "📥 Export History (CSV)"
2. Get signal trades only
3. Includes:
    - Timestamp
    - Signal ID
    - Contract ID
    - Profit/Loss
    - Result (WIN/LOSS)
    - Error messages (if any)

## Real-Time Updates

### During Trade Execution

**Transactions Tab**:

-   Trade appears immediately after purchase
-   Shows "In Progress" status
-   Updates when contract closes
-   Final profit/loss displayed

**Signals Center**:

-   Signal status: ACTIVE → TRADING → WON/LOST
-   Profit/loss shown on signal card
-   Statistics update automatically

### After Trade Completion

**Both views update**:

-   Final profit/loss
-   Win/loss status
-   Statistics recalculated
-   History updated

## Example Scenario

### You place 3 signal trades:

**Trade 1**: RISE on R_50, Stake: 1 USD

-   Result: WIN, Profit: +0.95 USD
-   Appears in Transactions: ✅
-   Appears in Analytics: ✅

**Trade 2**: FALL on R_100, Stake: 1 USD

-   Result: LOSS, Profit: -1.00 USD
-   Appears in Transactions: ✅
-   Appears in Analytics: ✅

**Trade 3**: EVEN on 1HZ100V, Stake: 1 USD

-   Result: WIN, Profit: +0.90 USD
-   Appears in Transactions: ✅
-   Appears in Analytics: ✅

### Transactions Tab Shows:

-   3 new trades in the list
-   Total profit: -0.15 USD
-   Win rate: 66.7% (2 wins, 1 loss)

### Analytics Dashboard Shows:

-   Total Trades: 3
-   Wins: 2, Losses: 1
-   Total Profit: -0.15 USD
-   Win Rate: 66.7%
-   Recent trades list with all 3

## Benefits

✅ **Complete History**: All trades in one place
✅ **Real Contracts**: Actual Deriv API trades
✅ **Dual Tracking**: Both general and signal-specific stats
✅ **Easy Export**: Download for analysis
✅ **Real-Time**: Instant updates
✅ **Detailed Info**: Full contract details available

## Summary

**Your signal trades ARE in the Transactions tab!**

They appear automatically because they're real Deriv API contracts. You can:

-   View them in Transactions tab (all trades)
-   View them in Analytics dashboard (signal trades only)
-   Click for details
-   Export history
-   Track statistics

**No additional setup needed** - it works automatically! 🎉
