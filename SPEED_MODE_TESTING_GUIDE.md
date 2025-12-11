# 🧪 Speed Mode - Testing & Troubleshooting Guide

## 📋 Pre-Test Checklist

Before clicking "Start Speed Trading", verify:

### 1. Check Browser Console

Press **F12** to open DevTools, then:

```javascript
// Check if token exists
localStorage.getItem('speed_mode_token');
// Should show your token or null

// Check app ID
localStorage.getItem('config.app_id');
// Should show: "82255"

// Check if you're logged into Deriv
localStorage.getItem('client.accounts');
// Should show account data
```

### 2. Verify You're on Bot Builder Tab

-   Speed Mode only shows on the Bot Builder tab
-   Look for the Speed Mode toggle at the top

### 3. Check Network Connection

-   Open DevTools → Network tab
-   Filter by "WS" (WebSocket)
-   Should be ready to capture connections

## 🎯 Step-by-Step Testing

### Test 1: Enable Speed Mode

**Action**: Toggle Speed Mode ON

**Expected**:

-   Toggle switches to ON position
-   Description changes to "Speed Mode Active"
-   Configuration panel appears (or token setup if no token)

**If Nothing Happens**:

```javascript
// Check console for errors
// Look for: "Speed Mode enabled" or similar
```

### Test 2: Token Setup (If Needed)

**If you see Token Setup screen**:

1. **Get your token**:

    - Go to: https://app.deriv.com/account/api-token
    - Create token with scopes: Read, Trade, Payments, Trading information
    - Copy the token

2. **Enter token**:

    - Paste in the input field
    - Click "✅ Set Token"

3. **Verify**:
    ```javascript
    // Check token was saved
    localStorage.getItem('speed_mode_token');
    // Should show your token
    ```

### Test 3: Configure Settings

**Recommended Test Settings**:

-   Market: **R_50** (Volatility 50)
-   Strategy: **Momentum**
-   Trade Type: **DIGITEVEN**
-   Stake: **$0.35** (minimum)
-   Target Runs: **3** (for quick test)
-   Duration: **1 Tick**
-   Stop Loss: **$5**
-   Take Profit: **$10**

**Why these settings?**:

-   Low stake = minimal risk
-   Few runs = quick test
-   R_50 = reliable market

### Test 4: Start Trading

**Action**: Click "🚀 Start Speed Trading"

**Watch Console For**:

```
Expected console output:
✅ Using app config App ID: 82255
🔌 Connecting to Deriv API with App ID: 82255
✅ Deriv Trading API connected
✅ Authorized: {loginid: "...", balance: ..., currency: "USD"}
🔌 Connecting tick stream with App ID: 82255
✅ Speed Trading WebSocket connected
```

**Watch UI For**:

1. Button text changes to "⏳ Connecting..."
2. Status dot turns orange
3. Then button changes to "🛑 Stop Trading"
4. Status dot turns green
5. Current tick starts updating

### Test 5: Monitor First Trade

**What to Watch**:

1. **Current Tick Updates** (every 1-2 seconds):

    ```
    Current Tick: 123.45 | Digit: 5
    ```

2. **Console Shows Trade Execution**:

    ```
    🚀 Executing trade: {market: "R_50", tradeType: "DIGITEVEN", ...}
    ✅ Trade win: Profit 0.95
    ```

3. **Stats Update**:

    ```
    Runs: 1
    Wins: 1 (or Losses: 1)
    Profit: $0.95 (or -$0.35)
    ```

4. **Last Trade Card Appears**:

    - Shows contract details
    - Green for win, red for loss

5. **Toast Notification**:
    - Pops up in top-right
    - "✅ Won $0.95" or "❌ Lost $0.35"

## 🚨 Common Issues & Solutions

### Issue 1: "No auth token available"

**Symptoms**: Token setup screen appears

**Solution**:

1. Click "Enable Speed Mode"
2. Enter your API token
3. Click "✅ Set Token"
4. Try again

**Verify Fix**:

```javascript
localStorage.getItem('speed_mode_token');
// Should show your token
```

### Issue 2: Button Does Nothing

**Symptoms**: Click button, nothing happens

**Debug Steps**:

1. **Check Console**:

    ```javascript
    // Look for errors in red
    // Common: "Not connected to Deriv API"
    ```

2. **Check Token**:

    ```javascript
    localStorage.getItem('speed_mode_token');
    // If null, need to set token
    ```

3. **Check Network Tab**:
    - Filter: WS
    - Should see WebSocket connection attempt
    - If red/failed, check internet connection

**Solution**:

```javascript
// Clear and reset
localStorage.removeItem('speed_mode_token');
localStorage.removeItem('speed_mode_app_id');
// Refresh page and set token again
```

### Issue 3: "Authorization failed"

**Symptoms**: Error banner appears

**Possible Causes**:

-   Invalid token
-   Token doesn't have required scopes
-   Token expired or revoked

**Solution**:

1. Go to: https://app.deriv.com/account/api-token
2. Delete old token
3. Create new token with ALL scopes:
    - ✅ Read
    - ✅ Trade
    - ✅ Payments
    - ✅ Trading information
