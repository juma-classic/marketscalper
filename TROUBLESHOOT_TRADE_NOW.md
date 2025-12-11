# Troubleshoot Trade Now Button 🔧

## Quick Diagnosis

Open your browser console (F12) and run this diagnostic script:

```javascript
// === TRADE NOW DIAGNOSTIC TOOL ===
console.log('=== TRADE NOW DIAGNOSTIC ===\n');

// 1. Check Authentication
const authToken = localStorage.getItem('authToken');
const loginId = localStorage.getItem('active_loginid');
console.log('1. AUTHENTICATION:');
console.log('   Token:', authToken ? '✅ Present' : '❌ Missing');
console.log('   Login ID:', loginId || '❌ Missing');

// 2. Check API Connection
console.log('\n2. API CONNECTION:');
if (window.api_base?.api) {
    console.log('   API Object: ✅ Connected');
    console.log('   API Ready:', window.api_base.api.readyState === 1 ? '✅ Yes' : '❌ No');
} else {
    console.log('   API Object: ❌ Not found');
}

// 3. Test Balance (requires auth)
if (authToken && window.api_base?.api) {
    console.log('\n3. TESTING BALANCE:');
    window.api_base.api
        .send({ balance: 1 })
        .then(r => {
            if (r.balance) {
                console.log('   Balance: ✅', r.balance.balance, r.balance.currency);
            } else {
                console.log('   Balance: ❌ Error:', r.error?.message);
            }
        })
        .catch(e => {
            console.log('   Balance: ❌ Failed:', e.message);
        });
}

// 4. Test Proposal (requires auth)
if (authToken && window.api_base?.api) {
    console.log('\n4. TESTING PROPOSAL:');
    window.api_base.api
        .send({
            proposal: 1,
            amount: 1,
            basis: 'stake',
            contract_type: 'CALL',
            currency: 'USD',
            duration: 5,
            duration_unit: 't',
            symbol: 'R_50',
        })
        .then(r => {
            if (r.proposal) {
                console.log('   Proposal: ✅ Working');
                console.log('   Payout:', r.proposal.payout);
            } else {
                console.log('   Proposal: ❌ Error:', r.error?.message);
            }
        })
        .catch(e => {
            console.log('   Proposal: ❌ Failed:', e.message);
        });
}

// 5. Check Signal Trading Service
console.log('\n5. SIGNAL TRADING SERVICE:');
if (window.signalTradingService) {
    console.log('   Service: ✅ Loaded');
} else {
    console.log('   Service: ❌ Not found');
}

console.log('\n=== END DIAGNOSTIC ===');
```

## Common Issues & Solutions

### Issue 1: Button Not Visible

**Symptoms**: Can't see "Trade Now" button on signals

**Causes**:

-   Signal status is not "ACTIVE"
-   Signal is already trading
-   Button CSS not loading

**Solution**:

```javascript
// Check signal status
console.log('Signals:', document.querySelectorAll('.signal-card').length);
console.log('Active signals:', document.querySelectorAll('.signal-card.active').length);
console.log('Trade buttons:', document.querySelectorAll('.trade-now-btn').length);
```

### Issue 2: Button Doesn't Respond

**Symptoms**: Button visible but nothing happens when clicked

**Causes**:

-   Not authenticated
-   API not connected
-   JavaScript error

**Solution**:

```javascript
// Check for errors
console.log('Check console for errors above');

// Manually test the function
const testSignal = {
    id: 'test-123',
    market: 'R_50',
    type: 'RISE',
    duration: '5 ticks',
    entryDigit: undefined,
};

// This should trigger the trade
console.log('Testing trade execution...');
```

### Issue 3: "Failed to get proposal" Error

**Symptoms**: Button changes to "Trading..." then back to "Trade Now"

**Causes**:

-   Not authenticated
-   Invalid market
-   Market closed
-   Insufficient balance

**Solution**:

```javascript
// Test proposal manually
api_base.api
    .send({
        proposal: 1,
        amount: 1,
        basis: 'stake',
        contract_type: 'CALL',
        currency: 'USD',
        duration: 5,
        duration_unit: 't',
        symbol: 'R_50',
    })
    .then(r => console.log('Proposal result:', r));
```

### Issue 4: "Failed to buy contract" Error

**Symptoms**: Proposal works but contract doesn't buy

**Causes**:

-   Insufficient balance
-   Proposal expired
-   Market conditions changed

**Solution**:

```javascript
// Check balance
api_base.api.send({ balance: 1 }).then(r => {
    console.log('Your balance:', r.balance.balance, r.balance.currency);
    console.log('Minimum stake: 0.35 USD');
});
```

### Issue 5: Not Authenticated

**Symptoms**: Console shows "Token: ❌ Missing"

**Solution A - Get Token from Deriv**:

1. Go to https://app.deriv.com
2. Login with demo account
3. Settings → API Token
4. Create token with these scopes:
    - ✅ Read
    - ✅ Trade
    - ✅ Trading Information
