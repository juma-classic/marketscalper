# Deriv API Connection Guide 🔌

## Overview

Your Signal Trading feature is already integrated with Deriv API. This guide shows you how to connect and authenticate.

## Current Setup ✅

Your app already has:

-   ✅ Deriv API service configured (`src/services/deriv-api.service.ts`)
-   ✅ API configuration file (`src/config/api-config.ts`)
-   ✅ Authentication wrapper (`src/app/AuthWrapper.tsx`)
-   ✅ Default App ID: `82255`
-   ✅ Signal Trading Service integrated

## Connection Methods

### Method 1: OAuth Login (Recommended for Production)

This is the standard way to connect to Deriv API with real accounts.

#### Step 1: Get Your App ID

1. Go to https://api.deriv.com/app-registration
2. Register your application
3. Get your unique `app_id`

#### Step 2: Update Environment Variables

Edit your `.env` file:

```env
DERIV_APP_ID=YOUR_APP_ID_HERE
DERIV_ENDPOINT=production
```

#### Step 3: Login via OAuth

1. Start your app: `npm run dev`
2. Navigate to: `http://localhost:3000`
3. The app will redirect you to Deriv OAuth login
4. Login with your Deriv account
5. You'll be redirected back with authentication tokens

#### Step 4: Verify Connection

-   Check browser console for: "✅ API initialized"
-   Check localStorage for: `authToken` and `active_loginid`
-   Your balance should appear in the app

---

### Method 2: Direct Token (For Testing)

Use this for quick testing with demo accounts.

#### Step 1: Get API Token

1. Login to https://app.deriv.com
2. Go to Settings → API Token
3. Create a new token with these scopes:
    - ✅ Read
    - ✅ Trade
    - ✅ Payments
    - ✅ Trading Information
    - ✅ Admin

#### Step 2: Set Token in Browser

Open browser console and run:

```javascript
// Set your token
localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
localStorage.setItem('active_loginid', 'YOUR_LOGIN_ID'); // e.g., CR1234567

// Reload the page
location.reload();
```

#### Step 3: Verify Connection

Check console for successful API connection messages.

---

## Testing Signal Trading Feature

### Step 1: Navigate to Signals Center

1. Open your app
2. Go to Signals Center (📡 icon in navigation)
3. Wait for signals to appear

### Step 2: Configure Stake

1. Look for "Default Stake" input in header
2. Set your desired stake (minimum 0.35 USD)
3. Example: `1.00` USD

### Step 3: Execute Trade

1. Find an ACTIVE signal with HIGH confidence
2. Click the "🎯 Trade Now" button
3. Watch status change to "TRADING"
4. Wait for result (WON/LOST)

### Step 4: Monitor Results

-   Check profit/loss displayed on signal card
-   View statistics in header:
    -   Total Trades
    -   Win Rate
    -   Total Profit/Loss

---

## API Endpoints

Your app uses these WebSocket endpoints:

### Production (Default)

```
wss://ws.derivws.com/websockets/v3?app_id=YOUR_APP_ID
```

### Binary (Legacy)

```
wss://ws.binaryws.com/websockets/v3?app_id=YOUR_APP_ID
```

You can switch endpoints in the app's Server Selector component.

---

## Account Types

### Demo Account (Virtual Money)

-   **Purpose**: Testing without risk
-   **Balance**: Virtual $10,000
-   **Login**: Use demo account credentials
-   **Perfect for**: Testing Signal Trading feature

### Real Account (Real Money)

-   **Purpose**: Live trading
-   **Balance**: Your real funds
-   **Login**: Use real account credentials
-   **Warning**: Real money at risk!

---

## Signal Trading API Flow

Here's what happens when you click "Trade Now":

```
1. User clicks "🎯 Trade Now"
   ↓
2. SignalsCenter.tsx → handleTradeSignal()
   ↓
3. signalTradingService.executeSignalTrade()
   ↓
4. Get proposal from Deriv API
   ↓
5. Buy contract via derivAPIService.buyContract()
   ↓
6. Monitor contract via proposal_open_contract
   ↓
7. Update signal status (WON/LOST)
   ↓
8. Display profit/loss
```

---

## Troubleshooting

### Issue: "Not authorized" error

**Solution**:

-   Check if `authToken` exists in localStorage
-   Verify token has correct scopes
-   Try logging in again

### Issue: "Invalid proposal" error

**Solution**:

-   Check if market is open
-   Verify stake amount (min 0.35 USD)
-   Check account balance

### Issue: No signals appearing

**Solution**:

-   Wait 15 seconds for signal generation
-   Check browser console for errors
-   Verify tick data is being received

### Issue: Trade button not working

**Solution**:

-   Ensure you're logged in
-   Check account balance
-   Verify API connection in console

---

## Security Best Practices

### ⚠️ Never Commit Tokens

```bash
# Add to .gitignore
.env
.env.local
```

### ✅ Use Environment Variables

```env
# .env file
DERIV_APP_ID=your_app_id
```

### ✅ Token Scopes

Only request necessary scopes:

-   Read (for market data)
-   Trade (for buying/selling)
-   Trading Information (for portfolio)

### ⚠️ Demo First

Always test with demo account before using real money!

---

## Quick Start Checklist

-   [ ] Get App ID from https://api.deriv.com/app-registration
-   [ ] Update `.env` with your App ID
-   [ ] Start app: `npm run dev`
-   [ ] Login via OAuth or set token manually
-   [ ] Navigate to Signals Center
-   [ ] Set default stake (e.g., 1 USD)
-   [ ] Wait for signals to appear
-   [ ] Click "🎯 Trade Now" on a signal
-   [ ] Monitor trade execution and results

---

## API Documentation

For more details on Deriv API:

-   **API Docs**: https://api.deriv.com/docs
-   **Playground**: https://api.deriv.com/api-explorer
-   **WebSocket**: https://api.deriv.com/docs/websocket
-   **App Registration**: https://api.deriv.com/app-registration

---

## Support

### Deriv API Issues

-   Community: https://community.deriv.com
-   Support: https://deriv.com/contact-us

### App Issues

-   Check browser console for errors
-   Verify API connection status
-   Test with demo account first

---

## Example: Complete Setup

```bash
# 1. Clone/Open project
cd your-project

# 2. Install dependencies
npm install

# 3. Configure environment
echo "DERIV_APP_ID=82255" > .env

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:3000

# 6. Login
# Use OAuth or set token in console

# 7. Test Signal Trading
# Go to Signals Center → Click "Trade Now"
```

---

## Status

✅ **API Integration**: Complete
✅ **Authentication**: Working
✅ **Signal Trading**: Functional
✅ **Real-time Updates**: Active
✅ **Contract Monitoring**: Implemented

**Ready to trade!** Just connect your Deriv account and start using the Signal Trading feature.
