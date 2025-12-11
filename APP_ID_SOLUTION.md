# ✅ Custom App ID Support Added!

## 🎯 Problem Solved

You mentioned you're using your own App ID instead of the default. Speed Mode now fully supports custom App IDs!

## 🆕 What's New

### 1. Custom App ID Input

-   ✅ Optional checkbox in TokenSetup
-   ✅ Input field for your App ID
-   ✅ Stored in localStorage
-   ✅ Used for all API connections

### 2. Enhanced API Integration

**New Methods in `deriv-trading-api.ts`:**

```typescript
setAuthToken(token: string, appId?: string): void
getAppId(): string
setAppId(appId: string): void
```

### 3. Automatic App ID Management

-   ✅ Stored in `localStorage.speed_mode_app_id`
-   ✅ Persists across sessions
-   ✅ Falls back to default if not set
-   ✅ Used for both trading and tick streams

## 🚀 How to Use Your App ID

### Quick Setup

1. **Enable Speed Mode**
2. **Token Setup Screen appears**
3. **Enter your token**
4. **✅ Check "Use custom App ID"**
5. **Enter your App ID** (e.g., 12345)
6. **Click "✅ Set Token"**

### Visual

```
┌─────────────────────────────────────┐
│ 🔑 API Token Required               │
│                                     │
│ Deriv API Token                     │
│ [paste-your-token-here]             │
│                                     │
│ ✅ Use custom App ID (optional)    │
│                                     │
│ Your App ID                         │
│ [12345]                             │
│                                     │
│ Get your App ID from:               │
│ api.deriv.com/app-registration      │
│                                     │
│ [✅ Set Token] [Cancel]            │
└─────────────────────────────────────┘
```

## 🔧 Technical Details

### Storage

```javascript
// Your App ID is stored here
localStorage.setItem('speed_mode_app_id', '12345');

// Check current App ID
console.log(derivAPI.getAppId()); // "12345"
```

### WebSocket Connection

```javascript
// Before (hardcoded)
wss://ws.binaryws.com/websockets/v3?app_id=82255

// After (your App ID)
wss://ws.binaryws.com/websockets/v3?app_id=12345
```

### Console Output

```
🔌 Connecting to Deriv API with App ID: 12345
✅ Deriv Trading API connected
✅ App ID set to: 12345
```

## 📦 Files Modified

1. ✅ `src/utils/deriv-trading-api.ts`

    - Added `appId` property
    - Added `getStoredAppId()` method
    - Added `setAppId()` method
    - Updated `setAuthToken()` to accept appId
    - Updated `connect()` to use custom appId

2. ✅ `src/components/speed-mode/TokenSetup.tsx`

    - Added App ID checkbox
    - Added App ID input field
    - Updated form submission
    - Added link to app registration

3. ✅ `src/components/speed-mode/TokenSetup.scss`

    - Added checkbox styling
    - Added link styling

4. ✅ `src/components/speed-mode/SpeedModeOverlay.tsx`

    - Updated `handleTokenSet` to accept appId
    - Passes appId to derivAPI

5. ✅ `src/components/speed-mode/SpeedTradingEngine.tsx`
    - Updated WebSocket connection to use custom appId
    - Gets appId from derivAPI

## 🎯 Use Cases

### Default App ID (No Setup Needed)

```
✅ Just enter token
✅ Uses default App ID: 82255
✅ Works immediately
```

### Your Own App ID

```
✅ Enter token
✅ Check "Use custom App ID"
✅ Enter your App ID
✅ Full control over API integration
```

## 🔍 Verification

### Check in Console

```javascript
// Open browser console (F12)
derivAPI.getAppId();
// Output: "12345" (your App ID)
```

### Check in Network Tab

1. Open DevTools → Network
2. Filter: WS
3. Look for WebSocket URL
4. Should show: `?app_id=12345`

## 💡 Benefits

### Using Your Own App ID

✅ **Full Control**: Your own app registration  
✅ **Better Tracking**: See API calls in dashboard  
✅ **Custom Branding**: Your app name  
✅ **Separate Limits**: Independent rate limits  
✅ **Analytics**: Track usage patterns

### Using Default App ID

✅ **Quick Start**: No registration needed  
✅ **Simple Setup**: Just token required  
✅ **Shared Resources**: Works immediately

## 📚 Documentation

Created comprehensive guides:

1. **`CUSTOM_APP_ID_GUIDE.md`**

    - How to register your app
    - How to get App ID
    - How to use in Speed Mode
    - Troubleshooting
    - Best practices

2. **`APP_ID_SOLUTION.md`** (this file)
    - Quick reference
    - Technical details
    - Setup instructions

## 🎉 Ready to Use!

Speed Mode now supports both:

-   ✅ Default App ID (82255) - No setup needed
-   ✅ Your Custom App ID - Full control

Choose what works best for you!

---

## 🚀 Quick Start

### With Default App ID

1. Enable Speed Mode
2. Enter token
3. Start trading

### With Your App ID

1. Register app at: https://api.deriv.com/app-registration
2. Enable Speed Mode
3. Enter token
4. Check "Use custom App ID"
5. Enter your App ID
6. Start trading

---

## 📞 Need Help?

-   **App Registration**: https://api.deriv.com/app-registration
-   **Full Guide**: `CUSTOM_APP_ID_GUIDE.md`
-   **Token Setup**: `SPEED_MODE_TOKEN_SETUP_GUIDE.md`
