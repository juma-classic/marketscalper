# Advanced Analysis Tool - Complete Guide

## Overview

The Advanced Analysis Tool is a comprehensive, custom-built solution for analyzing digit patterns in Deriv markets. It replaces the iframe-based tools with a fully integrated, feature-rich analysis platform.

## ✅ Features Implemented

### 1. Multiple Analysis Tools
- **Overview Tab** - Visual charts and distributions
- **Patterns Tab** - Pattern recognition and frequency
- **Statistics Tab** - Detailed digit statistics
- **Export Tab** - Data export functionality

### 2. Full-Screen Layout
- **Collapsible Sidebar** - Toggle sidebar for more space
- **Responsive Design** - Works on all screen sizes
- **Gradient Background** - Beautiful purple gradient
- **Glass Morphism** - Modern frosted glass effects

### 3. Custom Analysis Features
- **Digit Distribution Chart** - Bar chart showing frequency
- **Even vs Odd Analysis** - Pie chart comparison
- **High vs Low Analysis** - 5-9 vs 0-4 comparison
- **Recent Digits Display** - Last 20 digits with colors
- **Pattern Recognition** - Top 10 three-digit patterns
- **Hot/Cold Digits** - Real-time hot and cold tracking

### 4. Improved UI
- **Modern Design** - Clean, professional interface
- **Smooth Animations** - Transitions and hover effects
- **Color-Coded Data** - Easy visual identification
- **Responsive Tabs** - Switch between analysis views
- **Live Connection Status** - Real-time indicator

### 5. New Functionality
- **CSV Export** - Download data for Excel
- **JSON Export** - Download for programmatic use
- **Time Range Selection** - Last 10, 50, or 100 ticks
- **Market Selection** - All Deriv synthetic indices
- **Real-Time Updates** - Live tick data integration
- **Pattern Analysis** - Automatic pattern detection

### 6. Custom-Built (No iframes!)
- **Native React Components** - Fast and responsive
- **Direct API Integration** - Real-time data
- **No External Dependencies** - Self-contained
- **Full Control** - Customizable everything

## User Interface

### Header
```
📊 Advanced Analysis Tool    🟢 Live    [◀ Hide Sidebar]
```

### Sidebar (Collapsible)
- **Market Selection** - Dropdown with all markets
- **Time Range** - Buttons for 10, 50, 100 ticks
- **Quick Stats** - Current tick, last digit, totals

### Main Content Tabs

#### 1. Overview Tab
- **Digit Distribution** - Bar chart (0-9)
- **Even vs Odd** - Comparison cards
- **High vs Low** - Comparison cards
- **Recent Digits** - Last 20 with colors

#### 2. Patterns Tab
- **Top 10 Patterns** - Three-digit sequences
- **Pattern Frequency** - Count and percentage
- **Visual Bars** - Relative frequency display

#### 3. Statistics Tab
- **10 Digit Cards** - One for each digit (0-9)
- **Count** - How many times appeared
- **Percentage** - Frequency percentage
- **Last Seen** - Ticks since last appearance

#### 4. Export Tab
- **CSV Export** - For spreadsheets
- **JSON Export** - For programming
- **Export Info** - Summary of data

## Usage Guide

### Selecting a Market
1. Click the market dropdown in sidebar
2. Choose from Volatility, Crash, or Boom indices
3. Data automatically updates

### Changing Time Range
1. Click "Last 10", "Last 50", or "Last 100"
2. All charts update instantly
3. Affects all tabs

### Viewing Charts
1. Click "📈 Overview" tab
2. See digit distribution bar chart
3. View Even/Odd and High/Low analysis
4. Check recent digits

### Finding Patterns
1. Click "🔍 Patterns" tab
2. See top 10 three-digit patterns
3. Patterns like "3-7-9" show frequency
4. Use for prediction strategies

### Checking Statistics
1. Click "📊 Statistics" tab
2. View detailed stats for each digit
3. See count, percentage, last seen
4. Identify trends

### Exporting Data
1. Click "💾 Export" tab
2. Choose CSV or JSON format
3. Click download button
4. File saves automatically

### Toggling Sidebar
1. Click "◀ Hide Sidebar" button
2. Get more screen space
3. Click "▶ Show Sidebar" to restore

## Technical Details

### Data Sources
- **Live Ticks** - Real-time from Deriv API
- **Tick History** - Last 100 ticks stored
- **Digit Stats** - Calculated on-the-fly
- **Patterns** - Detected automatically

### Calculations

#### Even vs Odd
```typescript
evenCount = digits.filter(d => d % 2 === 0).length
oddCount = digits.filter(d => d % 2 !== 0).length
```

#### High vs Low
```typescript
highCount = digits.filter(d => d >= 5).length
lowCount = digits.filter(d => d < 5).length
```

