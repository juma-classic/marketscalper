# Production Setup for Public Trading Site 🌐

## Overview

Your site is ready for public use! Users will login with their own Deriv accounts via OAuth.

## Setup Steps

### 1. Register Your Production App

1. Go to https://api.deriv.com/app-registration
2. Click "Register Application"
3. Fill in details:

    - **App Name**: TradersDen (or your preferred name)
    - **Redirect URL**: `https://yourdomain.com` (your production URL)
    - **Verification URL**: `https://yourdomain.com/redirect` (optional)
    - **App Markup Percentage**: 0 (unless you want commission)
    - **Scopes**: Select all needed:
        - ✅ Read
        - ✅ Trade
        - ✅ Payments
        - ✅ Trading Information
        - ✅ Admin (optional)

4. Submit and get your **Production App ID**

### 2. Update Environment Variables

Update your `.env` file with the production App ID:

```env
# Production Deriv API Configuration
DERIV_APP_ID=YOUR_PRODUCTION_APP_ID_HERE
DERIV_ENDPOINT=production
```

### 3. Deploy to Production

```bash
# Build for production
npm run build

# Deploy to your hosting (Vercel, Netlify, etc.)
# The build output will be in 'dist' folder
```

### 4. Configure OAuth Redirect

Your app already handles OAuth! The flow is:

```
User visits site
    ↓
Not authenticated
    ↓
Redirect to: https://oauth.deriv.com/oauth2/authorize?app_id=YOUR_APP_ID
    ↓
User logs in with Deriv account
    ↓
Deriv redirects back: https://yourdomain.com?acct1=CR123&token1=abc123&cur1=USD
    ↓
AuthWrapper.tsx extracts tokens
    ↓
User is authenticated and can trade!
```

## How It Works for Users

### User Experience

1. **Visit Your Site**

    ```
    https://yourdomain.com
    ```

2. **Automatic Redirect**

    - App detects no authentication
    - Redirects to Deriv OAuth login
    - User sees Deriv's official login page

3. **Login with Deriv**

    - User enters their Deriv credentials
    - Deriv validates and authorizes
    - User approves app permissions

4. **Return to Your Site**

    - Deriv redirects back with tokens
    - AuthWrapper stores tokens in localStorage
    - User is now authenticated

5. **Use Trade Now**
    - Go to Signals Center
    - Click "🎯 Trade Now"
    - Trades execute on their account
    - Their balance updates

### Security

✅ **No Token Sharing**: Each user uses their own Deriv account
✅ **OAuth Standard**: Industry-standard authentication
✅ **Secure Tokens**: Tokens stored in user's browser only
✅ **No Backend Needed**: Direct Deriv API connection
✅ **User Control**: Users can revoke access anytime

## Testing Before Production

### Test with Demo Accounts

1. Use test App ID: `82255` (already configured)
2. Deploy to staging URL
3. Test OAuth flow with demo accounts
4. Verify Trade Now works correctly

### Test Checklist

-   [ ] OAuth redirect works
-   [ ] User can login with demo account
-   [ ] Balance displays correctly
-   [ ] Trade Now executes trades
-   [ ] Profit/loss updates
-   [ ] Statistics track correctly
-   [ ] User can logout
-   [ ] Multiple users can use site simultaneously

## Production Deployment

### Recommended Hosting

**Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**GitHub Pages**

```bash
# Build
npm run build

# Deploy dist folder to gh-pages branch
```

### Environment Variables on Hosting

Set these in your hosting platform:

```env
DERIV_APP_ID=your_production_app_id
DERIV_ENDPOINT=production
```

## OAuth Configuration

### Redirect URLs to Register

When registering your app, add these redirect URLs:

**Production:**

```
https://yourdomain.com
https://yourdomain.com/
https://www.yourdomain.com
https://www.yourdomain.com/
```

**Staging (optional):**

```
https://staging.yourdomain.com
```

**Local Development:**

```
http://localhost:3000
http://localhost:5173
```

## User Flow Example

### First-Time User

```
1. User: "I want to try TradersDen"
   → Visits https://yourdomain.com

2. App: "Not authenticated"
   → Redirects to Deriv OAuth

3. User: "Login with my Deriv account"
   → Enters credentials on Deriv's site

4. Deriv: "Authorize TradersDen?"
   → User clicks "Authorize"

5. App: "Welcome back!"
   → User sees their balance
   → Can use all features

6. User: "I see a good signal"
   → Clicks "🎯 Trade Now"
   → Trade executes on their account
   → Sees profit/loss immediately
```

### Returning User

```
1. User: "Back to TradersDen"
   → Visits https://yourdomain.com

2. App: "Token found in localStorage"
   → Validates token with Deriv
   → User is logged in automatically

3. User: "Ready to trade!"
   → Uses Trade Now feature
```

## Important Notes

### ⚠️ App ID Security

-   **Public App ID**: Your App ID is public (it's in the URL)
-   **Not a Secret**: App ID is meant to be public
-   **User Tokens**: Each user's token is private to them
-   **No Risk**: Users can't access each other's accounts

### ✅ What Users Need

-   **Deriv Account**: Free to create at https://deriv.com
-   **Demo or Real**: Works with both account types
-   **No Installation**: Just visit your website
-   **Any Device**: Works on desktop, tablet, mobile

### 🔒 User Privacy

-   **Their Account**: Users trade on their own accounts
-   **Their Balance**: You never see or control their funds
-   **Their Tokens**: Stored only in their browser
-   **Their Control**: They can revoke access anytime

## Monitoring & Analytics

### Track Usage (Optional)

Add analytics to monitor:

-   Number of users
-   Trade volume
-   Popular signals
-   Win rates

### User Support

Provide help for:

-   How to create Deriv account
-   How to login
-   How to use Trade Now
-   How to check trade results

## FAQ for Users

**Q: Is my money safe?**
A: Yes! You login with your own Deriv account. We never have access to your funds.

**Q: Do I need to share my password?**
A: No! You login through Deriv's official OAuth page. We never see your password.

**Q: Can I use demo account?**
A: Yes! Perfect for testing without risk.

**Q: How do I start?**
A: Just visit the site, login with your Deriv account, and click "Trade Now" on any signal.

**Q: Can I revoke access?**
A: Yes! Go to Deriv settings → API Token → Revoke TradersDen access.

## Next Steps

1. ✅ Register production App ID
2. ✅ Update .env with production App ID
3. ✅ Test OAuth flow on staging
4. ✅ Deploy to production
5. ✅ Share your site with users!

## Support

-   **Deriv API**: https://api.deriv.com/docs
-   **OAuth Guide**: https://api.deriv.com/docs/oauth
-   **Community**: https://community.deriv.com

---

**Your site is ready for public use!** Just register your production App ID and deploy.
