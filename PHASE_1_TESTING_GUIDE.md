# 🧪 Phase 1 Testing Guide

## Quick Start - View Demo Pages

### **Option 1: Add Routes to Your App**

Add these routes to your router configuration:

```tsx
// In your router file (e.g., App.tsx or routes.tsx)
import { LiveSignalsDemo } from './pages/live-signals-demo';
import { DynamicSignalsDemo } from './pages/dynamic-signals-demo';
import { FlashAnimationDemo } from './components/signals/FlashAnimationDemo';

// Add routes:
<Route path="/live-signals-demo" element={<LiveSignalsDemo />} />
<Route path="/dynamic-signals-demo" element={<DynamicSignalsDemo />} />
<Route path="/flash-animation-demo" element={<FlashAnimationDemo />} />
```

Then navigate to:

-   `http://localhost:3000/live-signals-demo`
-   `http://localhost:3000/dynamic-signals-demo`
-   `http://localhost:3000/flash-animation-demo`

---

## 🎯 Manual Testing Checklist

### **Test 1: Live Pattern Display**

**What to test:**

1. Open `/live-signals-demo`
2. Click "Start Auto-Ticks"
3. Watch pattern boxes fill up

**Expected behavior:**

-   ✅ Boxes appear one by one (green for EVEN, red for ODD)
-   ✅ Latest box has pulsing blue dot
-   ✅ Glow effect when pattern changes
-   ✅ Pattern age updates ("5s ago", "10s ago")
-   ✅ Smooth animations at 60fps

**Test different speeds:**

-   Fast (500ms) - Should still be smooth
-   Normal (1000ms) - Default speed
-   Slow (2000ms) - Easy to see animations

---

### **Test 2: Streak Counter**

**What to test:**

1. On `/live-signals-demo`
2. Click "Add EVEN" multiple times (5-10 times)
3. Watch streak counter

**Expected behavior:**

-   ✅ Counter increments: 1 → 2 → 3 → 4 → 5
-   ✅ Bounce animation on each increment
-   ✅ At 5: Fire icon 🔥 appears
-   ✅ At 5, 8, 13: Fibonacci badge (φ) appears
-   ✅ Border color changes:
    -   Normal (1-4): Gray
    -   Warning (5-6): Yellow
    -   Danger (7-9): Orange
    -   Critical (10+): Red pulsing
-   ✅ Probability meter updates
-   ✅ Transition text shows: "5 EVEN → 6 EVEN"

**Test streak break:**

1. After 5+ EVEN, click "Add ODD"
2. Counter should reset to 1
3. Previous streak should show at bottom

---

### **Test 3: Flash Animations**

**What to test:**

1. Navigate to `/flash-animation-demo`
2. Try each button

**Test each alert type:**

**Success Alert:**

-   ✅ Green flash across screen
-   ✅ Toast notification appears
-   ✅ Confetti animation (optional)
-   ✅ Auto-dismisses after 2 seconds

**Warning Alert:**

-   ✅ Orange flash
-   ✅ Warning icon ⚠️
-   ✅ Yellow border

**Danger Alert:**

-   ✅ Red flash
-   ✅ Error icon ❌
-   ✅ Red border

**Critical Alert:**

-   ✅ Dark red flash
-   ✅ Siren icon 🚨
-   ✅ Pulsing animation
-   ✅ More intense than danger

**Info Alert:**

-   ✅ Blue flash
-   ✅ Info icon ℹ️
-   ✅ Blue border

**Test full-screen flashes:**

-   Click "Green Flash" - Screen flashes green
-   Click "Red Flash" - Screen flashes red
-   Click "Blue Flash" - Screen flashes blue
-   Click "Orange Flash" - Screen flashes orange

**Test element animations:**

1. Click "Shake" - Box shakes left/right
2. Click "Glow" - Box glows blue
3. Click "Confetti 🎉" - Confetti falls from top

**Test animation queue:**

