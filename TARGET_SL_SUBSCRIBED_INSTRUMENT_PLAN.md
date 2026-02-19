# Target and Stoploss Subscribed Instrument Feature - Implementation Plan

## Overview
Extend the existing Target and Stoploss functionality to allow users to calculate target/stoploss prices based on either:
- **Current Symbol (Default)**: The symbol being traded (existing behavior)
- **Subscribed Instrument**: Any instrument from the watchlist (new feature)

This mirrors the existing Trigger Source dropdown functionality that already supports subscribed instruments.

---

## Current Implementation

### Trigger Source (Already Working)
- Location: `index.html:4045-4090` (function `updateTriggerSourceDropdowns()`)
- Dropdown populated dynamically with:
  - Base options: `current_symbol`, `fixed`, `ema`, `sma`, `hist_high`, `hist_low`
  - Subscribed Instruments: Fetched from `subscribedScripts` Map
- Format: Uses `<optgroup>` to group instruments

### Target/Stoploss (Current Behavior)
- **New Order Section** (`index.html:3627-3653`):
  - Radio buttons for `%` or `Value`
  - Input field for the value
  - Always calculated based on current symbol's entry price

- **Modify Order Section** (`index.html:3817-3853`):
  - Similar UI for modifying target/stoploss
  - Updates existing order's target/sl prices

---

## Implementation Requirements

### Phase 1: UI Changes - New Order Section
**File:** `index.html:3627-3653`

#### Changes Required:
1. **Add Target Source Dropdown**
   - Add new dropdown `<select id="targetSource">`
   - Options: `current_symbol` (default), `subscribed_instrument`
   - When "Subscribed Instrument" selected, show second dropdown to pick specific instrument

2. **Add Stoploss Source Dropdown**
   - Add new dropdown `<select id="slSource">`
   - Same structure as Target Source

3. **Dynamic Instrument Select (Conditional)**
   - Add `<select id="targetInstrument">` (hidden by default)
   - Add `<select id="slInstrument">` (hidden by default)
   - Populate from `subscribedScripts` Map
   - Show/hide based on source dropdown selection

4. **Update Layout**
   - Restructure the price-input-group to accommodate new dropdowns
   - Maintain existing radio buttons and input fields

### Phase 2: UI Changes - Modify Order Section
**File:** `index.html:3817-3853`

#### Changes Required:
1. **Add Modify Target Source Dropdown**
   - `<select id="modifyTargetSource">` with same options
   - `<select id="modifyTargetInstrument">` for instrument selection

2. **Add Modify SL Source Dropdown**
   - `<select id="modifySLSource">` with same options
   - `<select id="modifySLInstrument">` for instrument selection

3. **Update Layout**
   - Match the structure from New Order section

### Phase 3: JavaScript Logic - Data Model Updates
**File:** `index.html` - OrderSystem module

#### Changes Required:

1. **Update BracketOrder Class** (`index.html:6323-6461`)
   - Add properties to store target/stoploss source info:
     ```javascript
     this.targetSource = config.targetSource || 'current_symbol'; // 'current_symbol' or 'tsym|exch'
     this.slSource = config.slSource || 'current_symbol';
     this.targetInstrument = config.targetInstrument || null; // {tsym, exch, token}
     this.slInstrument = config.slInstrument || null;
     ```

2. **Update Price Calculation Logic**
   - Modify target/sl calculation to check source:
     ```javascript
     calculateTargetPrice() {
       const basePrice = this.targetSource === 'current_symbol' 
         ? this.entryPrice 
         : this.getSubscribedInstrumentPrice(this.targetSource);
       return this.isPercent.target 
         ? basePrice * (1 + this.target / 100) 
         : this.target;
     }
     ```

3. **Add Helper Function: `getSubscribedInstrumentPrice(sourceKey)`**
   - Parse source key (format: "tsym|exch")
   - Lookup price from `subscribedScripts` or `lastPrices` Map
   - Return current LTP or 0 if not found

4. **Store Original Target/SL Configuration**
   - Save raw target/sl values (before calculation) for later modification
   - Store source information for display and modification

### Phase 4: JavaScript Logic - Order Placement
**File:** `index.html:handleUIPlaceOrder()`

#### Changes Required:
1. **Capture New Form Values**
   ```javascript
   const targetSource = document.getElementById('targetSource').value;
   const slSource = document.getElementById('slSource').value;
   const targetInstrument = targetSource !== 'current_symbol' 
     ? document.getElementById('targetInstrument').value 
     : null;
   const slInstrument = slSource !== 'current_symbol' 
     ? document.getElementById('slInstrument').value 
     : null;
   ```

