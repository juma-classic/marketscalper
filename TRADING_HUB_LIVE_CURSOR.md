# Trading Hub Live Cursor Feature

## Overview
The Multiple Stakes tab now features a **live cursor** that tracks and highlights the last digit of the current market price in real-time using Deriv WebSocket connections.

## Features

### 1. Live Digit Tracking
- **Real-time Updates**: Connects to Deriv WebSocket API to receive live tick data
- **Last Digit Highlighting**: The digit circle corresponding to the last digit of the current price is highlighted with a pulsing animation
- **Visual Feedback**: Animated cursor indicator (●) appears on the active digit

### 2. Visual Indicators

#### Digit Circle States:
- **Normal State**: Gray background (#e0e0e0) with gray border
- **Selected Digits (2, 4, 6)**: Yellow background (#fff3cd) - these are your trading targets
- **Live Cursor**: Red gradient background with pulse animation and glow effect
  - Scales up to 1.15x size
  - Pulsing shadow effect
  - Blinking cursor indicator

#### Live Price Display:
- Shows current market price with 2 decimal places
- Displays the last digit in a prominent badge
- Purple gradient background for visibility
- Updates in real-time with each tick

### 3. Animations
- **Pulse Animation**: Smooth scale effect when digit changes (0.6s duration)
- **Blink Animation**: Cursor indicator blinks continuously (1s cycle)
- **Smooth Transitions**: All state changes use 0.3s ease transitions

## Technical Implementation

### State Management
```typescript
const [currentLastDigit, setCurrentLastDigit] = useState<number | null>(null);
const [currentPrice, setCurrentPrice] = useState<number | null>(null);
```

### WebSocket Subscription
```typescript
derivAPIService.subscribeToTicks(multiMarket, (response: any) => {
    if (response.tick) {
        const price = parseFloat(response.tick.quote);
        const lastDigit = parseInt(price.toString().slice(-1));
        
        setCurrentPrice(price);
        setCurrentLastDigit(lastDigit);
    }
});
```

### Digit Circle Rendering
```typescript
<div 
    className={`digit-circle 
        ${digit === currentLastDigit ? 'live-cursor' : ''} 
        ${[2, 4, 6].includes(digit) ? 'selected' : ''}`}
>
    <div className='digit-number'>{digit}</div>
    <div className='digit-percentage'>{getDigitPercentage(digit)}</div>
    {digit === currentLastDigit && (
        <div className='cursor-indicator'>●</div>
    )}
</div>
```

## Usage

1. **Navigate to Multiple Stakes Tab**: Click on the "Multiple Stakes" tab in Trading Hub
2. **Select Market**: Choose your preferred volatility index (Vol 10, 25, 50, 75, or 100)
3. **Watch Live Updates**: The digit circles will automatically start tracking the last digit of live prices
4. **Monitor Statistics**: Each digit shows its occurrence percentage based on historical ticks

## Benefits

- **Real-time Market Insight**: See which digits are appearing most frequently
- **Visual Trading Aid**: Quickly identify current market behavior
- **Pattern Recognition**: Helps spot trends in last digit distribution
- **Enhanced Decision Making**: Combine live cursor with percentage statistics for better trade timing

## Color Coding

| State | Background | Border | Purpose |
|-------|-----------|--------|---------|
| Normal | Gray | Gray | Inactive digits |
| Selected | Yellow | Yellow | Your trading targets (2, 4, 6) |
| Live Cursor | Red Gradient | Red | Current last digit |
| Active (old) | Green | Green | Previously used for highlighting |

## Performance

- **Lightweight**: Minimal performance impact
- **Efficient Updates**: Only updates on new tick data
- **Smooth Animations**: Hardware-accelerated CSS transforms
- **Auto-cleanup**: Properly unsubscribes when switching tabs or markets

## Future Enhancements

Potential improvements:
- Add sound notification when cursor hits selected digits
- Show tick history trail
- Add configurable cursor colors
- Display tick frequency counter
- Add prediction indicators based on patterns