-   Click multiple buttons rapidly
-   ✅ Animations should queue (not overlap)
-   ✅ Queue length should increase
-   ✅ "Currently Animating" should show "Yes"

---

### **Test 4: Win Probability Calculator**

**What to test:**

1. On `/live-signals-demo`
2. Add patterns and watch probability meter

**Test scenarios:**

**Scenario 1: Balanced Pattern**

-   Add: EVEN, ODD, EVEN, ODD, EVEN, ODD
-   ✅ Probability should be ~50%
-   ✅ Confidence should be medium
-   ✅ Recommendation: HOLD

**Scenario 2: Long Streak**

-   Add 10 consecutive EVEN
-   ✅ Probability should increase (70-85%)
-   ✅ Confidence should be high
-   ✅ Recommendation: BUY or STRONG_BUY
-   ✅ Meter color: Green

**Scenario 3: Imbalanced Distribution**

-   Add: 12 EVEN, 3 ODD
-   ✅ Probability should be high (75%+)
-   ✅ Confidence should be high
-   ✅ Recommendation: STRONG_BUY

**Test breakdown:**

1. Click "▶ Details" button
2. ✅ Should show calculation factors:
    - Streak Length
    - Distribution Balance
    - Volatility
    - Momentum
    - Time Factor
3. ✅ Each factor has a progress bar
4. ✅ Historical accuracy shows (if available)

**Test animations:**

-   ✅ Circular meter animates smoothly
-   ✅ Percentage updates with bounce effect
-   ✅ Color changes based on probability
-   ✅ Confidence interval arc visible

---

### **Test 5: Dynamic Signal Card (Complete Integration)**

**What to test:**

1. Navigate to `/dynamic-signals-demo`
2. Watch all 3 cards update in real-time

**Expected behavior:**

**Card 1: OVER/UNDER (Volatility 10)**

-   ✅ Pattern boxes show O (green) and U (red)
-   ✅ Streak counter tracks OVER/UNDER streaks
-   ✅ Pattern strength meter updates
-   ✅ Prediction panel appears after 5+ streak
-   ✅ Distribution bars show OVER vs UNDER %
-   ✅ Alerts trigger on high confidence

**Card 2: EVEN/ODD (Volatility 25)**

-   ✅ Pattern boxes show E (green) and O (red)
-   ✅ Different market, different patterns
-   ✅ All features work independently

**Card 3: RISE/FALL (Volatility 50)**

-   ✅ Pattern boxes show R (green) and F (red)
-   ✅ Based on price movement
-   ✅ All features work

**Test auto-trade:**

1. Wait for high-confidence alert (85%+)
2. ✅ "Trade Now" button appears
3. Click button
4. ✅ Trade logged at bottom
5. ✅ Shows: time, market, type, confidence, stake

**Test pattern strength:**

-   ✅ Meter shows 0-100%
-   ✅ Color changes: red (weak) → orange (moderate) → green (strong)
-   ✅ Description updates

**Test prediction:**

-   Wait for 5+ streak
-   ✅ Prediction panel appears
-   ✅ Shows predicted digit
-   ✅ Shows confidence %
-   ✅ Shows type (OVER/UNDER)

**Test distribution analysis:**

-   ✅ Two bars show percentage split
-   ✅ Insight text appears on imbalance
-   ✅ "⚠️ High imbalance detected" when difference >= 8

---

## 🎮 Interactive Testing Scenarios

### **Scenario 1: Simulate Winning Streak**

1. Go to `/live-signals-demo`
2. Click "Add EVEN" 10 times
3. **Watch for:**
    - Streak counter reaches 10
    - Fire icon appears
    - Border turns red and pulses
    - Probability increases
    - "STRONG_BUY" recommendation
    - Milestone alert at 5, 7, 10

### **Scenario 2: Simulate Pattern Break**

