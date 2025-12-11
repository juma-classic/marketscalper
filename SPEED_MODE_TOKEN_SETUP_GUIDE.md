# 🔑 Speed Mode - API Token Setup Guide

## Problem: "No auth token available"

If you see this error, it means Speed Mode can't find your Deriv API token. This guide will help you fix it!

## 🎯 Quick Solution

### Option 1: Automatic Token Detection (Easiest)

If you're already logged into Deriv in the same browser:

1. Make sure you're logged into your Deriv account
2. The token should be detected automatically
3. If not, proceed to Option 2

### Option 2: Manual Token Setup (Recommended)

Follow these steps to create and set your API token:

## 📋 Step-by-Step Instructions

### Step 1: Get Your API Token from Deriv

1. **Go to Deriv API Token Page**

    - Visit: https://app.deriv.com/account/api-token
    - Or navigate: Deriv Dashboard → Settings → API Token

2. **Login to Your Account**

    - Use your Deriv credentials
    - For testing, use a **demo account** (recommended)

3. **Create New Token**

    - Click the **"Create new token"** button
    - You'll see a form to configure your token

4. **Configure Token Settings**

    **Token Name:**

    ```
    Speed Mode Trading
    ```

    **Select Scopes (Permissions):**

    - ✅ **Read** - View account information
    - ✅ **Trade** - Execute trades
    - ✅ **Payments** - View balance
    - ✅ **Trading information** - Access trading data

    ⚠️ **Important**: Make sure to enable all these scopes!

5. **Create and Copy Token**
    - Click **"Create"**
    - Your token will be displayed (looks like: `a1-aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789`)
    - **Copy the entire token** - you won't be able to see it again!

### Step 2: Set Token in Speed Mode

1. **Enable Speed Mode**

    - Go to Bot Builder tab
    - Toggle Speed Mode ON

2. **Token Setup Screen Appears**

    - You'll see a form asking for your API token
    - Paste your token in the input field

3. **Submit Token**

    - Click **"✅ Set Token"**
    - Your token is now saved securely in your browser

4. **Start Trading!**
    - Configure your settings
    - Click "Start Speed Trading"

## 🔒 Security Information

### Where is the Token Stored?

Your token is stored **locally in your browser** using:

-   `localStorage` (primary storage)
-   Never sent to any third-party servers
-   Only used to communicate directly with Deriv's API

### Is it Safe?

✅ **Yes, it's safe because:**

-   Token stays in your browser
-   Direct communication with Deriv API only
-   You can revoke the token anytime from Deriv
-   No third-party access

### Token Storage Locations

Speed Mode checks these locations (in order):

