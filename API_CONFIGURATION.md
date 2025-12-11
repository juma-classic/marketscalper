# TradersDen API Configuration Guide

## Overview

This document explains how to configure and use the Deriv API integration in TradersDen.

## Getting Your API Credentials

1. Visit [Deriv API Registration](https://api.deriv.com/app-registration)
2. Register your application
3. Copy your `app_id`
4. Update the configuration (see below)

## Configuration Methods

### Method 1: Environment Variables (Recommended)

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Update the `DERIV_APP_ID` in `.env`:
   ```env
   DERIV_APP_ID=your_app_id_here
   ```

### Method 2: Direct Configuration

Edit `src/config/api-config.ts` and update the `APP_ID`:

```typescript
export const API_CONFIG = {
    APP_ID: 'your_app_id_here',
    // ...
};
```

## WebSocket Endpoints

TradersDen supports multiple WebSocket endpoints:

- **Production** (Default): `wss://ws.derivws.com/websockets/v3`
- **Binary (Legacy)**: `wss://ws.binaryws.com/websockets/v3`

### Changing Endpoints

Users can change endpoints via the UI using the `ServerSelector` component, or programmatically:

```typescript
localStorage.setItem('deriv_server_endpoint', 'production');
```

## Available API Services

### Core API Service

Import and use the centralized API service:

```typescript
import { derivAPIService } from '@/services/deriv-api.service';

// Get portfolio
const portfolio = await derivAPIService.getPortfolio();

// Get profit table
const profitTable = await derivAPIService.getProfitTable({
    limit: 50,
    sort: 'DESC'
});

// Buy a contract
const buyResponse = await derivAPIService.buyContract(proposal_id, price);

// Sell a contract
const sellResponse = await derivAPIService.sellContract(contract_id, price);
```

### React Hooks

Use pre-built hooks for common operations:

```typescript
import { 
    useTicksSubscription, 
    useCandlesSubscription,
    usePortfolioSubscription,
    usePortfolio,
    useProfitTable 
} from '@/hooks/useDerivAPI';

// Subscribe to real-time ticks
const { tickData, isSubscribed } = useTicksSubscription('R_100');

// Subscribe to candles (OHLC)
const { candleData, candles } = useCandlesSubscription('R_100', 60);

// Subscribe to portfolio changes
const { portfolio } = usePortfolioSubscription();

// Fetch portfolio data
const { portfolio, loading, fetchPortfolio } = usePortfolio();
```

## API Calls Implemented

### ✅ Completed

1. **Portfolio** - Get all open positions
   ```typescript
   derivAPIService.getPortfolio(contract_type?: string[])
   ```

2. **Profit Table** - Historical profit/loss
   ```typescript
   derivAPIService.getProfitTable(options)
   ```

3. **Statement** - Account statement
   ```typescript
   derivAPIService.getStatement(options)
   ```

4. **Buy Contract** - Place trades
   ```typescript
   derivAPIService.buyContract(proposal_id, price)
   ```

5. **Sell Contract** - Close positions
   ```typescript
   derivAPIService.sellContract(contract_id, price)
   ```

6. **Ticks History** - Historical tick data
   ```typescript
   derivAPIService.getTicksHistory(options)
   ```

7. **Trading Times** - Market schedules
   ```typescript
   derivAPIService.getTradingTimes(date?)
   ```

8. **Payout Currencies** - Available currencies
   ```typescript
   derivAPIService.getPayoutCurrencies()
   ```

### ✅ Real-time Subscriptions

1. **Ticks** - Real-time price feeds
   ```typescript
   derivAPIService.subscribeToTicks(symbol, callback)
   ```

2. **Candles** - OHLC data
   ```typescript
   derivAPIService.subscribeToCandles(symbol, granularity, callback)
   ```

3. **Portfolio** - Portfolio changes
   ```typescript
   derivAPIService.subscribeToPortfolio(callback)
   ```

4. **Balance** - Already implemented in api-base.ts
5. **Transaction** - Already implemented in api-base.ts
6. **Proposal Open Contract** - Already implemented in api-base.ts

## Server Selector Component

Add the server selector to your settings page:

```typescript
import { ServerSelector } from '@/components/settings/ServerSelector';

<ServerSelector onServerChange={(endpoint) => {
    console.log('Server changed to:', endpoint);
}} />
```

## Type Safety

All API calls are fully typed. Import types from:

```typescript
import type {
    TPortfolioResponse,
    TProfitTableResponse,
    TBuyContractRequest,
    // ... etc
} from '@/types/deriv-api.types';
```

## Error Handling

All API calls return promises. Handle errors appropriately:

```typescript
try {
    const portfolio = await derivAPIService.getPortfolio();
    console.log('Portfolio:', portfolio);
} catch (error) {
    console.error('Failed to fetch portfolio:', error);
}
```

## Unsubscribing

Always unsubscribe when components unmount:

```typescript
// Unsubscribe from specific stream
await derivAPIService.unsubscribe(subscription_id);

// Unsubscribe from all streams
derivAPIService.unsubscribeAll();
```

## Testing

To test the API integration:

1. Ensure you have valid credentials
2. Check browser console for WebSocket connection status
3. Use the browser's Network tab to monitor WebSocket messages
4. Test with demo accounts first before using real accounts

## Security Notes

- Never commit your actual `app_id` to version control
- Use environment variables for sensitive data
- Always use HTTPS/WSS in production
- Validate all user inputs before sending to API
- Implement rate limiting for API calls

## Troubleshooting

### WebSocket Connection Issues

1. Check if `app_id` is correct
2. Verify network connectivity
3. Check browser console for errors
4. Try switching endpoints using ServerSelector

### API Call Failures

1. Ensure user is authenticated
2. Check if token is valid
3. Verify API parameters
4. Check Deriv API status page

## Additional Resources

- [Deriv API Documentation](https://api.deriv.com/docs)
- [Deriv API Playground](https://api.deriv.com/api-explorer)
- [WebSocket Protocol](https://api.deriv.com/docs/websocket-protocol)
