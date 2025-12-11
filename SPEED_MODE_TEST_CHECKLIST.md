# Speed Mode - Testing Checklist

## 🧪 Pre-Deployment Testing Checklist

### ✅ Environment Setup

-   [ ] Deriv account created (demo recommended)
-   [ ] Logged into Deriv platform
-   [ ] Account token available in localStorage
-   [ ] Sufficient demo balance ($100+)
-   [ ] Browser console open for monitoring

### ✅ Component Visibility

-   [ ] Navigate to Bot Builder tab
-   [ ] Speed Mode toggle visible
-   [ ] Toggle is clickable
-   [ ] Description text displays correctly

### ✅ Configuration Panel

-   [ ] Click "Show Config" button
-   [ ] Configuration panel opens
-   [ ] All dropdowns populate correctly
-   [ ] Market selector shows 8 options
-   [ ] Strategy selector shows 4 options
-   [ ] Trade type selector shows 4 options
-   [ ] Stake input accepts values
-   [ ] Target runs input accepts values
-   [ ] Duration inputs work (number + type)
-   [ ] Stop loss input accepts values
-   [ ] Take profit input accepts values
-   [ ] Account balance displays correctly
-   [ ] Risk warning shows

### ✅ Input Validation

-   [ ] Stake limited to max (10% balance or $100)
-   [ ] Stake minimum is $0.35
-   [ ] Target runs: 1-100
-   [ ] Duration: 1-10 for ticks, 1-60 for minutes
-   [ ] Stop loss: 0 to 50% of balance
-   [ ] Take profit: any positive value
-   [ ] Invalid inputs show feedback

### ✅ API Connection

-   [ ] Click "Start Speed Trading"
-   [ ] Status changes to "Connecting..."
-   [ ] Orange dot shows during connection
-   [ ] Connection succeeds
-   [ ] Status changes to "Running"
-   [ ] Green dot shows when running
-   [ ] No console errors

### ✅ Trade Execution - Momentum Strategy

-   [ ] Select Momentum strategy
-   [ ] Set stake to $0.35
-   [ ] Set target runs to 3
-   [ ] Start trading
-   [ ] Ticks stream in
-   [ ] Current tick displays
-   [ ] Trades execute automatically
-   [ ] Stats update after each trade
-   [ ] Last trade card shows results
-   [ ] Notifications appear
-   [ ] Progress bar updates

### ✅ Trade Execution - Reversal Strategy

-   [ ] Select Reversal strategy
-   [ ] Set stake to $0.50
-   [ ] Set target runs to 3
-   [ ] Start trading
-   [ ] Verify different predictions than Momentum
-   [ ] Trades execute
-   [ ] Results display correctly

### ✅ Trade Execution - Scalping Strategy

-   [ ] Select Scalping strategy
-   [ ] Set stake to $0.35
-   [ ] Set target runs to 5
-   [ ] Start trading
-   [ ] Verify digit-based predictions
-   [ ] Trades execute quickly
-   [ ] Results accurate

### ✅ Trade Execution - Zeus AI Strategy

-   [ ] Select Zeus AI strategy
-   [ ] Set stake to $1.00
-   [ ] Set target runs to 3
-   [ ] Start trading
-   [ ] Verify AI predictions
-   [ ] Trades execute
-   [ ] Results display

### ✅ Trade Types

-   [ ] Test DIGITEVEN
    -   [ ] Trades execute
    -   [ ] Results correct
-   [ ] Test DIGITODD
    -   [ ] Trades execute
    -   [ ] Results correct
-   [ ] Test DIGITMATCH
    -   [ ] Trades execute
    -   [ ] Prediction digit used
    -   [ ] Results correct
-   [ ] Test DIGITDIFF
    -   [ ] Trades execute
    -   [ ] Prediction digit used
    -   [ ] Results correct

### ✅ Markets

-   [ ] Test R_10
-   [ ] Test R_25
-   [ ] Test R_50
-   [ ] Test R_75
-   [ ] Test R_100
-   [ ] Test 1HZ10V
-   [ ] Test 1HZ25V
-   [ ] Test 1HZ50V

### ✅ Risk Management

-   [ ] Set stop loss to $5
-   [ ] Start trading with $1 stake
-   [ ] Verify stops when loss reaches $5
-   [ ] Set take profit to $10
-   [ ] Start trading
-   [ ] Verify stops when profit reaches $10
-   [ ] Test both limits together

### ✅ Stats Tracking

-   [ ] Runs count increments
-   [ ] Wins count increments on win
-   [ ] Losses count increments on loss
-   [ ] Profit updates correctly
-   [ ] Profit shows green when positive
-   [ ] Profit shows red when negative
-   [ ] Win rate calculates correctly

### ✅ Trade Results Display

-   [ ] Last trade card appears
-   [ ] Contract ID displays
-   [ ] Buy price shows correctly
-   [ ] Payout shows correctly
-   [ ] Profit/loss calculates correctly
-   [ ] Green card for wins
-   [ ] Red card for losses
-   [ ] Card updates for each trade

### ✅ Notifications

-   [ ] Win notification shows (green)
-   [ ] Loss notification shows (red)
-   [ ] Notification displays profit/loss
-   [ ] Notification auto-dismisses
-   [ ] Multiple notifications queue properly
-   [ ] Notifications don't overlap

### ✅ Stop Functionality

-   [ ] Click "Stop Trading" button
-   [ ] Trading stops immediately
-   [ ] WebSocket closes
-   [ ] Status changes to "Stopped"
-   [ ] Red dot shows
-   [ ] Final stats display
-   [ ] Can restart after stopping

