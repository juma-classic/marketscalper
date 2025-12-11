# 🆔 Using Your Own Deriv App ID

## Overview

Speed Mode now supports using your **own Deriv App ID** instead of the default one. This gives you full control over your API integration.

## 🎯 Why Use Your Own App ID?

✅ **Full Control**: Your own app registration  
✅ **Better Tracking**: See all API calls in your dashboard  
✅ **Custom Branding**: Use your app name  
✅ **Rate Limits**: Separate from shared app ID  
✅ **Analytics**: Track your app's usage

## 📋 How to Get Your App ID

### Step 1: Register Your App

1. **Go to Deriv App Registration**

    - Visit: https://api.deriv.com/app-registration
    - Login with your Deriv account

2. **Register New App**

    - Click **"Register new app"**
    - Fill in the details:

    ```
    App Name: Speed Mode Trading
    Redirect URL: https://your-domain.com (or http://localhost:3000 for testing)
    Verification URL: (optional)
    ```

3. **Submit Registration**

    - Click **"Register application"**
    - Your App ID will be generated

4. **Copy Your App ID**
    - You'll see something like: `12345`
    - Copy this number

### Step 2: Get Your API Token

1. **Go to API Token Page**

    - Visit: https://app.deriv.com/account/api-token

2. **Create Token for Your App**
    - Click **"Create new token"**
    - Name: `Speed Mode Trading`
    - **Important**: Select your app from the dropdown
    - Enable scopes: Read, Trade, Payments, Trading information
    - Click **"Create"**
    - Copy the token

### Step 3: Set in Speed Mode

1. **Enable Speed Mode**

    - Go to Bot Builder tab
    - Toggle Speed Mode ON

2. **Token Setup Screen**
    - Paste your API token
    - ✅ Check **"Use custom App ID"**
    - Enter your App ID
    - Click **"✅ Set Token"**

## 🔧 Configuration

### Using Custom App ID

```
┌─────────────────────────────────────┐
│ Deriv API Token                     │
│ [your-token-here]                   │
│                                     │
│ ✅ Use custom App ID (optional)    │
│                                     │
│ Your App ID                         │
│ [12345]                             │
│                                     │
│ [✅ Set Token] [Cancel]            │
└─────────────────────────────────────┘
```

### Using Default App ID

If you don't check the box, Speed Mode uses the default App ID (82255).

## 💾 Storage

Your App ID is stored in:

-   `localStorage.speed_mode_app_id`
-   Persists across sessions
-   Can be changed anytime

## 🔄 Changing App ID

### Method 1: Through UI

1. Click **"🔑 Change Token"** in Speed Mode
2. Check **"Use custom App ID"**
3. Enter new App ID
4. Click **"✅ Set Token"**

### Method 2: Via Console (Advanced)

```javascript
// Set custom app ID
localStorage.setItem('speed_mode_app_id', '12345');

// Remove custom app ID (use default)
localStorage.removeItem('speed_mode_app_id');

// Check current app ID
console.log(localStorage.getItem('speed_mode_app_id'));
```

## 🔍 Verification

### Check Your App ID

1. Open browser console (F12)
2. Look for connection messages:
    ```
    🔌 Connecting to Deriv API with App ID: 12345
    ✅ Deriv Trading API connected
    ```

### Verify in Network Tab

1. Open DevTools → Network tab
2. Filter: WS (WebSocket)
3. Look for connection URL:
    ```
    wss://ws.binaryws.com/websockets/v3?app_id=12345
    ```

## 🎯 Use Cases

### Development & Testing

```
App ID: Your test app ID
Token: Demo account token
Purpose: Safe testing environment
```

### Production Trading

```
App ID: Your production app ID
Token: Real account token
Purpose: Live trading
```

### Multiple Environments

```
Dev:  App ID 11111 + Demo token
Prod: App ID 22222 + Real token
```

## 🔐 Security Best Practices

### DO ✅

