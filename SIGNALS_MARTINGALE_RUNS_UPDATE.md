# Signals Center - Martingale Prediction & Runs Control Update

## ✅ Features Added

### 1. **Martingale Prediction Selector** 📊

Each signal card now includes a dropdown to select the prediction type for martingale trading strategy:

-   **Rise/Fall**: Choose between RISE 📈 or FALL 📉
-   **Even/Odd**: Select EVEN ⚪ or ODD ⚫
-   **Over**: Pick from OVER 1-5 ⬆️
-   **Under**: Choose from UNDER 1-5 ⬇️

**Default**: Uses the signal's original prediction type

**Purpose**: Allows you to override the signal's prediction and use your own martingale strategy

### 2. **Number of Runs Control** 🔄

Control how many times each trade executes:

-   **Range**: 1-10 runs per signal
-   **Default**: 1 run
-   **Display**: Shows "(Nx)" on Trade Now button when runs > 1

**Example**: Set to 3 runs → Button shows "🎯 Trade Now (3x)"

## 🎯 How to Use

### For Each Signal:

1. **Select Prediction** (Martingale Strategy)

    - Click the "Prediction" dropdown
    - Choose your desired prediction type
    - Default is the signal's original type

2. **Set Number of Runs**

    - Enter a number between 1-10 in the "Runs" field
    - Each run executes with the same stake amount
    - Runs execute sequentially with 1-second delay between them

3. **Execute Trade**
    - Click "🎯 Trade Now" button
    - All runs execute automatically
    - Total profit/loss is calculated across all runs

## 📊 Trade Execution Logic

### Multiple Runs:

```
Run 1: Execute trade → Wait 1s
Run 2: Execute trade → Wait 1s
Run 3: Execute trade → Complete
```

### Profit Calculation:

-   Each run's profit/loss is tracked
-   Total profit = Sum of all runs
-   Signal status updates based on majority (more wins = WON)

### Take Profit / Stop Loss:

If configured in Auto-Trade Settings:

-   Runs stop early if take profit target is reached
-   Runs stop early if stop loss limit is hit

## 🎨 Visual Design

### Martingale Selector:

-   **Color**: Teal border (#0d9488) on hover/focus
-   **Width**: 140px minimum
-   **Style**: Grouped options with emojis
-   **Hover**: Light teal background (#f0fdfa)

### Runs Input:

-   **Color**: Maroon border (#7d1f3d) on hover/focus
-   **Width**: 60px
-   **Style**: Centered text, numeric input
-   **Hover**: Light red background (#fef2f2)

### Trade Now Button:

-   **Color**: Teal gradient (#0d9488 → #0f766e)
-   **Effect**: Lift on hover, shadow animation
-   **Display**: Shows run count when > 1

## 🔧 Technical Details

### State Management:

```typescript
// Martingale predictions per signal
const [martingalePredictions, setMartingalePredictions] = useState<Record<string, string>>({});

// Number of runs per signal
const [tradeRuns, setTradeRuns] = useState<Record<string, number>>({});
```

### Trade Execution:

```typescript
// Get selected prediction (defaults to signal type)
const selectedPrediction = martingalePredictions[signal.id] || signal.type;

// Get number of runs (defaults to 1)
const numberOfRuns = tradeRuns[signal.id] || 1;

// Execute trades with selected prediction
for (let run = 1; run <= numberOfRuns; run++) {
    await signalTradingService.executeSignalTrade({
        type: selectedPrediction,
        // ... other params
    });
}
```

## 💡 Use Cases

### 1. **Martingale Strategy**

-   Signal suggests RISE
-   You select FALL for martingale
-   Set runs to 5
-   Each loss doubles stake (if martingale enabled in Auto-Trade)

### 2. **Bulk Testing**

-   Signal suggests EVEN
-   Keep EVEN selected
-   Set runs to 10
-   Test signal reliability with multiple executions

### 3. **Strategy Override**

-   Signal suggests OVER 3
-   You prefer UNDER 3 based on analysis
-   Set runs to 3
-   Execute your own strategy

## 🎯 Best Practices

1. **Start Small**: Begin with 1-2 runs to test
2. **Monitor Results**: Check profit/loss after each signal
3. **Use Stop Loss**: Configure in Auto-Trade Settings
4. **Match Stake**: Ensure default stake is appropriate for multiple runs
5. **Review History**: Check "My Signal Trades" section for results

## 🚀 Integration with Auto-Trade

These controls work alongside Auto-Trade Settings:

-   **Manual Control**: Use prediction selector and runs for individual signals
-   **Auto-Trade**: Configure global settings for automatic trading
-   **Hybrid**: Manual trades use these controls, auto-trades use global settings

## 📈 Performance Tracking

All trades are tracked in:

-   **My Signal Trades**: Recent 5 trades displayed
-   **Performance Dashboard**: Full analytics (click "📊 Analytics")
-   **Trade Stats**: Win rate, total profit, streak tracking

---

**Status**: ✅ Implemented and Ready
**Version**: 1.0.0
**Date**: November 25, 2025

---

## 🔁 NEW: Auto-Loop Feature

### 3. **Auto-Loop Control** 🔄

Automatically repeat trade batches multiple times without manual intervention:

-   **Range**: 1-100 loops
-   **Default**: 1 loop (single execution)
-   **Display**: Shows "🔁 Trade Now (Nx) ×Y loops" when auto-loop is active

**How It Works**:

1. Set "Runs" to define how many trades per batch (e.g., 3)
2. Set "Auto-Loop" to define how many times to repeat the batch (e.g., 10)
3. Click "Trade Now" - it will execute 3 trades, then repeat 10 times (30 total trades)

### Auto-Loop Execution Flow:

```
Batch 1: Run 1 → Run 2 → Run 3 → Wait 2s
Batch 2: Run 1 → Run 2 → Run 3 → Wait 2s
Batch 3: Run 1 → Run 2 → Run 3 → Wait 2s
...
Batch 10: Run 1 → Run 2 → Run 3 → Complete
```

### Stop Auto-Loop:

-   While auto-looping, a "🛑 Stop Loop" button appears
-   Click to stop after the current batch completes
-   Prevents accidental over-trading

### Visual Indicators:

-   **Trading**: Shows "🔁 Auto-Looping..." instead of "⏳ Trading..."
-   **Button**: Changes from 🎯 to 🔁 when auto-loop > 1
-   **Progress**: Console logs show batch progress (Batch X/Y)

## 📊 Example Use Cases

### Example 1: Martingale Strategy with Auto-Loop

```
Prediction: EVEN
Runs: 1
Auto-Loop: 10
Result: Executes EVEN trade 10 times automatically
```

### Example 2: Bulk Testing with Multiple Runs

```
Prediction: OVER 3
Runs: 5
Auto-Loop: 20
Result: Executes 5 OVER 3 trades per batch, 20 batches = 100 total trades
```

### Example 3: Conservative Testing

```
Prediction: RISE
Runs: 2
Auto-Loop: 5
Result: Executes 2 RISE trades per batch, 5 batches = 10 total trades
```

## 🎨 Updated Styling

### Auto-Loop Input:

-   **Color**: Gold/yellow border (#fbbf24) on hover/focus
-   **Width**: 70px
-   **Style**: Centered text, numeric input
-   **Hover**: Light yellow background (#fffbeb)

### Stop Loop Button:

-   **Color**: Red gradient (#ef4444 → #dc2626)
-   **Effect**: Lift on hover, shadow animation
-   **Display**: Only visible during auto-loop execution

## 🔧 Technical Implementation

### State Management:

```typescript
// Auto-loop runs per signal
const [autoLoopRuns, setAutoLoopRuns] = useState<Record<string, number>>({});

// Track which signals are auto-looping
const [isAutoLooping, setIsAutoLooping] = useState<Record<string, boolean>>({});
```

### Auto-Loop Execution:

```typescript
const handleAutoLoopTrade = async (signal: Signal) => {
    const loopCount = autoLoopRuns[signal.id] || 1;

    for (let batch = 1; batch <= loopCount; batch++) {
        // Execute batch of trades
        await executeTradeBatch(signal, batch, loopCount);

        // Delay between batches
        if (batch < loopCount) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};
```

### Stop Mechanism:

```typescript
const stopAutoLoop = (signalId: string) => {
    setIsAutoLooping(prev => ({ ...prev, [signalId]: false }));
};
```

## 💡 Best Practices for Auto-Loop

1. **Start Small**: Test with 2-3 loops first
2. **Monitor Balance**: Ensure sufficient account balance
3. **Use Stop Loss**: Configure in Auto-Trade Settings
4. **Watch Progress**: Check console logs for batch updates
5. **Stop if Needed**: Use Stop Loop button to halt execution
6. **Combine Wisely**: Balance runs × loops for optimal results

## ⚠️ Safety Features

1. **Stop Button**: Immediately available during auto-loop
2. **Batch Delays**: 2-second pause between batches
3. **Run Delays**: 1-second pause between runs
4. **Status Tracking**: Clear visual indicators of progress
5. **Error Handling**: Failed runs don't stop the loop

## 🚀 Performance Tips

-   **Low Runs, High Loops**: Better for testing consistency (e.g., 1 run × 50 loops)
-   **High Runs, Low Loops**: Better for batch strategies (e.g., 10 runs × 5 loops)
-   **Balanced Approach**: Moderate both for steady trading (e.g., 3 runs × 10 loops)

---

**Status**: ✅ Fully Implemented and Tested
**Version**: 2.0.0 (Added Auto-Loop)
**Date**: November 25, 2025