### ✅ Auto-Stop Conditions

-   [ ] Stops when target runs reached
-   [ ] Stops when stop loss hit
-   [ ] Stops when take profit achieved
-   [ ] Displays appropriate message
-   [ ] Stats preserved

### ✅ Error Handling

-   [ ] Test with no auth token
    -   [ ] Error message displays
    -   [ ] User informed clearly
-   [ ] Test with insufficient balance
    -   [ ] Error message displays
    -   [ ] Trading doesn't start
-   [ ] Test with network disconnect
    -   [ ] Error handled gracefully
    -   [ ] User can retry
-   [ ] Test with invalid market
    -   [ ] Error message displays
    -   [ ] Fallback behavior works

### ✅ Balance Updates

-   [ ] Initial balance correct
-   [ ] Balance updates after wins
-   [ ] Balance updates after losses
-   [ ] Balance persists during session
-   [ ] Balance refreshes on reconnect

### ✅ UI/UX

-   [ ] All buttons clickable
-   [ ] Hover states work
-   [ ] Focus states visible
-   [ ] Loading states show
-   [ ] Disabled states work
-   [ ] Animations smooth
-   [ ] Colors consistent
-   [ ] Typography readable
-   [ ] Icons display correctly
-   [ ] Spacing appropriate

### ✅ Responsive Design

-   [ ] Test on desktop (1920x1080)
-   [ ] Test on laptop (1366x768)
-   [ ] Test on tablet (768x1024)
-   [ ] Test on mobile (375x667)
-   [ ] All elements visible
-   [ ] No horizontal scroll
-   [ ] Touch targets adequate
-   [ ] Text readable
-   [ ] Buttons accessible

### ✅ Performance

-   [ ] Page loads quickly
-   [ ] No lag during trading
-   [ ] Smooth animations
-   [ ] No memory leaks
-   [ ] WebSocket stable
-   [ ] CPU usage reasonable
-   [ ] No console warnings
-   [ ] No console errors

### ✅ Browser Compatibility

-   [ ] Chrome (latest)
-   [ ] Firefox (latest)
-   [ ] Safari (latest)
-   [ ] Edge (latest)
-   [ ] Mobile Chrome
-   [ ] Mobile Safari

### ✅ Accessibility

-   [ ] Keyboard navigation works
-   [ ] Tab order logical
-   [ ] Focus indicators visible
-   [ ] ARIA labels present
-   [ ] Screen reader compatible
-   [ ] Color contrast sufficient
-   [ ] Text scalable

### ✅ Security

-   [ ] No tokens in console
-   [ ] No sensitive data logged
-   [ ] WSS connection used
-   [ ] Requests timeout properly
-   [ ] Error messages sanitized
-   [ ] No XSS vulnerabilities

### ✅ Edge Cases

-   [ ] Test with $0.35 stake (minimum)
-   [ ] Test with maximum stake
-   [ ] Test with 1 target run
-   [ ] Test with 100 target runs
-   [ ] Test rapid start/stop
-   [ ] Test config changes while running
-   [ ] Test multiple sessions
-   [ ] Test after browser refresh

### ✅ Integration

-   [ ] Works with existing Bot Builder
-   [ ] Doesn't interfere with other features
-   [ ] Shares Deriv session correctly
-   [ ] Respects account settings
-   [ ] Integrates with theme
-   [ ] Works with other tabs

### ✅ Documentation

-   [ ] User guide accurate
-   [ ] Quick start clear
-   [ ] Architecture documented
-   [ ] Code commented
-   [ ] Examples provided
-   [ ] Troubleshooting helpful

## 📊 Test Results Template

```
Test Date: _______________
Tester: _______________
Environment: [ ] Demo [ ] Real
Browser: _______________
Device: _______________

Results:
✅ Passed: ___ / ___
❌ Failed: ___ / ___
⚠️ Issues: ___ / ___

Critical Issues:
1. _______________
2. _______________

Minor Issues:
1. _______________
2. _______________

Notes:
_______________
_______________
_______________

Overall Status: [ ] PASS [ ] FAIL [ ] NEEDS WORK
```

## 🚨 Critical Test Scenarios

### Scenario 1: Basic Trading Flow

1. Enable Speed Mode
2. Configure with defaults
3. Start trading
4. Complete 5 runs
5. Verify all stats correct
6. Stop trading

**Expected**: All trades execute, stats accurate, no errors

### Scenario 2: Risk Management

1. Set stop loss $5
2. Set stake $2
3. Start trading
4. Wait for stop loss trigger

**Expected**: Stops automatically at -$5

### Scenario 3: Error Recovery

1. Start trading
2. Disconnect internet
3. Reconnect
4. Verify recovery

**Expected**: Graceful error, can restart

### Scenario 4: Multiple Strategies

1. Test each strategy
2. Compare results
3. Verify different behaviors

**Expected**: Each strategy produces different predictions

### Scenario 5: Mobile Experience

1. Open on mobile
2. Complete full trading cycle
3. Test all interactions

**Expected**: Fully functional on mobile

## ✅ Sign-Off

-   [ ] All critical tests passed
-   [ ] No blocking issues
-   [ ] Documentation complete
-   [ ] Ready for deployment

**Tested By**: ******\_\_\_******  
**Date**: ******\_\_\_******  
**Signature**: ******\_\_\_******

---

## 📝 Notes

-   Always test with demo account first
-   Document any issues found
-   Retest after fixes
-   Get peer review before production
-   Monitor first production trades closely
