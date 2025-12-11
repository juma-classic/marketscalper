# Fast Lane - Immediate Next Steps

## Current Status

✅ UI Components Built (Phase 1-3 complete)
❌ NOT connected to real Deriv API
❌ Using simulated data

## What We Found

### Existing Infrastructure ✅

The app already has:

1. **API Connection:** `api_base` from `@/external/bot-skeleton/services/api/api-base`
2. **Auth Hook:** `useApiBase()` - provides connection status, auth data, balance
3. **API Service:** `src/services/deriv-api.service.ts` - centralized API calls
4. **No Token Required:** App uses existing Deriv authentication

### Pattern to Follow

```typescript
// 1. Import API
import { api_base } from '@/external/bot-skeleton/services/api/api-base';
import { useApiBase } from '@/hooks/useApiBase';

// 2. Get connection status
const { connectionStatus, isAuthorized, authData } = useApiBase();

// 3. Subscribe to ticks
const response = await api_base.api?.send({
    ticks: 'R_50',
    subscribe: 1,
});

// 4. Buy contract
const result = await api_base.api?.send({
    buy: 1,
    price: 1.0,
    parameters: {
        contract_type: 'DIGITEVEN',
        symbol: 'R_50',
        duration: 1,
        duration_unit: 't',
        basis: 'stake',
        amount: 1.0,
    },
});
```

---

## Step-by-Step Implementation

### STEP 1: Remove Token Authentication ⚡ START HERE

**Why:** App already has authentication, no need for separate token input

**Changes:**

1. Remove `TokenAuth` component from Fast Lane page
2. Check if user is authorized using `useApiBase()`
3. Show Fast Lane dashboard if authorized
4. Show "Please log in" message if not authorized

**File:** `src/pages/fast-lane/fast-lane.tsx`

**Code:**

```typescript
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';

const FastLane: React.FC = () => {
    const { isAuthorized, connectionStatus } = useApiBase();
    const { client } = useStore();
    const accountBalance = client.balance || 0;

    if (!isAuthorized) {
        return (
            <div className="fast-lane">
                <div className="fast-lane__not-authorized">
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to use Fast Lane Trading</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fast-lane">
            {/* Show trading dashboard */}
        </div>
    );
};
```

---

### STEP 2: Connect Real Tick Data ⚡

**Why:** Need live market data for trading decisions

**Changes:**

1. Subscribe to tick stream when component mounts
2. Update tick display with real data
3. Handle market changes
4. Clean up subscription on unmount

**File:** `src/components/fast-lane/TradingEngine.tsx`

**Code:**

```typescript
import { api_base } from '@/external/bot-skeleton/services/api/api-base';

useEffect(() => {
    let subscriptionId: string | null = null;

    const subscribeTicks = async () => {
        try {
            const response = await api_base.api?.send({
                ticks: settings.market,
                subscribe: 1,
            });

            if (response?.subscription) {
                subscriptionId = response.subscription.id;

                // Listen for tick updates
                const subscription = api_base.api?.onMessage().subscribe((message: any) => {
                    if (message.tick && message.tick.symbol === settings.market) {
                        const tick = message.tick;
                        setCurrentTick(tick.quote);
                        setLastDigit(Math.floor(tick.quote * 100) % 10);
                    }
                });

                api_base.pushSubscription({
                    id: subscriptionId,
                    unsubscribe: () => subscription?.unsubscribe(),
                });
            }
        } catch (error) {
            console.error('Failed to subscribe to ticks:', error);
        }
    };

    subscribeTicks();

    return () => {
        if (subscriptionId) {
            api_base.api?.send({ forget: subscriptionId });
        }
    };
}, [settings.market]);
```

---

### STEP 3: Execute Real Trades ⚡

**Why:** Core functionality - need to actually place trades

**Changes:**

1. Implement real trade execution
2. Add loading states
3. Handle errors
4. Track contract ID

**File:** `src/components/fast-lane/TradingEngine.tsx`

**Code:**

```typescript
const [isTrading, setIsTrading] = useState(false);
const [tradeError, setTradeError] = useState('');

const handleManualTrade = async () => {
    setIsTrading(true);
    setTradeError('');

    try {
        // Build trade parameters
        const parameters: any = {
            contract_type: settings.tradeType,
            symbol: settings.market,
            duration: settings.duration,
            duration_unit: 't',
            basis: 'stake',
            amount: settings.stake,
        };

        // Add barrier for Over/Under
        if (['DIGITOVER', 'DIGITUNDER'].includes(settings.tradeType)) {
            parameters.barrier = settings.barrier;
        }

        // Add prediction for Matches/Differs
        if (['DIGITMATCH', 'DIGITDIFF'].includes(settings.tradeType)) {
            parameters.barrier = settings.prediction;
        }

        // Execute trade
        const response = await api_base.api?.send({
            buy: 1,
            price: settings.stake,
            parameters,
        });

        if (response?.buy) {
            const contractId = response.buy.contract_id;
            console.log('Trade executed:', contractId);

            // Track contract result
            trackContract(contractId);
        }
    } catch (error: any) {
        setTradeError(error.message || 'Trade failed');
        console.error('Trade error:', error);
    } finally {
        setIsTrading(false);
    }
};
```

