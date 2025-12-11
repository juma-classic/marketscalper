# Speed Mode - System Architecture

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Speed Mode System                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SpeedModeOverlay (Main Container)               │
│  • Manages state                                             │
│  • Handles notifications                                     │
│  • Coordinates components                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ SpeedMode    │  │ SpeedMode    │  │ SpeedTrading │
    │ Toggle       │  │ Config       │  │ Engine       │
    └──────────────┘  └──────────────┘  └──────────────┘
                              │                  │
                              │                  ▼
                              │         ┌──────────────┐
                              │         │ Deriv        │
                              │         │ Trading API  │
                              │         └──────────────┘
                              │                  │
                              └──────────────────┘
```

## 📦 Component Breakdown

### 1. SpeedModeOverlay

**File**: `src/components/speed-mode/SpeedModeOverlay.tsx`

**Responsibilities**:

-   Main container component
-   State management (settings, balance, visibility)
-   Trade notification handling
-   Component coordination

**Key State**:

```typescript
- isSpeedMode: boolean
- isVisible: boolean
- showConfig: boolean
- accountBalance: number
- settings: SpeedModeSettings
```

### 2. SpeedModeToggle

**File**: `src/components/speed-mode/SpeedModeToggle.tsx`

**Responsibilities**:

-   Enable/disable Speed Mode
-   Visual status indicator
-   Mode description

**Props**:

```typescript
- isSpeedMode: boolean
- onToggle: (enabled: boolean) => void
- disabled?: boolean
```

### 3. SpeedModeConfig

**File**: `src/components/speed-mode/SpeedModeConfig.tsx`

**Responsibilities**:

-   Trading configuration UI
-   Settings validation
-   Risk management inputs
-   Balance display

**Props**:

```typescript
- settings: SpeedModeSettings
- onSettingsChange: (settings: SpeedModeSettings) => void
- accountBalance: number
```

**Settings Interface**:

```typescript
interface SpeedModeSettings {
    market: string;
    strategy: 'momentum' | 'reversal' | 'scalping' | 'zeus_ai';
    tradeType: 'DIGITEVEN' | 'DIGITODD' | 'DIGITMATCH' | 'DIGITDIFF';
    stake: number;
    targetRuns: number;
    stopLoss: number;
    takeProfit: number;
    duration: number;
    durationType: 't' | 'm';
}
```

### 4. SpeedTradingEngine

**File**: `src/components/speed-mode/SpeedTradingEngine.tsx`

**Responsibilities**:

-   Trade execution logic
-   Strategy implementation
-   Stats tracking
-   WebSocket tick management
-   Real-time UI updates

**Props**:

```typescript
- market: string
- strategy: 'momentum' | 'reversal' | 'scalping' | 'zeus_ai'
- tradeType: 'DIGITEVEN' | 'DIGITODD' | 'DIGITMATCH' | 'DIGITDIFF'
- stake: number
- targetRuns: number
- duration: number
- durationType: 't' | 'm'
- stopLoss: number
- takeProfit: number
- onStop: () => void
- onTradeExecuted?: (result: TradeResult) => void
```

### 5. DerivTradingAPI

**File**: `src/utils/deriv-trading-api.ts`

**Responsibilities**:

-   Deriv API communication
-   WebSocket management
-   Trade execution
-   Account management
-   Error handling

**Key Methods**:

```typescript
- connect(): Promise<boolean>
- authorize(): Promise<AccountInfo>
- getBalance(): Promise<number>
- getProposal(config: TradeConfig): Promise<any>
- executeTrade(config: TradeConfig): Promise<TradeResult>
- disconnect(): void
- isReady(): boolean
```

## 🔄 Data Flow

### Initialization Flow

```
1. User navigates to Bot Builder
   ↓
2. SpeedModeOverlay checks visibility
   ↓
3. Component mounts
   ↓
4. DerivAPI connects
   ↓
5. Account authorized
   ↓
6. Balance fetched
   ↓
7. UI ready
```

### Trading Flow

```
1. User configures settings
   ↓
2. User clicks "Start Trading"
   ↓
3. SpeedTradingEngine initializes
   ↓
4. WebSocket subscribes to ticks
   ↓
5. For each tick:
   ├─ Strategy analyzes
   ├─ Prediction generated
   ├─ Proposal requested
   ├─ Trade executed
   ├─ Result monitored
   ├─ Stats updated
   └─ Risk checked
   ↓
6. Stop when conditions met
```

### State Update Flow

```
Trade Result
   ↓
SpeedTradingEngine
   ↓
onTradeExecuted callback
   ↓
