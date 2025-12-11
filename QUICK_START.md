# Quick Start Guide - TradersDen API Integration

## 🚀 Your Site is Live!

**Local:** https://localhost:8443/
**Network:** https://192.168.1.66:8443/

## 🎯 5-Minute Setup

### Step 1: Get Your API Credentials (2 min)

1. Go to https://api.deriv.com/app-registration
2. Login with your Deriv account
3. Register a new app:
   - **App Name:** TradersDen Local
   - **Redirect URL:** https://localhost:8443/callback
   - **Verification:** https://localhost:8443/
4. Copy your `app_id`

### Step 2: Configure Your App (1 min)

```bash
# Create .env file
copy .env.example .env

# Edit .env and paste your app_id
DERIV_APP_ID=your_app_id_here
```

### Step 3: Restart Dev Server (1 min)

Press `Ctrl+C` in the terminal running the dev server, then:

```bash
npm run start
```

### Step 4: Test It! (1 min)

1. Open https://localhost:8443/
2. Login with your Deriv account
3. Open browser console (F12)
4. You should see "WebSocket connection established"

## 🧪 Quick Test

Open browser console and try:

```javascript
// Test if API is connected
console.log('API Status:', window.api_base?.getConnectionStatus());

// The hooks and services are available in your React components
```

## 📖 Usage Examples

### In React Components:

```typescript
import { useTicksSubscription, usePortfolio } from '@/hooks/useDerivAPI';

function TradingDashboard() {
    // Real-time price updates
    const { tickData } = useTicksSubscription('R_100');
    
    // Portfolio data
    const { portfolio, loading, fetchPortfolio } = usePortfolio();
    
    useEffect(() => {
        fetchPortfolio();
    }, []);
    
    return (
        <div>
            <h2>Current Price: {tickData?.quote}</h2>
            <h2>Open Positions: {portfolio?.contracts.length}</h2>
        </div>
    );
}
```

### Direct API Calls:

```typescript
import { derivAPIService } from '@/services/deriv-api.service';

// Get profit table
const profitTable = await derivAPIService.getProfitTable({
    limit: 50,
    sort: 'DESC'
});

// Buy a contract
const buyResponse = await derivAPIService.buyContract(proposal_id, price);

// Subscribe to ticks
await derivAPIService.subscribeToTicks('R_100', (data) => {
    console.log('New tick:', data.tick.quote);
});
```

## 🎨 Add Server Selector to UI

In your settings page:

```typescript
import { ServerSelector } from '@/components/settings/ServerSelector';

<ServerSelector />
```

## 📚 Full Documentation

- **Configuration:** See `API_CONFIGURATION.md`
- **Checklist:** See `API_ENHANCEMENT_CHECKLIST.md`
- **Summary:** See `IMPLEMENTATION_SUMMARY.md`

## ⚠️ Important Notes

1. **Use Demo Account First** - Test everything with demo before real money
2. **Never Commit .env** - It's already in .gitignore
3. **HTTPS Required** - Deriv API requires secure connections
4. **Browser Console** - Check for WebSocket connection status

## 🆘 Common Issues

### "WebSocket connection failed"
- Check your `app_id` in `.env`
- Verify you restarted the dev server
- Try switching endpoints using ServerSelector

### "Not authorized"
- Login to your Deriv account
- Check if token is valid
- Try logging out and back in

### "Cannot read property of undefined"
- Wait for WebSocket to connect
- Check if API is initialized
- Ensure you're authenticated

## 🎉 You're Ready!

Everything is set up and ready to use. Start building your trading features with full Deriv API support!

**What you can do now:**
- ✅ View real-time prices
- ✅ Get portfolio data
- ✅ Access profit/loss history
- ✅ Place and close trades
- ✅ Subscribe to market data
- ✅ Switch server endpoints
- ✅ Full TypeScript support

Happy coding! 🚀