2. **Pass to BracketOrder**
   - Include new config properties when creating BracketOrder instance

### Phase 5: JavaScript Logic - Active Triggers Panel
**File:** `index.html:renderActiveTriggers()`

#### Changes Required:
1. **Update Display Format**
   - Show Target/SL source info in trigger cards
   - Example display:
     ```
     Target: 1% (Current Symbol)
     or
     Target: 1% (NIFTY50)
     ```

2. **Add Real-time Price Monitoring**
   - For subscribed instrument sources, monitor price updates
   - Recalculate target/sl when base instrument price changes

### Phase 6: JavaScript Logic - Modify Order
**File:** `index.html:handleModifyOrder()` (`index.html:6703-6765`)

#### Changes Required:
1. **Capture Modify Form Values**
   - Get new source dropdown values
   - Get instrument selections if applicable

2. **Update Order Properties**
   - Modify `targetSource`, `slSource`, `targetInstrument`, `slInstrument`
   - Recalculate target/sl prices based on new configuration
   - Update trigger conditions if instrument source changed

3. **Handle Source Change Scenarios**
   - If switching from current_symbol to subscribed_instrument: recalculate
   - If switching instrument within subscribed: recalculate with new LTP
   - If switching back to current_symbol: use entryPrice as base

### Phase 7: JavaScript Logic - Trade History Panel
**File:** `index.html:renderCompletedOrders()`

#### Changes Required:
1. **Display Source Information**
   - Show which instrument was used for target/stoploss calculation
   - Format: "Target: 1% (Current)" or "Target: 1% (NIFTY50)"

2. **Store Historical Data**
   - Save target/sl source info when order completes
   - Include in order history for reference

### Phase 8: Price Monitoring and Updates
**File:** `index.html:checkConditions()` and WebSocket handlers

#### Changes Required:
1. **Monitor All Subscribed Instrument Prices**
   - Track prices for instruments used in target/sl calculations
   - Update target/sl prices dynamically as base instrument price changes

2. **Update Trigger Conditions**
   - For orders with subscribed instrument sources:
     - When base instrument price updates → recalculate target/sl
     - Update order's targetPrice and slPrice properties
     - Re-evaluate exit conditions with new prices

### Phase 9: Dropdown Population Functions
**File:** `index.html` - Add new functions

#### New Functions to Create:

1. **`updateTargetSLDropdowns()`**
   - Populate targetSource and slSource dropdowns
   - Options: Current Symbol (Default), Subscribed Instrument
   - Call on page load and when algo tab shown

2. **`updateTargetSLInstrumentDropdowns()`**
   - Populate targetInstrument and slInstrument dropdowns
   - Use `subscribedScripts` Map as source
   - Similar to `updateTriggerSourceDropdowns()` but without base options

3. **`handleTargetSourceChange(sourceType, instrumentSelectId)`**
   - Event handler for source dropdown change
   - Show/hide instrument dropdown based on selection
   - Populate instrument dropdown if needed

4. **`handleSLSourceChange(sourceType, instrumentSelectId)`**
   - Same as above for stoploss

### Phase 10: CSS Styling Updates
**File:** `index.html` (CSS section around line 772, 1461-1473)

#### Changes Required:
1. **Style New Dropdowns**
   - Use existing `.algo-select` class for consistency
   - Add conditional visibility classes:
     ```css
     .instrument-select { display: none; }
     .instrument-select.visible { display: block; }
     ```

2. **Layout Adjustments**
   - Ensure new dropdowns fit within existing price-input-group
   - May need to adjust flex/grid layout

---

## Data Flow Architecture

### Order Creation Flow:
```
User Selects Target/SL Configuration
    ↓
Form Submission (handleUIPlaceOrder)
    ↓
Create BracketOrder with source config
    ↓
Calculate initial target/sl prices
    ↓
Store in activeOrders Map
    ↓
Monitor base instrument price changes
    ↓
Recalculate target/sl when base price updates
    ↓
Check exit conditions with updated prices
```

### Price Update Flow:
```
WebSocket Receives Market Data
    ↓
Update subscribedScripts prices
    ↓
For each active order:
    - Check if targetSource is subscribed instrument
    - Check if slSource is subscribed instrument
    ↓
If base instrument price changed:
    - Recalculate targetPrice and/or slPrice
    - Update order properties
    - Re-render Active Triggers panel
    - Re-evaluate exit conditions
```

