# Bulk Trading Implementation Guide

## Overview

The bulk trading feature allows placing multiple contracts simultaneously with proper rate limiting, error handling, and result tracking.

## Features Implemented

### ✅ Core Functionality
- **Sequential Trading** - Places contracts one after another with delays
- **Parallel Trading** - Places contracts in parallel with staggered delays
- **Rate Limiting** - 150ms delay between requests (configurable)
- **Error Handling** - Each contract handled independently
- **Balance Checking** - Validates sufficient funds before trading
- **Result Tracking** - Monitors success/failure of each contract
- **Progress Modal** - Visual feedback during bulk trading

### ✅ User Interface
- **Bulk Count Selector** - Choose number of contracts (1-20)
- **Bulk Over Button** - Place multiple "Over" contracts
- **Bulk Under Button** - Place multiple "Under" contracts
- **Track Bulk Display** - Shows last bulk trade results
- **Loading Modal** - Shows progress and results

## How to Use

### 1. Set Bulk Count
```typescript
// In the UI, use the input field
<input 
    type="number" 
    min="1" 
    max="20" 
    value={bulkCount}
    onChange={e => setBulkCount(parseInt(e.target.value))}
/>
```

### 2. Place Bulk Trades
```typescript
// Click "Bulk Over" or "Bulk Under" button
const handleBulkTrade = async (direction: 'over' | 'under') => {
    const stats = await bulkTradingService.placeBulkTrades({
        proposalId: 'proposal_id_here',
        price: 10,
        count: 5,
        delayMs: 150
    });
    
    console.log(`Successful: ${stats.successful}/${stats.total}`);
};
```

### 3. Using the Hook
```typescript
import { useBulkTrading } from '@/hooks/useBulkTrading';

function MyComponent() {
    const { 
        isBulkTrading, 
        bulkStats, 
        placeBulkTrades 
    } = useBulkTrading();
    
    const handleBulk = async () => {
        const stats = await placeBulkTrades({
            proposalId: 'abc123',
            price: 10,
            count: 5
        });
        
        alert(`Placed ${stats.successful} contracts!`);
    };
    
    return (
        <button onClick={handleBulk} disabled={isBulkTrading}>
            {isBulkTrading ? 'Trading...' : 'Bulk Trade'}
        </button>
    );
}
```

## API Reference

### BulkTradingService

#### `placeBulkTrades(config)`
Places contracts sequentially with delays.

**Parameters:**
- `proposalId` (string) - The proposal ID from Deriv API
- `price` (number) - Stake amount per contract
- `count` (number) - Number of contracts to place
- `delayMs` (number, optional) - Delay between requests (default: 150ms)

**Returns:** `Promise<BulkTradeStats>`

**Example:**
```typescript
const stats = await bulkTradingService.placeBulkTrades({
    proposalId: 'abc123',
    price: 10,
    count: 5,
    delayMs: 200
});
```

#### `placeBulkTradesParallel(config)`
Places contracts in parallel with staggered delays.

**Parameters:**
- `proposalId` (string) - The proposal ID
- `price` (number) - Stake amount
- `count` (number) - Number of contracts

**Returns:** `Promise<BulkTradeStats>`

**Example:**
```typescript
const stats = await bulkTradingService.placeBulkTradesParallel({
    proposalId: 'abc123',
    price: 10,
    count: 5
});
```

#### `checkBalance(requiredAmount)`
Checks if user has sufficient balance.

**Parameters:**
- `requiredAmount` (number) - Total amount needed

**Returns:** `Promise<boolean>`

#### `cancelBulkTrading()`
Cancels ongoing bulk trading operation.

#### `isBulkTrading()`
Returns whether bulk trading is in progress.

**Returns:** `boolean`

### BulkTradeStats Interface

```typescript
interface BulkTradeStats {
    total: number;           // Total contracts attempted
    successful: number;      // Successfully placed
    failed: number;          // Failed to place
    results: BulkTradeResult[];  // Detailed results
    totalCost: number;       // Total amount spent
    startTime: number;       // Start timestamp
    endTime: number;         // End timestamp
    duration: number;        // Duration in ms
}
```

### BulkTradeResult Interface

```typescript
interface BulkTradeResult {
    success: boolean;
    contractId?: number;
    transactionId?: number;
    buyPrice?: number;
    error?: string;
    index: number;
}
```

## Best Practices

### 1. Rate Limiting
```typescript
// Use 150-200ms delays to avoid rate limiting
const stats = await bulkTradingService.placeBulkTrades({
    proposalId: 'abc123',
    price: 10,
    count: 5,
    delayMs: 150  // Safe delay
});
```