1. After 10 EVEN streak
2. Click "Add ODD"
3. **Watch for:**
    - Streak resets to 1
    - Previous streak shows at bottom
    - Transition text: "10 EVEN → 1 ODD"
    - Probability recalculates
    - Border color changes back

### **Scenario 3: Test All Animations**

1. Go to `/flash-animation-demo`
2. Click all buttons in sequence
3. **Watch for:**
    - Smooth animations
    - No lag or jank
    - Proper cleanup
    - Queue management

### **Scenario 4: Stress Test**

1. Go to `/live-signals-demo`
2. Set speed to "Fast (500ms)"
3. Click "Start Auto-Ticks"
4. Let it run for 2 minutes
5. **Check for:**
    - No memory leaks
    - Smooth performance
    - No crashes
    - Animations still smooth

---

## 📊 Performance Testing

### **Check Frame Rate:**

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with demo pages
5. Stop recording
6. **Look for:**
    - ✅ 60fps maintained
    - ✅ No long tasks (> 50ms)
    - ✅ Smooth animations

### **Check Memory Usage:**

1. Open Chrome DevTools
2. Go to Memory tab
3. Take heap snapshot
4. Interact with demo
5. Take another snapshot
6. **Look for:**
    - ✅ Memory usage < 100MB
    - ✅ No significant leaks
    - ✅ Proper cleanup

### **Check Network:**

1. Open Chrome DevTools
2. Go to Network tab
3. **Look for:**
    - ✅ WebSocket connection (if using live data)
    - ✅ No excessive requests
    - ✅ Fast load times

---

## 🐛 Common Issues & Solutions

### **Issue: Demo pages not loading**

**Solution:** Make sure routes are added to your router

### **Issue: Animations are laggy**

**Solution:**

-   Close other tabs
-   Check CPU usage
-   Try in Chrome (best performance)

### **Issue: WebSocket not connecting**

**Solution:**

-   Check internet connection
-   Verify Deriv API is accessible
-   Check console for errors

### **Issue: Tests failing**

**Solution:**

```bash
# Run tests individually
npm test LivePatternDisplay
npm test useStreakCounter
npm test animation-controller
npm test probability-calculator
```

---

## ✅ Testing Checklist Summary

### **Visual Tests:**

-   [ ] Pattern boxes render correctly
-   [ ] Colors are correct (green/red)
-   [ ] Animations are smooth (60fps)
-   [ ] Latest box has pulse animation
-   [ ] Glow effect on changes
-   [ ] Streak counter updates
-   [ ] Fire icon appears at 5+
-   [ ] Fibonacci badge appears
-   [ ] Border colors change
-   [ ] Flash animations work
-   [ ] Confetti appears
-   [ ] Probability meter updates
-   [ ] Circular chart animates
-   [ ] Recommendation displays

### **Functional Tests:**

-   [ ] Pattern updates on new tick
-   [ ] Streak counts correctly
-   [ ] Streak resets on break
-   [ ] Milestones trigger
-   [ ] Animations queue properly
-   [ ] Probability calculates correctly
-   [ ] Confidence intervals accurate
-   [ ] Historical accuracy tracks
-   [ ] Auto-trade triggers
-   [ ] Trade logging works

### **Performance Tests:**

-   [ ] 60fps maintained
-   [ ] No memory leaks
-   [ ] Fast load times
-   [ ] Smooth on mobile
-   [ ] No lag with rapid updates

---

## 🎯 Next Steps After Testing

Once you've tested everything:

1. **If everything works:** ✅

    - Move to Phase 2
    - Or integrate into your app

2. **If issues found:** 🐛

    - Note the issue
    - Check console for errors
    - Review component code
    - Run specific tests

3. **If you want to customize:** 🎨
    - Adjust colors in SCSS files
    - Change thresholds in components
    - Add more features

---

## 📞 Need Help?

-   Check console for errors (F12)
-   Review component files
-   Check test files for examples
-   Read documentation files

**Happy testing! 🧪**