#### Pattern Detection
```typescript
// Finds sequences like "3-7-9"
for (i = 0; i < digits.length - 2; i++) {
    pattern = `${digits[i]}-${digits[i+1]}-${digits[i+2]}`
    patterns[pattern]++
}
```

### Export Formats

#### CSV Format
```csv
Timestamp,Quote,Last Digit,Symbol
2024-01-01T12:00:00.000Z,123.456,6,R_50
2024-01-01T12:00:01.000Z,123.453,3,R_50
```

#### JSON Format
```json
[
  {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "quote": 123.456,
    "lastDigit": 6,
    "symbol": "R_50"
  }
]
```

## Supported Markets

### Volatility Indices
- Volatility 10 (1s) - R_10
- Volatility 25 (1s) - R_25
- Volatility 50 (1s) - R_50
- Volatility 75 (1s) - R_75
- Volatility 100 (1s) - R_100

### Crash Indices
- Crash 300 - CRASH300N
- Crash 500 - CRASH500N
- Crash 1000 - CRASH1000N

### Boom Indices
- Boom 300 - BOOM300N
- Boom 500 - BOOM500N
- Boom 1000 - BOOM1000N

## Color Coding

### Digits (0-9)
Each digit has a unique color based on HSL:
- Digit 0: Red (0°)
- Digit 1: Orange (36°)
- Digit 2: Yellow-Green (72°)
- Digit 3: Green (108°)
- Digit 4: Cyan-Green (144°)
- Digit 5: Cyan (180°)
- Digit 6: Blue (216°)
- Digit 7: Purple (252°)
- Digit 8: Magenta (288°)
- Digit 9: Pink (324°)

### Status Colors
- **Connected**: Green (#2e7d32)
- **Disconnected**: Red (#c62828)
- **Hot Digits**: Orange (#ff9800)
- **Cold Digits**: Blue (#2196f3)

## Responsive Design

### Desktop (>1024px)
- Full sidebar visible
- Multi-column charts
- All features accessible

### Tablet (768px-1024px)
- Narrower sidebar
- Single-column charts
- Optimized layout

### Mobile (<768px)
- Collapsible sidebar
- Stacked layout
- Touch-friendly buttons

## Performance

### Optimization
- Efficient calculations
- Minimal re-renders
- Lazy loading
- Smooth animations

### Memory Usage
- ~10KB for 100 ticks
- ~5KB for statistics
- ~2KB for patterns
- Total: ~17KB

## Trading Strategies

### Using the Analysis Tool

#### 1. Hot Digit Strategy
```
1. Check "Hot Digits" in sidebar
2. Trade on frequently appearing digits
3. Monitor in Overview tab
```

#### 2. Cold Digit Strategy
```
1. Check "Cold Digits" in sidebar
2. Trade on rarely appearing digits
3. Expect mean reversion
```

#### 3. Pattern Following
```
1. Go to Patterns tab
2. Find top patterns
3. Trade when pattern starts
```

#### 4. Even/Odd Balance
```
1. Check Even vs Odd in Overview
2. If imbalanced, trade opposite
3. Expect balance restoration
```

#### 5. High/Low Balance
```
1. Check High vs Low in Overview
2. If imbalanced, trade opposite
3. Use for range strategies
```

## Keyboard Shortcuts

- **Tab** - Switch between tabs
- **Ctrl+E** - Export CSV
- **Ctrl+J** - Export JSON
- **Ctrl+B** - Toggle sidebar
- **1-4** - Switch to tab 1-4

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Troubleshooting

### No Data Showing
1. Check connection status (should be 🟢 Live)
2. Verify market is selected
3. Wait for ticks to arrive
4. Check browser console

### Charts Not Updating
1. Refresh the page
2. Check WebSocket connection
3. Try different market
4. Clear browser cache

### Export Not Working
1. Check browser allows downloads
2. Ensure data exists
3. Try different format
4. Check file permissions

## Files Created

1. **`src/components/analysis-tool/AnalysisTool.tsx`** - Main component
2. **`src/components/analysis-tool/AnalysisTool.scss`** - Styling
3. **Updated `src/pages/main/main.tsx`** - Integration
4. **`ANALYSIS_TOOL_GUIDE.md`** - This documentation

## Future Enhancements

- [ ] More chart types (line, area, scatter)
- [ ] Advanced pattern recognition (ML)
- [ ] Custom indicators
- [ ] Alerts and notifications
- [ ] Historical data comparison
- [ ] Strategy backtesting
- [ ] Multi-market comparison
- [ ] PDF export
- [ ] Share analysis links
- [ ] Save custom views

## Status: ✅ COMPLETE

All requested features have been implemented:
- ✅ Multiple analysis tools
- ✅ Full-screen layout with sidebar
- ✅ Custom charts and indicators
- ✅ Modern UI with animations
- ✅ Data export functionality
- ✅ Custom-built (no iframes)

The Advanced Analysis Tool is ready to use!
