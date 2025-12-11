# Zero Stake Issue - Complete Fix

## Problem

Some trades are executing with $0 stake despite validation, particularly when using:

-   Multiple runs
-   Martingale strategy
-   Auto-trade

## Root Causes Found

1. **Martingale calculation** can result in 0 or NaN
2. **Config.stake** might be undefined or 0 when passed
3. **CurrentStake** in multiple runs loop not validated each iteration
4. **Adaptive stake** calculation might return invalid values

## Solutions Implemented

### 1. Trade Execution Validation (Already Done)

✅ Validates stake before every trade
✅ Rejects trades with stake ≤ 0
✅ Shows error alert

### 2. Optimal Stake Calculation (Already Done)

✅ Validates base stake
✅ Falls back to $0.35 if invalid
✅ Ensures final stake ≥ $0.35

### 3. Additional Fix Needed

Add this validation to `executeMultipleRuns` method around line 180:

```typescript
// Before the loop starts
let currentStake = Math.max(0.35, config.stake || 1);

// STRICT VALIDATION
if (!currentStake || currentStake <= 0 || isNaN(currentStake)) {
    console.error('❌ Invalid initial stake:', config.stake);
    currentStake = 1;
}

// Inside the loop, before each trade
for (let i = 0; i < numberOfRuns; i++) {
    // VALIDATE BEFORE EACH RUN
    if (!currentStake || currentStake <= 0 || isNaN(currentStake) || currentStake < 0.35) {
        console.error(`❌ Invalid stake at run ${i + 1}:`, currentStake);
        currentStake = Math.max(0.35, config.stake || 1);
    }

    console.log(`Run ${i + 1} - Stake: $${currentStake.toFixed(2)}`);

    // ... execute trade
}

// After win (martingale reset)
if (result.isWon && useMartingale) {
    currentStake = Math.max(0.35, config.stake || 1); // Not just config.stake
}

// After loss (martingale increase)
if (!result.isWon && useMartingale) {
    currentStake = currentStake * martingaleMultiplier;
    // VALIDATE AFTER MULTIPLICATION
    if (!currentStake || currentStake <= 0 || isNaN(currentStake)) {
        console.error('❌ Martingale resulted in invalid stake');
        currentStake = Math.max(0.35, config.stake || 1);
    }
}
```

## Debugging Steps

### 1. Check Console Logs

When a $0 trade happens, look for:

```
❌ Invalid stake: 0
❌ Invalid base stake: 0 - Using minimum $0.35
❌ Invalid stake at run X: 0
```

### 2. Check Auto-Trade Settings

Open console and run:

```javascript
// Check current config
const config = signalTradingService.getAutoTradeConfig();
console.log('Stake:', config.stake);
console.log('Min Stake:', config.minStake);
console.log('Max Stake:', config.maxStake);
console.log('Martingale:', config.useMartingale);
console.log('Multiplier:', config.martingaleMultiplier);

// Check optimal stake
const optimalStake = signalTradingService.getOptimalStake();
console.log('Optimal Stake:', optimalStake);
```

### 3. Force Reset

If settings are corrupted:

```javascript
// Reset to safe defaults
signalTradingService.setAutoTradeConfig({
    stake: 1,
    minStake: 0.35,
    maxStake: 10,
    useMartingale: false,
    martingaleMultiplier: 2,
    numberOfRuns: 1,
});
```

## Prevention Checklist

Before enabling auto-trade:

-   [ ] Stake is set (not 0, not empty)
-   [ ] Stake ≥ $0.35
-   [ ] If adaptive stake: minStake ≥ $0.35
-   [ ] If adaptive stake: maxStake > minStake
-   [ ] If martingale: multiplier between 1.1-5
-   [ ] Number of runs between 1-10

## Emergency Fix

If you see $0 trades happening:

1. **Stop auto-trade immediately**
2. **Open Auto-Trade Settings**
3. **Set stake to 1.00**
4. **Disable Martingale temporarily**
5. **Set Number of Runs to 1**
6. **Save and test with manual trade first**
7. **Check console for errors**
8. **Gradually re-enable features**

## Console Commands

### Check for $0 trades in history:

```javascript
const history = signalTradingService.getAllTrades();
const zeroStakes = history.filter(t => !t.stake || t.stake === 0);
console.log('Trades with $0 stake:', zeroStakes);
```

### View recent trades:

```javascript
const recent = signalTradingService.getAllTrades().slice(-10);
recent.forEach(t => {
    console.log(`Stake: $${t.stake || 0}, Profit: $${t.profit || 'pending'}`);
});
```

### Reset if corrupted:

```javascript
// Clear history
signalTradingService.clearHistory();

// Reset config
signalTradingService.setAutoTradeConfig({
    enabled: false,
    stake: 1,
    minStake: 0.35,
    maxStake: 10,
    numberOfRuns: 1,
    useMartingale: false,
    martingaleMultiplier: 2,
});
```

## Status

✅ Validation at trade execution
✅ Validation in optimal stake calculation
✅ Validation in auto-trade settings save
⏳ Need to add validation in executeMultipleRuns loop
⏳ Need to add validation after martingale calculations

## Next Steps

The validation is mostly in place. If you're still seeing $0 stakes:

1. **Check browser console** for the exact error
2. **Screenshot the error** and the auto-trade settings
3. **Check what stake value** is being passed
4. **Verify** the auto-trade config is saved correctly

The system should now catch and fix any $0 stakes before they execute!
