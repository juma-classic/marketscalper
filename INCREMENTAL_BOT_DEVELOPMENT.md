# Incremental Bot Development Guide

## Overview

We're building an automated trading bot step by step to avoid XML validation errors. The bot will:

1. Wait for cursor to touch digits above 6 (7, 8, 9) **2 times**
2. Then run "Under 8" for **exactly 5 trades**
3. Only trade **1 tick** duration
4. **Auto-stop** after 5 trades

## Development Steps

### ✅ Step 0: Base CFX-025 Bot

-   **File**: `CFX-025-Base.xml`
-   **Status**: ✅ Created - Exact copy of original working CFX-025
-   **Purpose**: Baseline to ensure original structure loads without errors

### ✅ Step 1: Add Basic Variables

-   **File**: `CFX-025-Step1.xml`
-   **Status**: ✅ Created - Added High Digit Count and Trade Count variables
-   **Changes**:
    -   Added `High Digit Count` variable (initialized to 0)
    -   Added `Trade Count` variable (initialized to 0)
-   **Test**: Load bot and verify variables appear in workspace

### ✅ Step 2: Add Digit Detection Logic

-   **File**: `CFX-025-Step2.xml`
-   **Status**: ✅ Created - Added digit detection logic
-   **Changes**:
    -   Added logic to detect when last digit is >= 7 (using `read_details` with `tick` and `math_modulo`)
    -   Increment High Digit Count when condition is met (using `math_change`)
    -   Keep original trading logic intact
-   **Test**: Load bot and verify High Digit Count increments when digits 7, 8, or 9 appear

### ✅ Step 3: Add Conditional Trading

-   **File**: `CFX-025-Step3.xml`
-   **Status**: ✅ Created - Added conditional trading logic
-   **Changes**:
    -   Only execute trades when High Digit Count >= 2 AND Trade Count < 5 (using `logic_operation` with `AND`)
    -   Changed prediction to "Under 8" (digit 7) - both overPrediction and underPrediction set to 7
    -   Changed purchase type to `DIGITUNDER` in all purchase blocks
    -   Wrapped original trading logic inside conditional check
-   **Test**: Bot should only trade after seeing 2+ high digits and stop after 5 trades

### ⏳ Step 4: Add Trade Counting

-   **File**: `CFX-025-Step4.xml`
-   **Status**: ⏳ Pending
-   **Changes**:
    -   Increment Trade Count after each purchase
    -   Reset counters appropriately

### ⏳ Step 5: Add Auto-Stop Logic

-   **File**: `CFX-025-Step5.xml`
-   **Status**: ⏳ Pending
-   **Changes**:
    -   Stop trading when Trade Count reaches 5
    -   Reset High Digit Count after completing 5 trades

## Bot Requirements Breakdown

### Digit Detection

-   Monitor last digit of tick price
-   Count consecutive occurrences of digits 7, 8, or 9
-   Requirement: Must see 2 high digits before trading

### Trading Logic

-   **Contract Type**: Over/Under (digits)
-   **Prediction**: Under 8 (digit 7)
-   **Duration**: 1 tick
-   **Stake**: Configurable (default 5)
-   **Max Trades**: Exactly 5 trades per cycle

### Auto-Stop Mechanism

-   Stop after exactly 5 trades
-   Reset counters for next cycle
-   Maintain original martingale logic for losses

## Testing Strategy

1. **Load Test**: Verify each step loads without XML errors
2. **Variable Test**: Check that new variables appear in workspace
3. **Logic Test**: Verify digit detection works correctly
4. **Trading Test**: Confirm trades execute only when conditions are met
5. **Stop Test**: Ensure bot stops after 5 trades

## Blockly Elements Used

### Safe Elements (Known to work)

-   `variables_set` - Variable assignment
-   `variables_get` - Variable retrieval
-   `math_number` - Number blocks
-   `logic_compare` - Comparison operations
-   `controls_if` - If/else conditions
-   `math_arithmetic` - Math operations
-   `trade_definition_tradeoptions` - Trade configuration
-   `purchase` - Trade execution

### Elements to Test Carefully

-   `read_details` with `tick` - Reading current tick price
-   `math_modulo` - Getting last digit (tick % 10)
-   `logic_ternary` - Conditional value assignment
-   `logic_operation` with `AND` - Multiple conditions

## Error Prevention

1. **Use exact IDs**: Copy IDs from working blocks
2. **Maintain structure**: Keep original block hierarchy
3. **Test incrementally**: Add one feature at a time
4. **Validate XML**: Ensure proper nesting and syntax

## Next Steps

1. Test CFX-025-Base.xml loads successfully
2. Test CFX-025-Step1.xml loads with new variables
3. Create Step 2 with digit detection logic
4. Continue incrementally until full functionality achieved

## Success Criteria

-   ✅ Bot loads without XML validation errors
-   ✅ Variables are properly initialized
-   ✅ Digit detection works correctly
-   ✅ Trading executes only when conditions are met
-   ✅ Bot stops automatically after 5 trades
-   ✅ Martingale logic preserved for risk management
