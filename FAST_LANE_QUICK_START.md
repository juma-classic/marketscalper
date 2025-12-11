# Fast Lane - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you start implementing the Fast Lane 1-second trading system immediately.

---

## 📋 Prerequisites

-   Node.js 18+ installed
-   Project dependencies installed (`npm install`)
-   Deriv API token (get from https://app.deriv.com/account/api-token)
-   Basic understanding of React, TypeScript, and WebSockets

---

## 🎯 Step 1: Update Constants (5 minutes)

### 1.1 Add Fast Lane Tab Constant

**File:** `src/constants/bot-contents.ts`

```typescript
export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    CHART: 2,
    TUTORIAL: 3,
    ANALYSIS_TOOL: 4,
    SIGNALS: 5,
    TRADING_HUB: 6,
    SPEED_BOT: 7,
    FREE_BOTS: 8,
    FAST_LANE: 9, // ← ADD THIS
});

export const TAB_IDS = [
    'id-dbot-dashboard',
    'id-bot-builder',
    'id-charts',
    'id-tutorials',
    'id-analysis-tool',
    'id-signals',
    'id-Trading-Hub',
    'id-speed-bot',
    'id-free-bots',
    'id-fast-lane', // ← ADD THIS
];
```

---

## 🎯 Step 2: Create Page Structure (10 minutes)

### 2.1 Create Fast Lane Directory

```bash
mkdir -p src/pages/fast-lane
mkdir -p src/components/fast-lane
```

### 2.2 Create Index File

**File:** `src/pages/fast-lane/index.ts`

```typescript
export { default } from './fast-lane';
```

### 2.3 Create Main Page Component

**File:** `src/pages/fast-lane/fast-lane.tsx`

```typescript
import React from 'react';
import './fast-lane.scss';

const FastLane: React.FC = () => {
    return (
        <div className="fast-lane-page">
            <div className="fast-lane-header">
                <h1 className="page-title">
                    <span className="title-icon">⚡</span>
                    Fast Lane
                    <span className="beta-badge">BETA</span>
                </h1>
                <p className="page-description">
                    High-frequency 1-second trading with advanced rate limiting
                </p>
            </div>

            <div className="fast-lane-content">
                <p>Fast Lane trading system coming soon...</p>
            </div>
        </div>
    );
};

export default FastLane;
```

### 2.4 Create Basic Styles

**File:** `src/pages/fast-lane/fast-lane.scss`

```scss
.fast-lane-page {
    padding: 24px;
    background: var(--general-main-1);
    min-height: 100vh;
}

.fast-lane-header {
    margin-bottom: 32px;
}

.page-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-prominent);
    margin: 0 0 8px 0;
}

.title-icon {
    font-size: 32px;
}

.beta-badge {
    font-size: 12px;
    padding: 4px 8px;
    background: #ff444f;
    color: white;
    border-radius: 4px;
    font-weight: 600;
}

.page-description {
    font-size: 14px;
    color: var(--text-general);
    margin: 0;
}

.fast-lane-content {
    background: var(--general-section-1);
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

---

## 🎯 Step 3: Add Navigation Tab (10 minutes)

### 3.1 Add Fast Lane Icon

**File:** `src/pages/main/main.tsx`

Add this icon component after the existing icon components:

```typescript
const FastLaneIcon = () => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        {/* Lightning bolt */}
        <path
            d='M13 2L3 14h8l-2 8 10-12h-8l2-8z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinejoin='round'
            fill='none'
        />
        <path d='M13 2L3 14h8l-2 8 10-12h-8l2-8z' fill='#ffd700' opacity='0.4' />

        {/* Speed lines */}
        <path d='M18 4h3M19 7h2M18 10h3' stroke='#ffd700' strokeWidth='1.5' strokeLinecap='round' />

        {/* Accent dots */}
        <circle cx='11' cy='10' r='1.5' fill='#ffd700' />
        <circle cx='13' cy='16' r='1.5' fill='#ffd700' />
    </svg>
);
```

### 3.2 Import Fast Lane Page

At the top of `src/pages/main/main.tsx`, add:

```typescript
const FastLane = lazy(() => import('../fast-lane'));
```

### 3.3 Add Fast Lane Tab

In the `<Tabs>` component, add this new tab after the Free Bots tab:

```typescript
{/* FAST LANE TAB */}
<div
    label={
        <>
            <FastLaneIcon />
            <Localize i18n_default_text='Fast Lane' />
        </>
    }
    id='id-fast-lane'
