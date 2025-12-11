# Fast Lane Polling Fix

## Problem

The subscription-based contract tracking isn't receiving `is_sold` status updates, causing trades to timeout.

## Solution

Replace subscription with **polling** - directly check contract status every 500ms until it completes.

## Implementation

Replace the `trackContract` function with a polling-based approach that:

1. Polls contract status every 500ms
2. Checks if `is_sold` or `status === 'sold'`
3. Returns buy_price, sell_price, profit, and outcome
4. Times out after 5 seconds (10 attempts)

This is more reliable for 1-tick digit trades that complete in 1-2 seconds.
