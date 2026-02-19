# UI Modification Plan for indexprotect.html

## Objective
Make cosmetic UI changes to hide/disable certain features without breaking existing functionality.

---

## Changes Required

### 1. Hide `#signalUrlInput` (line 3284)
- **Method**: Add CSS class `.hide { display: none; }`
- **Target**: `<input type="text" id="signalUrlInput" ...>`

### 2. Modify Developer Contact Text (line 3292)
- **Current**: `Developer: visit https://sharkscalper.onrender.com/ - For queries and assistance`
- **New**: `Developer: visit https://sharkscalper.onrender.com/ - For queries and assistance call 9222292111`
- **Location**: `div style="margin-top: 10px; font-size: 14px; color: #666;"`

### 3. Hide Table Headers (th[10], th[11], th[12])
- **Target**: `<th>Change</th>`, `<th>EMA (60)</th>`, `<th>SMA (60)</th>` (lines 3362-3364)
- **Method**: Add CSS to hide these columns in both `<th>` and corresponding `<td>`
- **Selector**: `th:nth-child(10), th:nth-child(11), th:nth-child(12)` and `td:nth-child(10), td:nth-child(11), td:nth-child(12)`

### 4. Hide Options in `#algoTriggerType` (lines 3711-3720)
- **Target**: Options 6-14 in dropdown (indices 5-13)
- **Current options to hide**:
  - `buy_green_ltp_lt_sma` (line 3711)
  - `buy_ltp_gt_ema_gt_sma` (line 3712)
  - `buy_ema_gt_sma_and_ema_minus_ltp_gt_1pct` (line 3713-3714)
  - `reversal_buy` (line 3715)
  - `reversal_sell` (line 3716)
  - `trade_ratio_gt_ema_gt_sma` (line 3717, 3719 - duplicate)
  - `trade_ratio_lt_sma_lt_ema` (line 3718, 3720 - duplicate)
- **Method**: Remove these `<option>` elements from the HTML or add JS to hide them

### 5. Hide Feature - Label at `/html/body/div[6]/div[5]/div[2]/label`
- **Context**: Need to verify exact element - likely in algo trading section
- **Method**: CSS `display: none;`

### 6. Lock `#repeatCount` to Max 2 (line 3699)
- **Current**: `<input type="number" id="repeatCount" ...>`
- **Changes**:
  - Add `max="2"` attribute
  - Add JavaScript validation: `if (value > 2) value = 2;`

### 7. Hide div[2] in div[11] (in algo section)
- **Context**: Inside `#algo` tab, likely around Trigger Type/Source area
- **Method**: CSS `display: none;` with specific ID/class

### 8. Hide div[3] in div[11] (in algo section)
- **Context**: Similar to item 7
- **Method**: CSS `display: none;` with specific ID/class

### 9. Add Toggle Button for Debug Console
- **Current**: `<div id="debugConsole">` (line 3927)
- **Changes**:
  - Add a toggle button next to `<h3>🐞 Debug Console</h3>` (line 3926)
  - Default state: Hidden
  - Button text: "Show/Hide Debug Console"
  - JavaScript: Toggle `display: none/block` on click

---

## Implementation Notes

1. All changes are **cosmetic only** - no logic changes to existing functionality
2. Use CSS go ahead classes for hiding elements (`.hidden { display: none !important; }`)
3. Test that table columns align properly after hiding
4. Ensure JavaScript validation for repeatCount doesn't break saving/loading

---

## Files to Modify
- `indexprotect.html` only
