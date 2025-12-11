# ⚡ Speed Mode - Quick Troubleshoot

## 🚀 Quick Start (30 seconds)

1. **Open Bot Builder tab**
2. **Toggle Speed Mode ON**
3. **If token setup appears**: Paste token → Click "Set Token"
4. **Configure**: Stake $0.35, Target 3 runs
5. **Click**: "🚀 Start Speed Trading"

## 🔍 Quick Diagnostic

**Copy/paste into browser console (F12)**:

```javascript
// Quick check
console.log({
    token: !!localStorage.getItem('speed_mode_token'),
    appId: localStorage.getItem('config.app_id'),
    loggedIn: !!localStorage.getItem('active_loginid'),
    online: navigator.onLine,
});
```

**Or run full diagnostic**:

-   Copy contents of `speed-mode-diagnostic.js`
-   Paste in console
-   Press Enter

## ❌ Common Issues (1-minute fixes)

### "No auth token available"

```javascript
// Fix:
// 1. Get token: https://app.deriv.com/account/api-token
// 2. Enable Speed Mode
// 3. Paste token
// 4. Click "Set Token"
```

### Button does nothing

```javascript
// Fix:
localStorage.removeItem('speed_mode_token');
location.reload();
// Then set token again
```

### "Authorization failed"

```javascript
// Fix: Create new token with ALL scopes
// https://app.deriv.com/account/api-token
// ✅ Read, Trade, Payments, Trading information
```

### Ticks not updating

```javascript
// Fix:
// 1. Stop trading
// 2. Wait 5 seconds
// 3. Start again
```

### No trades executing

```javascript
// Check:
console.log('Balance:', localStorage.getItem('client.accounts'));
// If low balance, reduce stake to $0.35
```

## 📊 What Should Happen

### When you click "Start Speed Trading":

**0-3 seconds**: Button → "⏳ Connecting..."  
**3-5 seconds**: Status → 🟢 Running  
**5-10 seconds**: First tick appears  
**10-20 seconds**: First trade executes  
**20-30 seconds**: Trade result shows

### Console should show:

```
✅ Using app config App ID: 82255
🔌 Connecting to Deriv API with App ID: 82255
✅ Deriv Trading API connected
✅ Authorized: {loginid: "...", balance: ...}
🚀 Executing trade: {...}
✅ Trade win: Profit 0.95
```

## 🆘 Still Stuck?

### 1. Run Diagnostic

```bash
# Open: speed-mode-diagnostic.js
# Copy all code
# Paste in console (F12)
# Read the output
```

### 2. Check Full Guide

```bash
# Open: SPEED_MODE_TESTING_GUIDE.md
# Follow step-by-step instructions
```

### 3. Reset Everything

```javascript
// Nuclear option
localStorage.removeItem('speed_mode_token');
localStorage.removeItem('speed_mode_app_id');
location.reload();
// Start fresh
```

## ✅ Success Checklist

-   [ ] On Bot Builder tab
-   [ ] Speed Mode toggle ON
-   [ ] Token set (check console)
-   [ ] Logged into Deriv
-   [ ] Internet connected
-   [ ] Console shows no errors
-   [ ] Button clickable

## 📞 Share This If Asking for Help

```javascript
// Copy this output
console.log(
    JSON.stringify(
        {
            hasToken: !!localStorage.getItem('speed_mode_token'),
            appId: localStorage.getItem('config.app_id'),
            loginId: localStorage.getItem('active_loginid'),
            browser: navigator.userAgent.split(' ').pop(),
            timestamp: new Date().toISOString(),
        },
        null,
        2
    )
);
```

---

**Most Common Fix**: Just refresh the page and set token again! 🔄