SpeedModeOverlay
   ├─ Update balance
   ├─ Show notification
   └─ Update UI
```

## 🌐 API Integration

### WebSocket Connections

#### Tick Stream (SpeedTradingEngine)

```
wss://ws.binaryws.com/websockets/v3?app_id=82255
   ↓
Subscribe: { ticks: "R_50", subscribe: 1 }
   ↓
Receive: { tick: { epoch, quote, ... } }
```

#### Trading API (DerivTradingAPI)

```
wss://ws.binaryws.com/websockets/v3?app_id=82255
   ↓
Authorize: { authorize: "token" }
   ↓
Proposal: { proposal: 1, ... }
   ↓
Buy: { buy: "proposal_id", price: 1 }
   ↓
Monitor: { proposal_open_contract: 1, contract_id: "..." }
```

## 🎨 Styling Architecture

### SCSS Files

```
SpeedModeOverlay.scss
├─ Overlay positioning
├─ Panel layout
└─ Notification animations

SpeedModeToggle.scss
├─ Toggle switch
├─ Status indicators
└─ Descriptions

SpeedModeConfig.scss
├─ Form layouts
├─ Input styling
├─ Risk management section
└─ Responsive grid

SpeedTradingEngine.scss
├─ Stats cards
├─ Trade results
├─ Progress bars
├─ Error banners
└─ Control buttons
```

## 🔐 Security Considerations

### Token Management

```
localStorage
   ↓
client.accounts → Parse
   ↓
active_loginid → Get active
   ↓
Extract token
   ↓
Use for authorization
```

### Request Security

-   ✅ WSS (secure WebSocket)
-   ✅ Request timeout (30s)
-   ✅ Error sanitization
-   ✅ No token storage in code
-   ✅ Session-based auth

## 📊 State Management

### Component State

```typescript
SpeedModeOverlay:
  - isSpeedMode: boolean
  - isVisible: boolean
  - showConfig: boolean
  - accountBalance: number
  - settings: SpeedModeSettings

SpeedTradingEngine:
  - isRunning: boolean
  - isConnecting: boolean
  - ticks: TickData[]
  - currentTick: TickData | null
  - stats: { runs, wins, losses, profit }
  - lastTradeResult: TradeResult | null
  - error: string | null
```

### Refs

```typescript
SpeedTradingEngine:
  - wsRef: WebSocket | null
  - runManagerRef: SmartRunManager | null
  - isProcessingTrade: boolean
```

## 🔄 Lifecycle

### Mount

```
SpeedModeOverlay
   ↓
Check visibility (Bot Builder tab)
   ↓
Connect to Deriv API
   ↓
Fetch account balance
   ↓
Render components
```

### Update

```
Settings change
   ↓
Update state
   ↓
Re-render affected components
   ↓
Validate inputs
```

### Unmount

```
Stop trading
   ↓
Close WebSocket
   ↓
Clear intervals
   ↓
Cleanup refs
```

## 🎯 Error Handling

### Levels

```
1. API Level (DerivTradingAPI)
   ├─ Connection errors
   ├─ Authorization errors
   ├─ Request timeouts
   └─ API errors

2. Engine Level (SpeedTradingEngine)
   ├─ Trade execution errors
   ├─ Strategy errors
   └─ WebSocket errors

3. UI Level (SpeedModeOverlay)
   ├─ Display errors
   ├─ User notifications
   └─ Graceful degradation
```

## 📈 Performance Optimizations

### Implemented

-   ✅ Request debouncing
-   ✅ State batching
-   ✅ Ref usage for non-render state
-   ✅ Memoized calculations
-   ✅ Efficient WebSocket handling
-   ✅ Trade locking (prevent concurrent)

### Future Optimizations

-   [ ] Virtual scrolling for trade history
-   [ ] Web Workers for calculations
-   [ ] IndexedDB for persistence
-   [ ] Service Worker for offline support

## 🧪 Testing Strategy

### Unit Tests

-   DerivTradingAPI methods
-   Strategy algorithms
-   State management
-   Error handling

### Integration Tests

-   Component interactions
-   API communication
-   Trade flow
-   Risk management

### E2E Tests

-   Full trading cycle
-   Configuration changes
-   Error scenarios
-   Mobile experience

---

## 📚 Related Documentation

-   **User Guide**: `SPEED_MODE_REAL_TRADING_GUIDE.md`
-   **Quick Start**: `SPEED_MODE_QUICK_START.md`
-   **Implementation**: `SPEED_MODE_IMPLEMENTATION_COMPLETE.md`
