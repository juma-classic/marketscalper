# Quick Connect to Deriv API 🚀

## Your Signal Trading feature is ready! Just connect your Deriv account.

### Option 1: Quick Test (5 minutes)

1. **Get API Token**

    - Go to https://app.deriv.com
    - Login with demo account
    - Settings → API Token → Create Token
    - Copy the token

2. **Set Token in App**

    - Open browser console (F12)
    - Paste this code:

    ```javascript
    localStorage.setItem('authToken', 'YOUR_TOKEN_HERE');
    location.reload();
    ```

3. **Test Signal Trading**
    - Go to Signals Center (📡)
    - Set stake (e.g., 1 USD)
    - Click "🎯 Trade Now" on any signal
    - Watch it trade!

---

### Option 2: Production Setup (10 minutes)

1. **Register App**

    - Go to https://api.deriv.com/app-registration
    - Register your app
    - Get your `app_id`

2. **Update .env**

    ```env
    DERIV_APP_ID=your_app_id_here
    ```

3. **Restart App**

    ```bash
    npm run dev
    ```

4. **Login via OAuth**
    - App will redirect to Deriv login
    - Login with your account
    - You're connected!

---

## What's Already Working ✅

-   ✅ Deriv API integration
-   ✅ Authentication system
-   ✅ Signal Trading service
-   ✅ Real-time contract monitoring
-   ✅ Profit/loss tracking
-   ✅ Statistics dashboard

## Test It Now!

1. **Start app**: `npm run dev`
2. **Connect**: Use Option 1 above
3. **Trade**: Go to Signals Center → Click "Trade Now"

---

## Need Help?

-   **Full Guide**: See `DERIV_API_CONNECTION_GUIDE.md`
-   **API Docs**: https://api.deriv.com/docs
-   **Get Token**: https://app.deriv.com → Settings → API Token

---

## Safety First! ⚠️

-   Always test with **demo account** first
-   Start with small stakes (0.35 - 1 USD)
-   Monitor your trades
-   Never share your API token

**Your Signal Trading feature is production-ready!**