>
    <Suspense fallback={<ChunkLoader message={localize('Loading Fast Lane...')} />}>
        <FastLane />
    </Suspense>
</div>
```

---

## 🎯 Step 4: Test the Setup (2 minutes)

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Verify Navigation

1. Open browser to `http://localhost:3000`
2. Look for "Fast Lane" tab in navigation
3. Click on Fast Lane tab
4. You should see the placeholder page

---

## 🎯 Step 5: Create Rate Limiter Utility (15 minutes)

**File:** `src/utils/fast-lane-rate-limiter.ts`

```typescript
/**
 * Token Bucket Rate Limiter
 * Prevents API rate limit violations by throttling requests
 */
export class RateLimiter {
    private tokens: number;
    private lastRefill: number;
    private queue: Array<() => void> = [];

    constructor(
        private maxTokens: number = 5,
        private refillRate: number = 1, // tokens per second
        private maxQueueSize: number = 100
    ) {
        this.tokens = maxTokens;
        this.lastRefill = Date.now();
    }

    /**
     * Refill tokens based on time elapsed
     */
    private refill(): void {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000;
        const tokensToAdd = elapsed * this.refillRate;

        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }

    /**
     * Attempt to consume a token
     */
    private tryConsume(): boolean {
        this.refill();

        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }

        return false;
    }

    /**
     * Execute a function with rate limiting
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const attempt = async () => {
                if (this.tryConsume()) {
                    try {
                        const result = await fn();
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }

                    // Process next in queue
                    this.processQueue();
                } else {
                    // Add to queue
                    if (this.queue.length < this.maxQueueSize) {
                        this.queue.push(attempt);
                    } else {
                        reject(new Error('Rate limiter queue full'));
                    }
                }
            };

            attempt();
        });
    }

    /**
     * Process queued requests
     */
    private processQueue(): void {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            if (next) {
                setTimeout(next, 100); // Small delay between requests
            }
        }
    }

    /**
     * Get current status
     */
    getStatus() {
        this.refill();
        return {
            availableTokens: Math.floor(this.tokens),
            queueLength: this.queue.length,
            utilizationPercent: ((this.maxTokens - this.tokens) / this.maxTokens) * 100,
        };
    }
}

// Export singleton instance
export const rateLimiter = new RateLimiter(5, 1, 100);
```

---

## 🎯 Step 6: Create Enhanced API Wrapper (20 minutes)

**File:** `src/utils/fast-lane-api.ts`

