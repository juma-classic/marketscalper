# Zeus Analysis Tool - Manual Integration Test Checklist

## Purpose
This checklist provides step-by-step instructions for manually testing the Zeus Analysis Tool integration in a live browser environment.

## Prerequisites
- [ ] Application running locally or on staging server
- [ ] Access to Deriv API (WebSocket connection)
- [ ] Multiple browsers available for testing
- [ ] Different devices/screen sizes for responsive testing

---

## Test 1: End-to-End Probability Calculation Flow

### Steps:
1. [ ] Open the Zeus Analysis Tool in browser
2. [ ] Select market "Volatility 50 (R_50)"
3. [ ] Set tick count to 1000
4. [ ] Click "Refresh" button
5. [ ] Wait for data to load (should show loading skeleton)
6. [ ] Verify all 10 digit circles (0-9) are displayed
7. [ ] Verify "Most Likely Next Digit" card shows prediction
8. [ ] Verify top 5 predictions are listed in descending order
9. [ ] Verify confidence levels are displayed (HIGH/MEDIUM/LOW)
10. [ ] Verify confidence colors: GREEN (high), YELLOW (medium), RED (low)

### Expected Results:
- ✅ Loading skeleton appears during data fetch
- ✅ All 10 digits displayed with percentages
- ✅ Predictions sorted by probability
- ✅ Confidence levels correctly assigned
- ✅ Calculation completes in < 2 seconds

### Performance Check:
- [ ] Open browser DevTools > Performance tab
- [ ] Record while refreshing data
- [ ] Verify probability calculation < 100ms
- [ ] Verify initial render < 50ms

---

## Test 2: Alert System Integration

### Steps:
1. [ ] Enable "Sound" checkbox in controls
2. [ ] Enable "Notifications" checkbox (grant permission if prompted)
3. [ ] Wait for high-confidence prediction (>75% probability)
4. [ ] Verify alert appears in notification panel (top-right)
5. [ ] Verify alert sound plays
6. [ ] Verify browser notification appears
7. [ ] Wait for pattern (5 consecutive same digits)
8. [ ] Verify pattern detection alert appears
9. [ ] Click "X" to dismiss an alert
10. [ ] Verify alert is removed from panel

### Expected Results:
- ✅ Alerts appear in fixed panel at top-right
- ✅ Alert includes timestamp and message
- ✅ Sound plays when enabled
- ✅ Browser notification shows when enabled
- ✅ Maximum 10 alerts displayed
- ✅ Alerts can be dismissed
- ✅ Slide-in animation works smoothly

---

## Test 3: Cache Integration and TTL

### Steps:
1. [ ] Open browser DevTools > Application > Session Storage
2. [ ] Refresh Zeus Analysis Tool
3. [ ] Verify cache entries created with prefix "zeus_cache_"
4. [ ] Note the timestamp in cache entry
5. [ ] Refresh page immediately (< 5 minutes)
6. [ ] Verify data loads from cache (faster load)
7. [ ] Wait 6 minutes
8. [ ] Refresh page
9. [ ] Verify new API call made (cache expired)
10. [ ] Manually corrupt cache entry in DevTools
11. [ ] Refresh page
12. [ ] Verify corrupted cache cleared and fresh data fetched

### Expected Results:
- ✅ Cache entries created in sessionStorage
- ✅ Data retrieved from cache within 5 minutes
- ✅ Cache expires after 5 minutes
- ✅ Corrupted cache handled gracefully

---

## Test 4: Bot Builder Integration

### Steps:
1. [ ] Open browser DevTools > Console
2. [ ] Add event listener: `window.addEventListener('create.bot.strategy', e => console.log('Bot Strategy:', e.detail))`
3. [ ] Add event listener: `window.addEventListener('zeus.trade.signal', e => console.log('Trade Signal:', e.detail))`
4. [ ] Wait for high-confidence prediction
5. [ ] Click "Create Bot Strategy" button
6. [ ] Verify event logged in console with complete configuration
7. [ ] Verify configuration includes: tradeType, market, prediction, stake, duration, martingale, stopLoss, takeProfit
8. [ ] Click "Trade Now" button on a prediction
9. [ ] Verify trade signal event logged in console
10. [ ] Verify signal includes: type, market, prediction, confidence, reasoning

### Expected Results:
- ✅ 'create.bot.strategy' event dispatched
- ✅ Strategy configuration complete
- ✅ 'zeus.trade.signal' event dispatched
- ✅ Trade signal data complete
- ✅ Success notification appears

---

## Test 5: Performance Benchmarks

### Steps:
1. [ ] Open browser DevTools > Performance tab
2. [ ] Start recording
3. [ ] Refresh Zeus Analysis Tool
4. [ ] Stop recording after page loads
5. [ ] Analyze performance metrics
6. [ ] Check FPS during animations
7. [ ] Open DevTools > Memory tab
8. [ ] Take heap snapshot
9. [ ] Analyze memory usage

### Expected Results:
- ✅ Initial render < 50ms
- ✅ Probability calculation < 100ms
- ✅ 60 FPS maintained during animations
- ✅ Memory usage < 50MB
- ✅ No memory leaks after multiple refreshes

---

## Test 6: Error Recovery and Edge Cases

### Test 6.1: WebSocket Disconnection
1. [ ] Open browser DevTools > Network tab
2. [ ] Set throttling to "Offline"
3. [ ] Refresh Zeus Analysis Tool
4. [ ] Verify error message displayed
5. [ ] Verify "Retry Connection" button appears
6. [ ] Set throttling back to "Online"
7. [ ] Click "Retry Connection"
8. [ ] Verify connection restored