5. Copy token
6. Run in console:

```javascript
localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
localStorage.setItem('active_loginid', 'VRTC12345'); // Your account ID
location.reload();
```

**Solution B - Use OAuth**:

1. Clear localStorage:

```javascript
localStorage.clear();
location.reload();
```

2. App will redirect to Deriv login
3. Login and authorize
4. You'll be redirected back (authenticated)

### Issue 6: API Not Connected

**Symptoms**: Console shows "API Object: ❌ Not found"

**Solution**:

```javascript
// Check if API is initializing
console.log('Waiting for API...');
setTimeout(() => {
    if (window.api_base?.api) {
        console.log('✅ API connected!');
    } else {
        console.log('❌ API still not connected. Check network tab for WebSocket errors.');
    }
}, 5000);
```

## Step-by-Step Fix

### Step 1: Verify App is Running

```bash
npm run dev
```

Visit http://localhost:3000

### Step 2: Open Browser Console

Press F12 → Console tab

### Step 3: Run Diagnostic

Paste the diagnostic script from top of this file

### Step 4: Fix Issues Based on Results

**If "Token: ❌ Missing"**:

-   Follow "Issue 5" solution above

**If "API Object: ❌ Not found"**:

-   Wait 5 seconds and check again
-   Check Network tab for WebSocket errors
-   Verify App ID in .env: `DERIV_APP_ID=82255`

**If "Balance: ❌ Error"**:

-   Token might be invalid
-   Get new token from Deriv
-   Or use OAuth login

**If "Proposal: ❌ Error"**:

-   Check error message
-   Verify market is open
-   Check balance is sufficient

### Step 5: Test Trade Now

1. Go to Signals Center
2. Wait for signals to appear
3. Find ACTIVE signal
4. Set stake (e.g., 1 USD)
5. Click "🎯 Trade Now"
6. Watch console for logs

## Expected Console Output (Success)

```
=== TRADE NOW DIAGNOSTIC ===

1. AUTHENTICATION:
   Token: ✅ Present
   Login ID: VRTC12345

2. API CONNECTION:
   API Object: ✅ Connected
   API Ready: ✅ Yes

3. TESTING BALANCE:
   Balance: ✅ 10000 USD

4. TESTING PROPOSAL:
   Proposal: ✅ Working
   Payout: 1.95

5. SIGNAL TRADING SERVICE:
   Service: ✅ Loaded

=== END DIAGNOSTIC ===

// When you click Trade Now:
✅ Signal trade executed: {contractId: 123456, ...}
Monitoring contract...
✅ Signal Trade Won Profit: 0.95
```

## Still Not Working?

### Check These:

1. **Browser Console Errors**

    - Look for red error messages
    - Share them for specific help

2. **Network Tab**

    - Check for failed WebSocket connections
    - Look for 401 Unauthorized errors

3. **App ID**

    - Verify in .env: `DERIV_APP_ID=82255`
    - Restart dev server after changing

4. **Token Validity**

    - Tokens can expire
    - Get fresh token from Deriv
    - Or use OAuth login

5. **Market Status**
    - Some markets close on weekends
    - Try different market (R_50, R_100)

## Quick Test Script

Run this to test everything at once:

```javascript
// Complete test
(async () => {
    console.log('🔍 Testing Trade Now...\n');

    // 1. Auth check
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.log('❌ Not authenticated. Run:');
        console.log('localStorage.setItem("authToken", "YOUR_TOKEN");');
        console.log('location.reload();');
        return;
    }
    console.log('✅ Authenticated');

    // 2. API check
    if (!window.api_base?.api) {
        console.log('❌ API not connected. Wait 5 seconds and try again.');
        return;
    }
    console.log('✅ API connected');

    // 3. Balance check
    try {
        const balance = await window.api_base.api.send({ balance: 1 });
        console.log('✅ Balance:', balance.balance.balance, balance.balance.currency);
    } catch (e) {
        console.log('❌ Balance check failed:', e.message);
        return;
    }

    // 4. Proposal check
    try {
        const proposal = await window.api_base.api.send({
            proposal: 1,
            amount: 1,
            basis: 'stake',
            contract_type: 'CALL',
            currency: 'USD',
            duration: 5,
            duration_unit: 't',
            symbol: 'R_50',
        });
        console.log('✅ Proposal works. Payout:', proposal.proposal.payout);
    } catch (e) {
        console.log('❌ Proposal failed:', e.message);
        return;
    }

    console.log('\n✅ Everything working! Trade Now should work.');
    console.log('Go to Signals Center and click "Trade Now"');
})();
```

## Get Help

If still not working, share:

1. Console output from diagnostic script
2. Any error messages (red text in console)
3. Network tab WebSocket status
4. Screenshot of Signals Center

The issue is likely authentication or API connection, not the Trade Now code itself.