-   ✅ Create separate apps for dev/prod
-   ✅ Use demo tokens for testing
-   ✅ Register apps with correct URLs
-   ✅ Monitor app usage in Deriv dashboard
-   ✅ Revoke unused tokens

### DON'T ❌

-   ❌ Share your App ID publicly
-   ❌ Use production app for testing
-   ❌ Mix dev and prod tokens
-   ❌ Forget to update redirect URLs
-   ❌ Leave test apps active

## 📊 Monitoring Your App

### Deriv Dashboard

1. Go to: https://api.deriv.com/app-registration
2. View your registered apps
3. See API call statistics
4. Monitor usage patterns
5. Check error rates

### What You Can Track

-   Total API calls
-   Active connections
-   Error rates
-   Token usage
-   Geographic distribution

## 🐛 Troubleshooting

### "Invalid app_id"

**Cause**: App ID doesn't exist or is incorrect

**Solutions**:

1. Verify App ID in Deriv dashboard
2. Check for typos
3. Ensure app is active
4. Try creating new app

### "Token not valid for this app"

**Cause**: Token created for different app

**Solutions**:

1. Create new token
2. Select correct app in dropdown
3. Ensure app ID matches

### Connection Fails

**Cause**: App ID or token issues

**Solutions**:

1. Check console for errors
2. Verify App ID is correct
3. Ensure token has required scopes
4. Try default App ID first

### Rate Limiting

**Cause**: Too many requests

**Solutions**:

1. Check app usage in dashboard
2. Implement request throttling
3. Use separate app for testing
4. Contact Deriv support

## 🎓 Advanced Configuration

### Environment Variables

You can also set app ID via environment:

```bash
# .env file
DERIV_APP_ID=12345
```

### Programmatic Setup

```typescript
import { derivAPI } from './utils/deriv-trading-api';

// Set app ID programmatically
derivAPI.setAppId('12345');

// Get current app ID
const currentAppId = derivAPI.getAppId();
console.log('Using App ID:', currentAppId);
```

### Multiple App IDs

For different features:

```typescript
// Speed Mode
localStorage.setItem('speed_mode_app_id', '11111');

// Other features can use different app IDs
localStorage.setItem('bot_builder_app_id', '22222');
```

## 📱 Mobile Considerations

The same process works on mobile:

1. Register app with mobile redirect URL
2. Create token on mobile
3. Set in Speed Mode
4. Trade on mobile

## ✅ Quick Checklist

Before using custom App ID:

-   [ ] App registered on Deriv
-   [ ] App ID copied
-   [ ] Token created for your app
-   [ ] Token has all required scopes
-   [ ] App ID entered in Speed Mode
-   [ ] Connection successful
-   [ ] Verified in console/network tab
-   [ ] Tested with demo account

## 🎉 Benefits of Custom App ID

### For Developers

-   Better debugging
-   Separate environments
-   Usage analytics
-   Custom branding

### For Traders

-   Personal tracking
-   Better control
-   Isolated rate limits
-   Professional setup

## 📞 Support

### Need Help?

1. **Deriv API Docs**: https://api.deriv.com
2. **App Registration**: https://api.deriv.com/app-registration
3. **API Playground**: https://api.deriv.com/api-explorer
4. **Community**: Deriv forums and support

### Common Questions

**Q: Is custom App ID required?**
A: No, you can use the default. Custom is optional.

**Q: Can I change App ID later?**
A: Yes, anytime through the UI or console.

**Q: Does it cost anything?**
A: No, app registration is free.

**Q: Can I have multiple apps?**
A: Yes, create as many as you need.

**Q: What if I lose my App ID?**
A: Check your Deriv dashboard app registration page.

---

## 🚀 You're All Set!

With your custom App ID, you have full control over your Speed Mode integration. Happy trading!

---

## 📚 Related Documentation

-   **Token Setup**: `SPEED_MODE_TOKEN_SETUP_GUIDE.md`
-   **Quick Start**: `SPEED_MODE_QUICK_START.md`
-   **User Guide**: `SPEED_MODE_REAL_TRADING_GUIDE.md`
