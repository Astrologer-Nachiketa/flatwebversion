# UI Modification Guide for indexprotect.html

This document serves as a reference for all UI modifications made to `indexprotect.html`. Use this guide to understand what was changed and how to revert or modify again.

---

## Table of Contents
1. [Hidden Elements](#hidden-elements)
2. [Visible Elements](#visible-elements)
3. [Modified Elements](#modified-elements)
4. [CSS Classes Added](#css-classes-added)
5. [JavaScript Additions](#javascript-additions)
6. [Mobile Optimization](#mobile-optimization)

---

## Hidden Elements

### 1. Signal URL Input
- **Selector**: `#signalUrlInput`
- **Location**: Line ~3285
- **Method**: Added CSS class `.hidden`
- **Description**: Input field for Signal URL (Upcoming feature)

### 2. Table Columns (Change, EMA, SMA)
- **Selector**: 
  - `.market-table table thead th:nth-child(10)`
  - `.market-table table thead th:nth-child(11)`
  - `.market-table table thead th:nth-child(12)`
  - Corresponding `td` elements
- **Location**: Lines ~974-977
- **Method**: CSS `display: none`
- **Description**: Hides Change, EMA (60), and SMA (60) columns from the market table

### 3. Trigger Type Options (algoTriggerType)
- **Selector**: `#algoTriggerType`
- **Location**: Lines ~3729-3735
- **Method**: Removed option elements from HTML
- **Hidden Options**:
  - `buy_green_ltp_lt_sma` - LTP > High && LTP > EMA > SMA
  - `buy_ltp_gt_ema_gt_sma` - LTP > EMA > SMA
  - `buy_ema_gt_sma_and_ema_minus_ltp_gt_1pct` - EMA > SMA and (EMA - LTP > 1%)
  - `reversal_buy` - Reversal Buy
  - `reversal_sell` - Reversal Sell
  - `trade_ratio_gt_ema_gt_sma` - Trade Ratio > EMA > SMA (duplicate)
  - `trade_ratio_lt_sma_lt_ema` - Trade Ratio < SMA < EMA (duplicate)
- **Description**: Only 5 basic trigger options remain

### 4. Trigger Type Options (algoTriggerType2 - Second Trigger)
- **Selector**: `#algoTriggerType2`
- **Location**: Lines ~3773-3778
- **Method**: Removed option elements from HTML
- **Same hidden options as above**
- **Description**: Second trigger has same limited options

### 5. TradingView Condition Section
- **Selector**: `.condition-group.tv-condition`
- **Location**: Lines ~3806-3820
- **Method**: Added `style="display:none;"`
- **Description**: AND TradingView (upcoming) section

### 6. Signal Condition Section
- **Selector**: `.condition-group.signal-condition`
- **Location**: Lines ~3823-3838
- **Method**: Added `style="display:none;"`
- **Description**: AND Signal (Upcoming) section

### 7. AutoPlaceOrder Toggle
- **Selector**: `div` containing `#autoPlaceOrderToggle`
- **Location**: Lines ~3635-3640
- **Method**: Added `style="display:none;"`
- **Description**: AutoPlaceOrder checkbox and label

### 8. Debug Console (Default Hidden)
- **Selector**: `#debugConsole`
- **Location**: Line ~3939
- **Method**: Added CSS class `.hidden`
- **Description**: Debug console is hidden by default, shown via toggle button

---

## Visible Elements

### 1. New Order Section
- **Selector**: `.algo-column-left`
- **Location**: Lines ~3644-3725
- **Method**: Visible by default
- **Description**: Contains Symbol, Direction, Quantity, Target, Stoploss fields

### 2. Trailing SL
- **Selector**: `#trailingSL`
- **Location**: Line ~3718
- **Method**: Visible by default

### 3. Repeat (on SL)
- **Selector**: `#repeatCount`
- **Location**: Line ~3723
- **Method**: Visible with `max="2"` attribute
- **Description**: Limited to maximum value of 2

### 4. Trigger Type (5 basic options)
- **Selector**: `#algoTriggerType`
- **Location**: Lines ~3729-3735
- **Method**: Visible
- **Available Options**:
  - No Trigger
  - Buy Above
  - Buy Below
  - Sell Above
  - Sell Below

### 5. Trigger Source
- **Selector**: `#algoTriggerValueSource`
- **Location**: Lines ~3738-3748
- **Method**: Visible (CSS hide rule removed)

### 6. Trigger Value
- **Selector**: `#algoTriggerValue`
- **Location**: Lines ~3750-3754
- **Method**: Visible

### 7. Second Trigger Section
- **Selector**: `.condition-group.second-trigger`
- **Location**: Lines ~3765-3796
- **Method**: Visible

### 8. Trigger 2 Source
- **Selector**: `#algoTriggerValueSource2`
- **Location**: Lines ~3780-3790
- **Method**: Visible

### 9. Trigger 2 Value
- **Selector**: `#algoTriggerValue2`
- **Location**: Lines ~3792-3795
- **Method**: Visible

---

## Modified Elements

### 1. Developer Contact Text
- **Location**: Line ~3292
- **Original**: `Developer: visit https://sharkscalper.onrender.com/ - For queries and assistance`
- **Modified**: `Developer: visit https://sharkscalper.onrender.com/ - For queries and assistance call 9222292111`
- **Description**: Added phone number

### 2. Repeat Count Validation
- **Selector**: `#repeatCount`
- **Location**: Line ~3723
- **Changes**:
  - Added `max="2"` attribute
  - Added JavaScript validation (see JavaScript Additions)
- **Description**: Limits repeat count to maximum of 2

---

## CSS Classes Added

### `.hidden`
```css
.hidden { display: none !important; }
```
- Used for: `#signalUrlInput`, `#debugConsole`

### Table Column Hiding
```css
.market-table table thead th:nth-child(10),
.market-table table thead th:nth-child(11),
.market-table table thead th:nth-child(12),
.market-table table tbody td:nth-child(10),
.market-table table tbody td:nth-child(11),
.market-table table tbody td:nth-child(12) {
    display: none;
}
```

---

## JavaScript Additions

### 1. Repeat Count Validation
```javascript
document.addEventListener('DOMContentLoaded', function() {
    var repeatCountInput = document.getElementById('repeatCount');
    if(repeatCountInput) {
        repeatCountInput.addEventListener('change', function() {
            if(parseInt(this.value) > 2) this.value = 2;
            if(parseInt(this.value) < 0) this.value = 0;
        });
    }
});
```
- **Location**: Lines ~3967-3977
- **Purpose**: Validates that repeat count doesn't exceed 2

### 2. Debug Console Toggle
```javascript
function toggleDebugConsole() {
    var debugConsole = document.getElementById('debugConsole');
    debugConsole.classList.toggle('hidden');
}
```
- **Location**: Lines ~3979-3982
- **Purpose**: Show/hide debug console

### 3. Debug Console Toggle Button
- **Location**: Line ~3938
- **HTML**: `<button onclick="toggleDebugConsole()" style="margin-left:10px;padding:4px 8px;font-size:11px;">Show/Hide</button>`
- **Description**: Button added next to "Debug Console" heading

---

## Mobile Optimization

Added responsive CSS for screens ≤768px:

```css
@media (max-width: 768px) {
    .algo-columns-container { flex-direction: column; }
    .algo-column-left, .algo-column-right { min-width: 100%; }
    .cred-input, .algo-input, .algo-select { font-size: 14px; padding: 10px; }
    .tab-bar { flex-wrap: wrap; }
    .tab-btn { padding: 10px 12px; font-size: 12px; }
    .input-group { flex-direction: column; align-items: flex-start; gap: 5px; }
    .algo-label { width: 100%; }
    .algo-input, .algo-select { width: 100%; }
    #debugConsole { max-height: 120px; font-size: 10px; }
}
```

**Features**:
- Column stacking for algo sections
- Larger touch targets (14px font, 10px padding)
- Wrapping tabs
- Full-width inputs on mobile
- Smaller debug console

---

## Quick Reference - How to Revert

| To Show/Hide | Action |
|--------------|--------|
| Signal URL | Remove/add `.hidden` class on `#signalUrlInput` |
| Table columns 10-12 | Add/remove `display: none` in CSS |
| Trigger options | Add/remove `<option>` elements in HTML |
| TradingView section | Add/remove `style="display:none;"` |
| Signal section | Add/remove `style="display:none;"` |
| AutoPlaceOrder | Add/remove `style="display:none;"` |
| Debug Console | Add/remove `.hidden` class or change button default |
| Repeat max 2 | Modify/remove `max="2"` attribute and JS validation |
| Developer phone | Edit text in the div at cred-box section |

---

## File Information
- **File**: `indexprotect.html`
- **Last Updated**: Based on user requests
- **Purpose**: Cosmetic UI modifications without breaking functionality