```typescript
import { rateLimiter } from './fast-lane-rate-limiter';

export interface TickData {
    tick: number;
    epoch: number;
    quote: number;
}

export interface TradeParams {
    contract_type: string;
    symbol: string;
    duration: number;
    duration_unit: string;
    amount: number;
    basis: 'stake';
    barrier?: string;
}

export class FastLaneAPI {
    private ws: WebSocket | null = null;
    private authToken: string = '';
    private appId: string = '1089';
    private requestId: number = 0;
    private callbacks: Map<number, (data: any) => void> = new Map();
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    constructor() {
        this.loadToken();
    }

    /**
     * Load token from localStorage
     */
    private loadToken(): void {
        const token = localStorage.getItem('fast_lane_token');
        const appId = localStorage.getItem('fast_lane_app_id');

        if (token) this.authToken = token;
        if (appId) this.appId = appId;
    }

    /**
     * Save token to localStorage
     */
    setAuthToken(token: string, appId?: string): void {
        this.authToken = token;
        if (appId) this.appId = appId;

        localStorage.setItem('fast_lane_token', token);
        if (appId) localStorage.setItem('fast_lane_app_id', appId);
    }

    /**
     * Connect to Deriv WebSocket
     */
    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            const wsUrl = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.reconnectAttempts = 0;
                resolve();
            };

            this.ws.onerror = error => {
                console.error('❌ WebSocket error:', error);
                reject(error);
            };

            this.ws.onclose = () => {
                console.log('🔌 WebSocket closed');
                this.handleReconnect();
            };

            this.ws.onmessage = event => {
                this.handleMessage(event.data);
            };
        });
    }

    /**
     * Handle reconnection with exponential backoff
     */
    private handleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            this.reconnectAttempts++;

            console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

            setTimeout(() => {
                this.connect().catch(console.error);
            }, delay);
        }
    }

    /**
     * Handle incoming WebSocket messages
     */
    private handleMessage(data: string): void {
        try {
            const message = JSON.parse(data);
            const reqId = message.req_id;

            if (reqId && this.callbacks.has(reqId)) {
                const callback = this.callbacks.get(reqId);
                if (callback) {
                    callback(message);
                    this.callbacks.delete(reqId);
                }
            }
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    }

    /**
     * Send request with rate limiting
     */
    private async sendRequest(request: any): Promise<any> {
        return rateLimiter.execute(async () => {
            return new Promise((resolve, reject) => {
                if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                    reject(new Error('WebSocket not connected'));
                    return;
                }

                const reqId = ++this.requestId;
                request.req_id = reqId;

                this.callbacks.set(reqId, response => {
                    if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response);
                    }
                });

                this.ws.send(JSON.stringify(request));
            });
        });
    }

    /**
     * Authorize with API token
     */
    async authorize(): Promise<any> {
        const response = await this.sendRequest({
            authorize: this.authToken,
        });

        return response.authorize;
    }

    /**
     * Subscribe to tick stream
     */
    async subscribeTicks(symbol: string, callback: (tick: TickData) => void): Promise<string> {
        const response = await this.sendRequest({
            ticks: symbol,
            subscribe: 1,
        });

        const subscriptionId = response.subscription?.id;

        // Set up subscription callback
        if (subscriptionId) {
            this.callbacks.set(subscriptionId, data => {
                if (data.tick) {
                    callback({
                        tick: data.tick.quote,
                        epoch: data.tick.epoch,
                        quote: data.tick.quote,
                    });
                }
            });
        }

        return subscriptionId;
    }

    /**
     * Buy contract
     */
    async buyContract(params: TradeParams): Promise<any> {
        const response = await this.sendRequest({
            buy: 1,
            price: params.amount,
            parameters: {
                contract_type: params.contract_type,
                symbol: params.symbol,
                duration: params.duration,
                duration_unit: params.duration_unit,
                basis: params.basis,
                amount: params.amount,
                ...(params.barrier && { barrier: params.barrier }),
            },
        });

        return response.buy;
    }

    /**
     * Get balance
     */
    async getBalance(): Promise<number> {
        const response = await this.sendRequest({
            balance: 1,
            subscribe: 1,
        });

        return parseFloat(response.balance?.balance || '0');
    }
}

// Export singleton instance
export const fastLaneAPI = new FastLaneAPI();
```

---

## 🎯 Step 7: Create Token Auth Component (15 minutes)

**File:** `src/components/fast-lane/TokenAuth.tsx`

```typescript
import React, { useState } from 'react';
import { fastLaneAPI } from '@/utils/fast-lane-api';
import './TokenAuth.scss';

interface TokenAuthProps {
    onSuccess: () => void;
}

export const TokenAuth: React.FC<TokenAuthProps> = ({ onSuccess }) => {
    const [token, setToken] = useState('');
    const [appId, setAppId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            fastLaneAPI.setAuthToken(token, appId || undefined);
            await fastLaneAPI.connect();
            await fastLaneAPI.authorize();

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="token-auth">
            <h2>🔐 Connect Your Account</h2>
            <p>Enter your Deriv API token to start trading</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>API Token *</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Enter your API token"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>App ID (optional)</label>
                    <input
                        type="text"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        placeholder="Custom app ID (default: 1089)"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={loading || !token}>
                    {loading ? 'Connecting...' : 'Connect'}
                </button>
            </form>

            <div className="help-text">
                <p>Don't have a token? <a href="https://app.deriv.com/account/api-token" target="_blank">Get one here</a></p>
            </div>
        </div>
    );
};
```