### Order Modification Flow:
```
User Opens Modify Order Panel
    ↓
Populate existing source config
    ↓
User Changes Source/Instrument
    ↓
Submit Modification (handleModifyOrder)
    ↓
Update order properties
    ↓
Recalculate target/sl if needed
    ↓
Update trigger conditions
    ↓
Re-render panels
```

---

## Testing Checklist

### New Order Section:
- [ ] Target source dropdown shows "Current Symbol (Default)" and "Subscribed Instrument"
- [ ] Selecting "Subscribed Instrument" shows instrument dropdown
- [ ] Instrument dropdown populated with subscribed scripts
- [ ] Target calculation uses correct base price based on source
- [ ] Same tests for Stoploss source

### Modify Order Section:
- [ ] Can change target source from current to subscribed instrument
- [ ] Can change target instrument within subscribed options
- [ ] Can change stoploss source and instrument
- [ ] Prices recalculate correctly after modification

### Active Triggers Panel:
- [ ] Displays target/sl source information clearly
- [ ] Updates display when source is modified
- [ ] Shows instrument name when using subscribed instrument

### Trade History Panel:
- [ ] Shows target/sl source for completed trades
- [ ] Displays correct information for mixed sources

### Price Monitoring:
- [ ] Target/sl prices update when subscribed instrument price changes
- [ ] Exit conditions evaluated with updated prices
- [ ] No duplicate or missed calculations

### Edge Cases:
- [ ] Order placed when subscribed instrument has no price data
- [ ] Subscribed instrument removed from watchlist while order active
- [ ] Switching between current symbol and subscribed instrument mid-trade
- [ ] Multiple orders with different target/sl sources

---

## Implementation Priority

1. **Phase 1 & 2**: UI changes (New Order and Modify Order sections) - **HIGH**
2. **Phase 9**: Dropdown population functions - **HIGH**
3. **Phase 3**: Data model updates (BracketOrder class) - **HIGH**
4. **Phase 4**: Order placement logic - **HIGH**
5. **Phase 8**: Price monitoring (core functionality) - **HIGH**
6. **Phase 5**: Active Triggers panel updates - **MEDIUM**
7. **Phase 6**: Modify order logic - **MEDIUM**
8. **Phase 7**: Trade history panel updates - **LOW**
9. **Phase 10**: CSS styling refinements - **LOW**

---

## Files to Modify

1. **`index.html`** - Main file containing all changes
   - Lines 3627-3653: New Order target/stoploss UI
   - Lines 3817-3853: Modify Order UI
   - Lines 4045-4090: Add new dropdown population functions
   - Lines 6323-6461: BracketOrder class
   - Lines 6703-6765: handleModifyOrder function
   - Lines around 6800: handleUIPlaceOrder function
   - Lines around 772, 1461-1473: CSS styling

---

## Notes

1. **Backward Compatibility**: Existing orders without source info should default to `current_symbol` behavior
2. **Performance**: Monitor subscribed instrument prices efficiently - don't recalculate all orders on every price tick
3. **User Experience**: Clear labeling to indicate which instrument is being used for calculations
4. **Validation**: Ensure selected instrument exists and has price data before placing order
5. **State Management**: Store source configuration persistently so it survives page refreshes (localStorage if needed)

---

## Example Usage Scenarios

### Scenario 1: Current Symbol (Default)
- User trading NIFTY
- Target: 1% of NIFTY price
- Stoploss: 0.5% of NIFTY price
- **Behavior**: Same as existing - uses NIFTY's entry price

### Scenario 2: Subscribed Instrument
- User trading SBIN
- Target: 1% of NIFTY price (market benchmark)
- Stoploss: 0.5% of SBIN price
- **Behavior**: Target tracks NIFTY's price, SL tracks SBIN's price

### Scenario 3: Cross-Instrument Strategy
- User trading RELIANCE
- Target: 2% of CRUDEOIL price (sector correlation)
- Stoploss: 1% of NIFTY price (market risk)
- **Behavior**: Both target and SL based on different instruments

---

## Risk Assessment

### Low Risk:
- UI changes and dropdown additions
- Display updates in panels
- Styling modifications

### Medium Risk:
- Data model changes to BracketOrder class
- Order modification logic updates

### High Risk:
- Price calculation logic changes
- Real-time price monitoring updates
- Exit condition evaluation with dynamic prices

### Mitigation:
- Thorough testing of all scenarios
- Maintain backward compatibility
- Add validation before placing orders
- Graceful handling of missing price data
