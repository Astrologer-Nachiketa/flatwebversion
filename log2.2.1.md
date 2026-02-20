# Changelog - Version 2.2.1

## Summary of Changes

### 1. Schedule Trigger Feature
- Added "Trigger Mode" radio buttons: **Timeout** and **Schedule**
- Added schedule time inputs (In Time / Out Time)
- Triggers now show "😴 Sleeping" badge when waiting for scheduled time
- Triggers auto-cancel if condition is already met during sleep mode
- Triggers expire after Out Time if not triggered
- Fixed: Triggers wake up properly at In Time instead of canceling

### 2. Historical SL Feature
- Added **"Hist. High"** and **"Hist. Low"** radio buttons for SL only
- **Direction-based filtering:**
  - BUY direction: Shows %, Value, Hist Low only (Hist High hidden)
  - SELL direction: Shows %, Value, Hist High only (Hist Low hidden)
- Auto-populates SL input with historical value when selected
- Updates when symbol or SL source changes
- Resets to default value "1" when switching from historical to %/Value

### 3. Trailing SL with Historical
- **BUY + Hist Low + Trailing:** Updates if new hist_low > previous (moves up - favorable)
- **SELL + Hist High + Trailing:** Updates if new hist_high < previous (moves down - favorable)
- Works with both "Current Symbol" and "Subscribed Instrument" sources

### 4. Real-time Updates
- SL prices update every 1 second based on historical data
- Properly uses `slInstrument` when SL Source is "Subscribed"
- checkConditions() also updated to use correct instrument for historical SL

### 5. Bug Fixes
- Fixed syntax error (duplicate braces) that broke user authentication
- Fixed: `pendingEntryTriggers` not accessible from outside OrderSystem
- Added proper exposures for `pendingTriggers` and `renderActiveTriggers`

### 6. UI Enhancements
- Added CSS for sleeping triggers (purple/blue styling)
- Added `.trigger-schedule-info` class for displaying schedule times
- Added sleeping badge in active triggers display

---

## Technical Details

### New Properties Added to Trigger Object
- `triggerMode`: "timeout" | "schedule"
- `scheduleInTime`: HH:MM (when trigger becomes active)
- `scheduleOutTime`: HH:MM (when trigger expires)
- `triggerStatus`: "active" | "sleeping"

### New Properties Added to BracketOrder
- `slType`: "percent" | "value" | "hist_high" | "hist_low"

### Key Functions Modified
- `evaluateSingleTrigger()` - Added handling for 'current_symbol' source
- `checkPendingTriggersForSymbol()` - Added sleeping mode logic
- `updatePrices()` - Added historical SL handling
- `checkConditions()` - Added real-time historical SL updates
- `updateTrailingSL()` - Added historical trailing logic
- `handleModifyOrder()` - Added slType handling

### Key Functions Added
- `toggleTriggerMode()` - Switch between Timeout/Schedule UI
- `handleSLHistoricalTypeChange()` - Auto-populate historical value
- `handleDirectionChangeForSLHistorical()` - Show/hide options by direction
- `handleSymbolChangeForSLHistorical()` - Update on symbol change
- `handleDirectionChangeForSLHistorical()` - Initialize direction-based options

---

## Files Modified
- `index.html` - All changes applied to this single file