**File:** `src/components/fast-lane/TokenAuth.scss`

```scss
.token-auth {
    max-width: 500px;
    margin: 0 auto;
    padding: 32px;
    background: var(--general-section-1);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    h2 {
        margin: 0 0 8px 0;
        color: var(--text-prominent);
    }

    p {
        margin: 0 0 24px 0;
        color: var(--text-general);
    }

    .form-group {
        margin-bottom: 20px;

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-prominent);
        }

        input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--general-section-2);
            border-radius: 8px;
            background: var(--general-main-1);
            color: var(--text-prominent);
            font-size: 14px;

            &:focus {
                outline: none;
                border-color: #ff444f;
            }
        }
    }

    .error-message {
        padding: 12px;
        background: rgba(255, 68, 79, 0.1);
        border: 1px solid #ff444f;
        border-radius: 8px;
        color: #ff444f;
        margin-bottom: 16px;
    }

    button {
        width: 100%;
        padding: 14px;
        background: #ff444f;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
            background: #e63946;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 68, 79, 0.3);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .help-text {
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        color: var(--text-less-prominent);

        a {
            color: #ff444f;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
```

---

## 🎯 Step 8: Update Main Page (10 minutes)

**File:** `src/pages/fast-lane/fast-lane.tsx`

```typescript
import React, { useState } from 'react';
import { TokenAuth } from '@/components/fast-lane/TokenAuth';
import './fast-lane.scss';

const FastLane: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="fast-lane-page">
            <div className="fast-lane-header">
                <h1 className="page-title">
                    <span className="title-icon">⚡</span>
                    Fast Lane
                    <span className="beta-badge">BETA</span>
                </h1>
                <p className="page-description">
                    High-frequency 1-second trading with advanced rate limiting
                </p>
            </div>

            <div className="fast-lane-content">
                {!isAuthenticated ? (
                    <TokenAuth onSuccess={() => setIsAuthenticated(true)} />
                ) : (
                    <div className="trading-dashboard">
                        <p>✅ Connected! Trading dashboard coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FastLane;
```

---

## 🎯 Step 9: Test Everything (5 minutes)

### 9.1 Check for Errors

```bash
npm run build
```

### 9.2 Test in Browser

1. Navigate to Fast Lane tab
2. Enter your API token
3. Click "Connect"
4. Verify connection success

---

## ✅ You're Ready!

You now have:

-   ✅ Fast Lane page with navigation
-   ✅ Rate limiter utility
-   ✅ Enhanced API wrapper
-   ✅ Token authentication component
-   ✅ Basic styling with Deriv theme

---

## 🎯 Next Steps

Continue with the full implementation plan:

1. **Trading Configuration Component** - Market selection, trade types, risk management
2. **Trading Engine Component** - Manual and auto-trading execution
3. **Transaction History Component** - Trade history and statistics
4. **Performance Monitor Component** - Rate limiting and connection status
5. **Comprehensive Testing** - Unit, integration, and manual testing

See [FAST_LANE_IMPLEMENTATION_PLAN.md](./FAST_LANE_IMPLEMENTATION_PLAN.md) for complete details.

---

## 🆘 Troubleshooting

### WebSocket Connection Fails

-   Check your internet connection
-   Verify App ID is correct
-   Try default App ID (1089)

### Token Authentication Fails

-   Verify token is valid
-   Check token has trading permissions
-   Generate new token if needed

### Rate Limiter Issues

-   Check console for rate limit warnings
-   Adjust rate limiter settings if needed
-   Monitor API request rates

---

## 📚 Resources

-   [Deriv API Documentation](https://api.deriv.com)
-   [WebSocket API Guide](https://api.deriv.com/docs/websocket/)
-   [Rate Limiting Best Practices](https://api.deriv.com/docs/rate-limits/)

---

**Happy Coding! 🚀**
