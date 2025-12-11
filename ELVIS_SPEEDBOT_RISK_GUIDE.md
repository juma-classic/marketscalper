# Elvis SpeedBot - Risk-Based Martingale Guide

## How to Use

The bot now prompts you for:

1. **Entry Point** (the digit where you want to enter)
2. **Prediction Digit** (1-9, the digit you're betting on)
3. **Contract Type** (OVER or UNDER)

## Martingale Settings by Risk Level

### For OVER Trades (DIGITOVER)

| Prediction Digit | Risk Level | Martingale | Why?                                     |
| ---------------- | ---------- | ---------- | ---------------------------------------- |
| OVER 1, 2, 3     | HIGH       | **2.1x**   | Harder to hit (only 1-3 digits qualify)  |
| OVER 4, 5        | MEDIUM     | **1.8x**   | Moderate difficulty (4-5 digits qualify) |
| OVER 6, 7, 8, 9  | LOW        | **1.6x**   | Easier to hit (6-9 digits qualify)       |

### For UNDER Trades (DIGITUNDER)

| Prediction Digit | Risk Level | Martingale | Why?                                      |
| ---------------- | ---------- | ---------- | ----------------------------------------- |
| UNDER 6, 7, 8    | HIGH       | **2.1x**   | Harder to hit (only 0-6, 0-7, 0-8 digits) |
| UNDER 4, 5       | MEDIUM     | **1.8x**   | Moderate difficulty                       |
| UNDER 3          | LOW        | **1.6x**   | Easier to hit (0-3 digits qualify)        |

## Manual Setup Instructions

Since the bot currently has a default martingale of **1.8x**, you need to manually adjust it based on your trade:

### Before Running the Bot:

1. Open the bot in Bot Builder
2. Find the "Martangle" variable in the INITIALIZATION section
3. Change the value based on your trade:
    - **High Risk trades**: Change to `2.1`
    - **Medium Risk trades**: Keep at `1.8`
    - **Low Risk trades**: Change to `1.6`

### Quick Reference:

**Trading OVER 1, 2, or 3?** → Set Martingale to **2.1**
**Trading OVER 4 or 5?** → Set Martingale to **1.8**
**Trading OVER 6, 7, 8, or 9?** → Set Martingale to **1.6**

**Trading UNDER 6, 7, or 8?** → Set Martingale to **2.1**
**Trading UNDER 4 or 5?** → Set Martingale to **1.8**
**Trading UNDER 3?** → Set Martingale to **1.6**

## Why This Strategy Works

-   **High Risk = Higher Martingale**: When the probability of winning is lower, you need a higher multiplier to recover losses
-   **Low Risk = Lower Martingale**: When the probability is higher, a lower multiplier is sufficient and safer
-   This approach balances risk and reward while protecting your capital

## Example Scenarios

### Scenario 1: Trading OVER 2

-   Risk: HIGH (only digits 3-9 win)
-   Martingale: **2.1x**
-   Initial Stake: $0.35
-   After loss: $0.74, then $1.55, then $3.26...

### Scenario 2: Trading OVER 7

-   Risk: LOW (digits 8-9 win)
-   Martingale: **1.6x**
-   Initial Stake: $0.35
-   After loss: $0.56, then $0.90, then $1.44...

### Scenario 3: Trading UNDER 7

-   Risk: HIGH (only digits 0-6 win)
-   Martingale: **2.1x**
-   More aggressive recovery needed

## Tips

1. Always verify your martingale setting matches your trade type
2. Start with lower stakes when using 2.1x martingale
3. Monitor your martingale level limit (default is 9)
4. Adjust take profit and stop loss based on your risk tolerance
