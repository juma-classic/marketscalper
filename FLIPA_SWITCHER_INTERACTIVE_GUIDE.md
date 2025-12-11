# Flipa Switcher - Interactive Strategy Builder

## ✅ New Interactive Features

The Flipa Switcher tab is now fully interactive! You can customize your trading strategies completely.

---

## 🎮 How to Use

### 1. **Add Strategies (Max 2)**

Click any trade type button to add it as a strategy:

```
[Even] [Odd] [Matches] [Differs] [Over] [Under] [Rise] [Fall]
```

**What happens:**
- First click → Adds as Strategy #1
- Second click → Adds as Strategy #2
- Maximum 2 strategies allowed
- Active buttons show green highlight

**Example:**
1. Click "Over" → Strategy #1: Over (Stake: 100, Pred: 2)
2. Click "Under" → Strategy #2: Under (Stake: 100, Pred: 7)

### 2. **Edit Stake Amounts**

Each strategy has an editable stake input:

```
#1 — Over    Stake: [100] ← Click to edit    Pred: [2]
```

**How to edit:**
- Click the stake input field
- Type new amount (minimum $0.35)
- Press Enter or click outside

**Example:**
- Change from 100 to 50
- Change from 100 to 250

### 3. **Edit Predictions**

Each strategy has an editable prediction input:

```
#1 — Over    Stake: [100]    Pred: [2] ← Click to edit
```

**How to edit:**
- Click the prediction input field
- Type new digit (0-9)
- Press Enter or click outside

**Example:**
- Change Over prediction from 2 to 5
- Change Under prediction from 7 to 3

### 4. **Remove Strategies**

Each strategy has a remove button (✕):

```
#1 — Over    Stake: [100]    Pred: [2]    [✕] ← Click to remove
```

**What happens:**
- Strategy is removed from list
- Button becomes inactive (no green highlight)
- You can add a different strategy

### 5. **Clear All Strategies**

Click "Clear All" button in the header:

```
Active strategies (switch-on-loss : 1 loss)    [Clear All]
```

**What happens:**
- All strategies removed
- All buttons become inactive
- Start fresh with new strategies

---

## 📊 Strategy Types Explained

### **Digit-Based Strategies:**

**Over/Under:**
- Over 5: Last digit > 5 (6, 7, 8, 9 wins)
- Under 5: Last digit < 5 (0, 1, 2, 3, 4 wins)

**Even/Odd:**
- Even: Last digit is 0, 2, 4, 6, 8
- Odd: Last digit is 1, 3, 5, 7, 9

**Matches/Differs:**
- Matches 5: Last digit = 5
- Differs 5: Last digit ≠ 5

### **Price-Based Strategies:**

**Rise/Fall:**
- Rise: Next tick price > current price
- Fall: Next tick price < current price

---

## 🔄 How Strategy Switching Works

**Setup Example:**
```
#1 — Over 2    Stake: 100
#2 — Under 7   Stake: 100
Switch after: 1 loss
```

**Execution Flow:**
1. Bot starts with Strategy #1 (Over 2)
2. If it **wins** → Continue with Strategy #1
3. If it **loses** → Switch to Strategy #2 (Under 7)
4. If Strategy #2 **wins** → Continue with Strategy #2
5. If Strategy #2 **loses** → Switch back to Strategy #1
6. Repeat...

**Why This Works:**
- Adapts to market conditions
- Reduces consecutive losses
- Diversifies trading approach
- Automatic strategy rotation

---

## 💡 Strategy Combinations

### **Popular Combinations:**

**1. Over/Under Balance:**
```
#1 — Over 5    Stake: 100    Pred: 5
#2 — Under 5   Stake: 100    Pred: 5
```
Covers both sides of the median

**2. Even/Odd Alternation:**
```
#1 — Even    Stake: 100    Pred: 0
#2 — Odd     Stake: 100    Pred: 1
```
Alternates between even and odd digits

**3. Matches/Differs Mix:**
```
#1 — Matches    Stake: 50     Pred: 7
#2 — Differs    Stake: 100    Pred: 7
```
Higher stake on differs (more likely)

**4. Rise/Fall Momentum:**
```
#1 — Rise    Stake: 100    Pred: 0
#2 — Fall    Stake: 100    Pred: 0
```
Follows price momentum

**5. Mixed Strategy:**
```
#1 — Over 3    Stake: 100    Pred: 3
#2 — Even      Stake: 100    Pred: 0
```
Combines different contract types

---

## 🎯 Best Practices

### **Stake Management:**
- Start with equal stakes (100/100)
- Increase winning strategy stake
- Decrease losing strategy stake
- Never risk more than 5% of balance per trade

### **Prediction Selection:**
- **Over/Under**: Use 4-6 for balance
- **Matches**: Use less common digits (0, 9)
- **Differs**: Use common digits (5)
- **Even/Odd**: Prediction doesn't matter

### **Strategy Selection:**
- Test combinations in demo mode first
- Monitor win rates for each strategy
- Switch strategies if win rate < 40%
- Use complementary strategies (Over/Under, Even/Odd)

---

## 🔧 Configuration Tips

### **For Beginners:**
```
#1 — Over 5    Stake: 10    Pred: 5
#2 — Under 5   Stake: 10    Pred: 5
Switch after: 1 loss
```
Simple, balanced, low risk

### **For Aggressive Trading:**
```
#1 — Matches 7    Stake: 50     Pred: 7
#2 — Over 5       Stake: 100    Pred: 5
Switch after: 1 loss
```
Higher stakes, more risk

### **For Conservative Trading:**
```
#1 — Differs 5    Stake: 5     Pred: 5
#2 — Even         Stake: 5     Pred: 0
Switch after: 2 losses
```
Low stakes, more patience

---

## 📈 Monitoring Performance

**Watch These Metrics:**
- Win rate per strategy
- Average profit per strategy
- Switch frequency
- Consecutive losses

**Adjust Based On:**
- If Strategy #1 wins more → Increase its stake
- If switching too often → Change prediction
- If both losing → Try different strategy types
- If one dominates → Consider using it alone

---

## ⚠️ Important Notes

**Limitations:**
- Maximum 2 strategies at a time
- Each strategy type can only be added once
- Predictions must be 0-9
- Stakes must be ≥ $0.35

**Tips:**
- Test in demo mode first
- Start with small stakes
- Monitor for at least 20 trades
- Adjust based on results
- Don't chase losses

---

## 🎉 You're Ready!

The Flipa Switcher is now fully customizable. Create your own strategy combinations, test them, and find what works best for you!

**Quick Start:**
1. Click "Over" button
2. Click "Under" button
3. Edit stakes and predictions
4. Click "Run" to start
5. Monitor and adjust

Happy trading! 🚀