---

### STEP 4: Track Contract Results ⚡

**Why:** Need to know if trade won or lost

**Changes:**

1. Subscribe to contract updates
2. Detect when contract finishes
3. Calculate profit/loss
4. Update transaction history

**File:** `src/components/fast-lane/TradingEngine.tsx`

**Code:**

```typescript
const trackContract = async (contractId: string) => {
    try {
        const response = await api_base.api?.send({
            proposal_open_contract: 1,
            contract_id: contractId,
            subscribe: 1,
        });

        if (response?.subscription) {
            const subscription = api_base.api?.onMessage().subscribe((message: any) => {
                if (message.proposal_open_contract?.contract_id === contractId) {
                    const contract = message.proposal_open_contract;

                    // Check if contract is finished
                    if (contract.is_sold) {
                        const profit = parseFloat(contract.profit);
                        const outcome = profit > 0 ? 'win' : 'loss';

                        // Create transaction
                        const transaction: Transaction = {
                            id: contractId,
                            contractId: contractId,
                            type: settings.tradeType,
                            market: settings.market,
                            entryTick: contract.entry_tick,
                            exitTick: contract.exit_tick,
                            stake: settings.stake,
                            profit: profit,
                            outcome: outcome,
                            timestamp: Date.now(),
                        };

                        // Update state
                        setLastTradeResult(outcome);
                        onTradeExecuted?.(transaction);

                        // Update stats
                        updateStats(outcome, profit);

                        // Unsubscribe
                        api_base.api?.send({ forget: response.subscription.id });
                        subscription.unsubscribe();
                    }
                }
            });
        }
    } catch (error) {
        console.error('Failed to track contract:', error);
    }
};
```

---

### STEP 5: Update Balance Display ⚡

**Why:** Show real account balance

**Changes:**

1. Get balance from store
2. Subscribe to balance updates
3. Remove static balance

**File:** `src/pages/fast-lane/fast-lane.tsx`

**Code:**

```typescript
import { useStore } from '@/hooks/useStore';

const FastLane: React.FC = () => {
    const { client } = useStore();
    const accountBalance = client.balance || 0;

    // Remove this:
    // const [accountBalance, setAccountBalance] = useState(10000);

    // Balance will update automatically from store
};
```

---

## Testing Checklist

### After Each Step:

#### Step 1: Auth Check

-   [ ] Open Fast Lane tab
-   [ ] If logged in: See dashboard
-   [ ] If not logged in: See "Please log in" message
-   [ ] Log in and refresh: Dashboard appears

#### Step 2: Real Ticks

-   [ ] Open Fast Lane (logged in)
-   [ ] See real tick values updating
-   [ ] Last digit changes with ticks
-   [ ] Change market: Ticks update for new market
-   [ ] Check console: No errors

#### Step 3: Real Trades

-   [ ] Click "Trade Now"
-   [ ] See loading state
-   [ ] Trade executes (check Deriv account)
-   [ ] Contract ID logged in console
-   [ ] No errors

#### Step 4: Contract Results

-   [ ] Execute a trade
-   [ ] Wait for contract to finish (1-5 ticks)
-   [ ] See win/loss result
-   [ ] Transaction appears in history
-   [ ] Profit/loss is correct

#### Step 5: Real Balance

-   [ ] Balance shows real account balance
-   [ ] Execute a trade
-   [ ] Balance updates after trade
-   [ ] Balance matches Deriv account

---

## Quick Start Commands

```bash
# 1. Start development server
npm start

# 2. Open browser
# Navigate to Fast Lane tab

# 3. Check console for errors
# Open DevTools > Console

# 4. Test with demo account first!
# Use demo account to avoid real money loss
```

---

## Safety Notes ⚠️

1. **Test with DEMO account first!**
2. **Start with small stakes** ($0.35 minimum)
3. **Set stop loss limits**
4. **Monitor closely** during initial testing
5. **Check rate limiting** - don't exceed API limits
6. **Have emergency stop ready**

---

## Files to Modify (Priority Order)

1. ✅ `src/pages/fast-lane/fast-lane.tsx` - Remove token auth, use existing auth
2. ✅ `src/components/fast-lane/TradingEngine.tsx` - Connect real ticks and trades
3. ✅ `src/components/fast-lane/TradingConfig.tsx` - Validate against real limits
4. ✅ `src/components/fast-lane/TransactionHistory.tsx` - Display real trade data

---

## Estimated Time

-   **Step 1 (Auth):** 30 minutes
-   **Step 2 (Ticks):** 1 hour
-   **Step 3 (Trades):** 2 hours
-   **Step 4 (Results):** 1 hour
-   **Step 5 (Balance):** 30 minutes
-   **Testing:** 2 hours

**Total: ~7 hours** (1 day of focused work)

---

## Success Criteria

✅ Fast Lane uses existing app authentication
✅ Real tick data displays
✅ Manual trades execute on Deriv
✅ Contract results tracked correctly
✅ Real balance displays and updates
✅ Transaction history shows real trades
✅ No API errors
✅ Rate limiting works

---

**Ready to start?** Let's begin with Step 1! 🚀

Would you like me to implement Step 1 (remove token auth and use existing app auth)?