### 2. Error Handling
```typescript
try {
    const stats = await bulkTradingService.placeBulkTrades(config);
    
    if (stats.failed > 0) {
        console.warn(`${stats.failed} contracts failed`);
        // Handle partial failure
    }
} catch (error) {
    console.error('Bulk trade failed:', error);
    // Handle complete failure
}
```

### 3. Balance Checking
```typescript
const totalRequired = price * count;
const hasBalance = await bulkTradingService.checkBalance(totalRequired);

if (!hasBalance) {
    alert('Insufficient balance!');
    return;
}
```

### 4. Progress Tracking
```typescript
const stats = await bulkTradingService.placeBulkTrades(config);

console.log(`Progress: ${stats.successful}/${stats.total}`);
console.log(`Duration: ${stats.duration}ms`);
console.log(`Total Cost: $${stats.totalCost}`);
```

## Deriv API Limits

### Rate Limits
- **Requests per second:** ~5-10 per connection
- **Recommended delay:** 150-200ms between requests
- **Maximum burst:** Avoid sending >10 requests instantly

### Account Limits
- **Maximum stake:** Varies by account type
- **Maximum open positions:** Typically 100-200
- **Exposure limits:** Based on account balance

## Error Handling

### Common Errors

1. **Rate Limit Exceeded**
```typescript
// Error: Too many requests
// Solution: Increase delayMs
delayMs: 200  // Instead of 100
```

2. **Insufficient Balance**
```typescript
// Error: Insufficient balance
// Solution: Check balance first
await bulkTradingService.checkBalance(totalRequired);
```

3. **Invalid Proposal**
```typescript
// Error: Proposal expired
// Solution: Get fresh proposal before bulk trading
const proposal = await getProposal();
```

## Testing

### Test Sequential Trading
```typescript
const stats = await bulkTradingService.placeBulkTrades({
    proposalId: 'test_proposal',
    price: 1,  // Small amount for testing
    count: 3,  // Small count for testing
    delayMs: 200
});

console.log('Test Results:', stats);
```

### Test Parallel Trading
```typescript
const stats = await bulkTradingService.placeBulkTradesParallel({
    proposalId: 'test_proposal',
    price: 1,
    count: 3
});

console.log('Parallel Test Results:', stats);
```

## UI Components

### Bulk Count Selector
```tsx
<div className='bulk-controls'>
    <label>Bulk Count:</label>
    <input
        type='number'
        min='1'
        max='20'
        value={bulkCount}
        onChange={e => setBulkCount(parseInt(e.target.value))}
    />
</div>
```

### Bulk Action Buttons
```tsx
<button 
    className='bulk-over'
    onClick={() => handleBulkTrade('over')}
    disabled={isBulkTrading}
>
    {isBulkTrading ? 'Trading...' : `Bulk Over (${bulkCount})`}
</button>
```

### Progress Modal
```tsx
{showBulkModal && (
    <div className='bulk-modal-overlay'>
        <div className='bulk-modal'>
            <h3>Bulk Trading in Progress...</h3>
            {bulkStats && (
                <div className='bulk-results'>
                    <p>Successful: {bulkStats.successful}</p>
                    <p>Failed: {bulkStats.failed}</p>
                    <p>Total Cost: ${bulkStats.totalCost}</p>
                </div>
            )}
        </div>
    </div>
)}
```

## Files Created

1. **`src/services/bulk-trading.service.ts`** - Core bulk trading logic
2. **`src/hooks/useBulkTrading.ts`** - React hook for bulk trading
3. **`src/components/speed-bot/speed-bot-new.tsx`** - Updated with bulk features
4. **`src/components/speed-bot/speed-bot-new.scss`** - Bulk trading styles
5. **`BULK_TRADING_GUIDE.md`** - This documentation

## Security Considerations

1. **Validate Input** - Always validate bulk count and stake amounts
2. **Check Balance** - Verify sufficient funds before trading
3. **Rate Limiting** - Respect Deriv's API limits
4. **Error Logging** - Log all errors for debugging
5. **User Confirmation** - Confirm large bulk trades with user

## Future Enhancements

- [ ] Add bulk trade history
- [ ] Implement trade cancellation mid-bulk
- [ ] Add bulk trade scheduling
- [ ] Implement smart retry logic
- [ ] Add bulk trade templates
- [ ] Implement position management
- [ ] Add bulk close functionality

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API credentials
3. Test with small amounts first
4. Check Deriv API status
5. Review error messages in modal

## Status: ✅ COMPLETE

Bulk trading feature is fully implemented and ready to use!