4. Copy new token
5. Click "🔑 Change Token" in Speed Mode
6. Enter new token

### Issue 4: Ticks Not Updating

**Symptoms**: Status shows "Running" but no tick updates

**Debug**:

```javascript
// Check WebSocket in Network tab
// Should see messages flowing
// Look for: {"tick": {...}}
```

**Solution**:

1. Click "🛑 Stop Trading"
2. Wait 5 seconds
3. Click "🚀 Start Speed Trading" again

### Issue 5: Trades Not Executing

**Symptoms**: Ticks update but no trades happen

**Check Console For**:

```
Error processing trade: ...
Trade failed: ...
```

**Common Causes**:

-   Insufficient balance
-   Market closed
-   Invalid contract parameters

**Solution**:

1. Check account balance
2. Try different market (R_10, R_25)
3. Reduce stake amount
4. Check if using demo account

### Issue 6: "Insufficient balance"

**Symptoms**: Error message about balance

**Solution**:

1. Check your account balance
2. Reduce stake amount to $0.35
3. Or top up your account
4. Make sure you're on the right account (demo vs real)

## 🔍 Advanced Debugging

### Check WebSocket Connection

**In Network Tab**:

1. Filter: WS
2. Click on WebSocket connection
3. Go to "Messages" tab
4. Should see:

    ```json
    // Outgoing
    {"ticks": "R_50", "subscribe": 1}

    // Incoming
    {"tick": {"epoch": ..., "quote": ...}}
    ```

### Check API Requests

**In Console**:

```javascript
// Enable verbose logging
localStorage.setItem('debug_speed_mode', 'true');

// Refresh page and try again
// Should see detailed logs
```

### Manual Token Test

**Test if token works**:

```javascript
// Open console
const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=82255');

ws.onopen = () => {
    console.log('Connected');
    ws.send(
        JSON.stringify({
            authorize: 'YOUR_TOKEN_HERE',
        })
    );
};

ws.onmessage = event => {
    console.log('Response:', JSON.parse(event.data));
};

// Should see authorization response
```

## 📊 Expected Test Results

### Successful Test Run

**After 3 trades, you should see**:

```
Stats:
- Runs: 3
- Wins: 1-3 (varies)
- Losses: 0-2 (varies)
- Profit: -$1.05 to +$2.85 (varies)

Status: Stopped (auto-stopped after 3 runs)
Message: "Target runs reached"
```

### Console Output Example

```
✅ Using app config App ID: 82255
🔌 Connecting to Deriv API with App ID: 82255
✅ Deriv Trading API connected
✅ Authorized: {loginid: "CR123456", balance: 10000, currency: "USD"}
🔌 Connecting tick stream with App ID: 82255
✅ Speed Trading WebSocket connected

🚀 Executing trade: {market: "R_50", tradeType: "DIGITEVEN", stake: 0.35}
✅ Trade win: Profit 0.95

🚀 Executing trade: {market: "R_50", tradeType: "DIGITEVEN", stake: 0.35}
❌ Trade loss: Profit -0.35

🚀 Executing trade: {market: "R_50", tradeType: "DIGITEVEN", stake: 0.35}
✅ Trade win: Profit 0.95

Target runs reached - stopping trading
```

## 🎯 Quick Diagnostic Commands

**Run these in console to check status**:

```javascript
// 1. Check if Speed Mode is enabled
document.querySelector('.speed-mode-toggle')?.classList.contains('active');

// 2. Check token
localStorage.getItem('speed_mode_token') ? 'Token exists' : 'No token';

// 3. Check app ID
localStorage.getItem('config.app_id') || 'Not set';

// 4. Check if logged into Deriv
localStorage.getItem('active_loginid') || 'Not logged in';

// 5. Check account balance
localStorage.getItem('client.accounts') ? 'Has accounts' : 'No accounts';

// 6. Force reconnect
location.reload();
```

## 📞 Still Having Issues?

### Collect Debug Info

```javascript
// Copy this output and share it
console.log({
    hasToken: !!localStorage.getItem('speed_mode_token'),
    appId: localStorage.getItem('config.app_id'),
    hasAccounts: !!localStorage.getItem('client.accounts'),
    activeLoginId: localStorage.getItem('active_loginid'),
    browser: navigator.userAgent,
    timestamp: new Date().toISOString(),
});
```

### Reset Everything

```javascript
// Nuclear option - reset all Speed Mode data
localStorage.removeItem('speed_mode_token');
localStorage.removeItem('speed_mode_app_id');
location.reload();
// Then set up token again
```

## ✅ Success Indicators

You know it's working when:

1. ✅ Button changes to "Stop Trading"
2. ✅ Green dot shows "Running"
3. ✅ Ticks update every 1-2 seconds
4. ✅ Stats increment after each trade
5. ✅ Toast notifications appear
6. ✅ Last trade card shows results
7. ✅ Console shows trade execution logs
8. ✅ Auto-stops after target runs

---

## 🎉 Ready to Test!

Follow the steps above and let me know:

1. What step you're on
2. What you see in the console
3. Any error messages
4. Screenshots if helpful

I'll help you troubleshoot any issues!