### Test 6.2: Insufficient Data
1. [ ] Modify code to limit ticks to < 10
2. [ ] Refresh page
3. [ ] Verify "Insufficient Data" message displayed
4. [ ] Verify message indicates need for more ticks

### Test 6.3: Rapid Updates
1. [ ] Select "Volatility 10 (1s)" market
2. [ ] Observe rapid tick updates
3. [ ] Monitor for 5 minutes
4. [ ] Verify no crashes or freezes
5. [ ] Check memory usage remains stable

### Expected Results:
- ✅ Error messages user-friendly
- ✅ Retry functionality works
- ✅ Insufficient data handled gracefully
- ✅ Rapid updates don't cause memory leaks
- ✅ No unhandled exceptions

---

## Test 7: Responsive Design

### Test 7.1: Mobile (375x667)
1. [ ] Open browser DevTools
2. [ ] Set device to "iPhone SE"
3. [ ] Verify layout adapts to mobile
4. [ ] Verify no horizontal scrolling
5. [ ] Verify touch targets are appropriately sized
6. [ ] Test all interactive elements
7. [ ] Verify text is readable

### Test 7.2: Tablet (768x1024)
1. [ ] Set device to "iPad"
2. [ ] Verify layout adapts to tablet
3. [ ] Verify grid layouts adjust
4. [ ] Test all interactive elements
5. [ ] Verify text is readable

### Test 7.3: Desktop (1920x1080)
1. [ ] Set device to "Desktop"
2. [ ] Verify full layout displayed
3. [ ] Verify optimal use of space
4. [ ] Test all interactive elements

### Expected Results:
- ✅ Mobile: Single column layout, readable text, no horizontal scroll
- ✅ Tablet: 2-column layout, touch-friendly
- ✅ Desktop: Multi-column layout, optimal spacing
- ✅ All viewports: Functional and readable

---

## Test 8: Accessibility Compliance

### Test 8.1: Keyboard Navigation
1. [ ] Close mouse/trackpad
2. [ ] Use Tab key to navigate through all elements
3. [ ] Verify focus indicators visible
4. [ ] Use Enter/Space to activate buttons
5. [ ] Verify all interactive elements accessible
6. [ ] Test "Skip to main content" link

### Test 8.2: Screen Reader
1. [ ] Enable screen reader (NVDA/JAWS/VoiceOver)
2. [ ] Navigate through page
3. [ ] Verify all content announced
4. [ ] Verify ARIA labels present
5. [ ] Verify dynamic alerts announced
6. [ ] Verify form labels associated

### Test 8.3: Color Contrast
1. [ ] Use browser extension (e.g., WAVE, axe DevTools)
2. [ ] Run accessibility audit
3. [ ] Verify all text meets WCAG AA contrast ratios
4. [ ] Check confidence level colors
5. [ ] Check alert colors

### Expected Results:
- ✅ All elements keyboard accessible
- ✅ Focus indicators visible
- ✅ Screen reader announces all content
- ✅ ARIA labels present and correct
- ✅ Color contrast meets WCAG AA
- ✅ No accessibility violations

---

## Test 9: Browser Compatibility

### Test 9.1: Chrome
1. [ ] Open in Chrome (latest version)
2. [ ] Run all tests above
3. [ ] Verify full functionality
4. [ ] Check console for errors

### Test 9.2: Firefox
1. [ ] Open in Firefox (latest version)
2. [ ] Run all tests above
3. [ ] Verify full functionality
4. [ ] Check console for errors

### Test 9.3: Edge
1. [ ] Open in Edge (latest version)
2. [ ] Run all tests above
3. [ ] Verify full functionality
4. [ ] Check console for errors

### Test 9.4: Safari
1. [ ] Open in Safari (latest version)
2. [ ] Run all tests above
3. [ ] Note: Browser notifications require user interaction
4. [ ] Verify other functionality works
5. [ ] Check console for errors

### Expected Results:
- ✅ Chrome: Full functionality
- ✅ Firefox: Full functionality
- ✅ Edge: Full functionality
- ✅ Safari: Full functionality (notifications require interaction)
- ✅ No browser-specific bugs

---

## Test 10: Data Export

### Steps:
1. [ ] Click "Export CSV" button
2. [ ] Verify CSV file downloads
3. [ ] Open CSV in spreadsheet application
4. [ ] Verify headers: Epoch, Quote, Last Digit, Source, Local Time
5. [ ] Verify data matches displayed ticks
6. [ ] Verify all ticks included

### Expected Results:
- ✅ CSV downloads successfully
- ✅ Data formatted correctly
- ✅ All ticks included
- ✅ Headers present

---

## Final Checklist

### Code Quality
- [ ] No console errors in production build
- [ ] No console warnings in production build
- [ ] All TypeScript types correct
- [ ] No linting errors
- [ ] Code formatted consistently

### Documentation
- [ ] README updated with new features
- [ ] API documentation complete
- [ ] User guide available
- [ ] Known issues documented

### Deployment Readiness
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Accessibility compliance verified
- [ ] Browser compatibility confirmed
- [ ] Error handling comprehensive
- [ ] Security review completed

---

## Sign-Off

**Tester Name**: _______________________  
**Date**: _______________________  
**Status**: ☐ APPROVED  ☐ NEEDS WORK  
**Notes**: _______________________

---

## Issues Found

| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## Recommendations

1. 
2. 
3. 

---

**End of Manual Integration Test Checklist**
