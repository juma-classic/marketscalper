# Debug Pending Trades Issue

## What Was Fixed

### 1. Stats Not Reflecting Winning Trades

**Problem**: Trades were being added to history before they completed, so stats showed 0 even with winning trades.

**Solution**:

-   Modified `getHistory()` to only return completed trades (with profit data)
-   Added `getAllTrades()` to get all trades including pending
-   Updated stats calculation to only count completed trades
-   Performance Dashboard now shows all trades in recent list but only counts completed ones in stats

### 2. Better Trade Monitoring

**Problem**: Contract updates weren't being logged properly, making it hard to debug.

**Solution**:

-   Added detailed logging throughout the contract monitoring process
-   Added `checkContractStatus()` method to manually check stuck contracts
-   Added `getActiveContracts()` to see which contracts are being monitored

### 3. TypeScript Fixes

-   Fixed type errors in contract subscription handling
-   Improved type safety for API responses

## How to Debug Pending Trades

### Step 1: Open Browser Console

Press F12 to open developer tools and check the Console tab.

### Step 2: Look for These Logs

When you execute a trade, you should see:

```
🎯 Starting signal trade execution: {...}
✅ API connected and authenticated
📋 Contract type: DIGITOVER
🎲 Using barrier: 5 for type: OVER5
📝 Getting proposal...
✅ Proposal received: <proposal_id>
💰 Buying contract...
✅ Contract purchased: <contract_id>
👀 Starting to monitor contract: <contract_id>
📡 Subscription response: <subscription_id>
✅ Successfully subscribed to contract updates
```

### Step 3: Check for Contract Updates

While the contract is running, you should see:

```
📊 Contract update: { id: xxx, status: 'open', is_sold: false, profit: undefined }
```

When it completes:

```
📊 Contract update: { id: xxx, status: 'sold', is_sold: true, profit: 0.85 }
✅ Contract completed, adding to history: {...}
🎉 Signal Trade Won! Profit: 0.85 USD
```

### Step 4: If Trades Are Stuck on Pending

Open browser console and run:

```javascript
// Check active contracts
const activeContracts = signalTradingService.getActiveContracts();
console.log('Active contracts:', Array.from(activeContracts.entries()));

// Manually check a contract status
signalTradingService.checkContractStatus(YOUR_CONTRACT_ID);
```

### Step 5: Common Issues

#### Issue: No subscription response

**Symptom**: You see "❌ Failed to subscribe to contract updates"
**Solution**:

-   Check if API is still connected
-   Try refreshing the page
-   Check if you're still authenticated

#### Issue: Contract updates not received

**Symptom**: You see subscription success but no "📊 Contract update" logs
**Solution**:

-   The WebSocket connection might have dropped
-   Refresh the page to reconnect
-   Check your internet connection

#### Issue: OVER/UNDER trades not executing

**Symptom**: Auto-trade doesn't execute OVER/UNDER signals
**Solution**:

-   Open Auto-Trade Settings (🤖 button)
-   Make sure OVER1-5 and UNDER1-5 are checked in "Allowed Signal Types"
-   By default, only RISE and FALL are enabled

## Testing Your Fixes

1. **Clear old data**: Open console and run:

    ```javascript
    signalTradingService.clearHistory();
    ```

2. **Execute a test trade**: Click "Trade Now" on any signal

3. **Watch the console**: You should see all the logs mentioned above

4. **Check Performance Dashboard**:
    - Recent trades should show the trade as "Pending"
    - When it completes, it should update to "Won" or "Lost"
    - Stats should update immediately

## What to Report

If trades are still stuck, please provide:

1. Screenshot of browser console showing the logs
2. Screenshot of Performance Dashboard showing pending trades
3. The contract ID of a stuck trade
4. How long the trade has been pending

## Quick Fixes

### Force refresh all contract statuses

```javascript
const activeContracts = signalTradingService.getActiveContracts();
activeContracts.forEach((config, contractId) => {
    signalTradingService.checkContractStatus(contractId);
});
```

### Check if API is connected

```javascript
console.log('API connected:', !!api_base.api);
console.log('Auth token:', !!localStorage.getItem('authToken'));
```

### View all trades

```javascript
console.log('All trades:', signalTradingService.getAllTrades());
console.log('Completed trades:', signalTradingService.getHistory());
console.log('Stats:', signalTradingService.getStats());
```