1. `client.accounts` (Deriv's default storage)
2. `speed_mode_token` (manual token storage)
3. `authToken`, `deriv_token`, `api_token` (alternative keys)
4. `sessionStorage` (temporary storage)

## 💡 Testing with Demo Account

### Why Use Demo Account?

-   ✅ No real money risk
-   ✅ Test strategies safely
-   ✅ Learn the system
-   ✅ Unlimited virtual funds

### How to Create Demo Account Token

1. **Switch to Demo Account**

    - In Deriv, click account switcher
    - Select a demo account (starts with "VRT")

2. **Create Token for Demo**

    - Follow the same steps as above
    - Token will be linked to demo account

3. **Test Speed Mode**
    - Use demo token in Speed Mode
    - Trade with virtual money
    - No risk!

## 🔄 Managing Your Token

### Change Token

1. Click **"🔑 Change Token"** button in Speed Mode
2. Enter new token
3. Old token is replaced

### Revoke Token

To revoke a token (disable it):

1. Go to: https://app.deriv.com/account/api-token
2. Find your token in the list
3. Click **"Delete"** or **"Revoke"**
4. Token is immediately disabled

### Multiple Tokens

You can create multiple tokens for different purposes:

-   One for Speed Mode
-   One for other bots
-   One for testing
-   One for production

## 🐛 Troubleshooting

### "No auth token available"

**Cause**: Token not found in storage

**Solutions**:

1. Enable Speed Mode and set token manually
2. Make sure you're logged into Deriv
3. Check if token was created correctly
4. Try creating a new token

### "Authorization failed"

**Cause**: Invalid or expired token

**Solutions**:

1. Create a new token
2. Make sure all required scopes are enabled
3. Check if token was copied correctly (no extra spaces)
4. Verify account is active

### "Insufficient permissions"

**Cause**: Token doesn't have required scopes

**Solutions**:

1. Delete old token
2. Create new token with all required scopes:
    - Read ✅
    - Trade ✅
    - Payments ✅
    - Trading information ✅

### Token Not Saving

**Cause**: Browser storage issues

**Solutions**:

1. Check if cookies/localStorage are enabled
2. Try a different browser
3. Clear browser cache and try again
4. Disable browser extensions that block storage

### "Invalid token format"

**Cause**: Token copied incorrectly

**Solutions**:

1. Copy token again (entire string)
2. Remove any spaces or line breaks
3. Make sure it starts with account prefix (e.g., `a1-`)

## 📱 Mobile Setup

The token setup works the same on mobile:

1. Open Deriv app or website on mobile
2. Create token (same steps)
3. Copy token
4. Open your app
5. Enable Speed Mode
6. Paste token

## 🔐 Best Practices

### DO ✅

-   ✅ Use demo account for testing
-   ✅ Create separate tokens for different purposes
-   ✅ Revoke unused tokens
-   ✅ Keep token private
-   ✅ Enable only required scopes
-   ✅ Test with small amounts first

### DON'T ❌

-   ❌ Share your token with anyone
-   ❌ Post token in public forums
-   ❌ Use same token everywhere
-   ❌ Enable unnecessary scopes
-   ❌ Skip testing with demo
-   ❌ Store token in plain text files

## 🎓 Understanding Token Scopes

### Read

-   View account information
-   Check balance
-   See account details

### Trade

-   Execute buy/sell orders
-   Place contracts
-   Required for Speed Mode

### Payments

-   View transaction history
-   Check payment methods
-   See balance updates

### Trading Information

-   Access market data
-   View open positions
-   Get contract details

## 🚀 Quick Start After Token Setup

Once your token is set:

1. **Configure Settings**

    - Market: R_50
    - Strategy: Momentum
    - Stake: $0.35
    - Target Runs: 5

2. **Start Trading**

    - Click "Start Speed Trading"
    - Monitor results
    - Adjust as needed

3. **Stop When Done**
    - Click "Stop Trading"
    - Review stats
    - Analyze performance

## 📞 Need Help?

### Common Questions

**Q: Can I use the same token on multiple devices?**
A: Yes, but be careful not to run conflicting trades.

**Q: Does the token expire?**
A: Tokens don't expire unless you revoke them.

**Q: Can I have multiple tokens?**
A: Yes, create as many as you need.

**Q: What if I lose my token?**
A: Create a new one. Old tokens can be revoked.

**Q: Is there a token limit?**
A: Deriv allows multiple tokens per account.

### Still Having Issues?

1. Check Deriv API documentation: https://api.deriv.com
2. Verify account status
3. Try creating a fresh token
4. Test with demo account first
5. Check browser console for errors

## ✅ Verification Checklist

Before starting Speed Mode:

-   [ ] Deriv account created
-   [ ] Logged into Deriv
-   [ ] API token created with all scopes
-   [ ] Token copied correctly
-   [ ] Token set in Speed Mode
-   [ ] Balance shows correctly
-   [ ] Demo account for testing (recommended)
-   [ ] Settings configured
-   [ ] Ready to trade!

---

## 🎉 You're All Set!

Once your token is configured, Speed Mode will:

-   ✅ Connect automatically
-   ✅ Show your balance
-   ✅ Execute real trades
-   ✅ Update stats in real-time

**Happy Trading! 🚀**

---

## 📚 Related Documentation

-   **User Guide**: `SPEED_MODE_REAL_TRADING_GUIDE.md`
-   **Quick Start**: `SPEED_MODE_QUICK_START.md`
-   **Testing**: `SPEED_MODE_TEST_CHECKLIST.md`
-   **Architecture**: `SPEED_MODE_ARCHITECTURE.md`
