# Testing Guide - VAT & Quarterly Breakdown

## Quick Test Checklist

### 1. **Check Current Quarter Detection**
- Open the app and go to **Analytics** tab
- Look at the "VAT to Pay per Quarter" section
- The current quarter should have:
  - Orange border around the card
  - "Current" badge next to the quarter name
  - Example: If it's January-March, Q1 should be highlighted

### 2. **Test VAT Calculation on New Sale**
- Go to **Inventory** tab
- Click on an item that's "In Stock"
- Click the sell button (dollar sign icon)
- Enter a sell price (e.g., €100)
- Set the date to **January 1, 2025 or later** (to trigger VAT)
- You should see:
  - **Gross Price (incl. VAT)**: €100.00
  - **VAT (21%)**: €17.36
  - **Net Price (excl. VAT)**: €82.64
- Click "Confirm Sale"
- The item should move to "Sold Items"

### 3. **Test VAT on Pre-VAT Date (No VAT)**
- Sell another item with date **before January 1, 2025** (e.g., December 15, 2024)
- You should see:
  - **Gross Price (incl. VAT)**: €100.00
  - **VAT not applicable** message
- No VAT is calculated for sales before your KVK registration

### 4. **Check Quarterly Breakdown**
- Go to **Analytics** tab
- Scroll to "VAT Analysis" section
- You should see:
  - **Total VAT to Pay (All Quarters)**: Sum of all quarters
  - **VAT to Pay per Quarter**: Individual cards for each quarter with sales
  - **Quarterly VAT Breakdown (Detailed)**: Table with all details

### 5. **Test Multiple Quarters**
- Add sales in different quarters:
  - Q1: January 15, 2025
  - Q2: April 20, 2025
  - Q3: July 10, 2025
  - Q4: October 5, 2025
- Each sale should appear in its respective quarter
- Check that VAT amounts are calculated correctly for each

### 6. **Verify Data Persistence**
- Add a sale
- Close the app completely
- Reopen the app
- Go to **Analytics** tab
- Your sale should still be there with VAT calculated
- The quarterly breakdown should show your saved data

### 7. **Check Item Details**
- Go to **Inventory** tab
- Click on a sold item (in "Sold Items" section)
- You should see:
  - Gross Price (incl. VAT)
  - VAT amount (if applicable)
  - Net Price (excl. VAT)
  - Profit

### 8. **Test Update Existing Items**
- Click "Update Profits" button in the header
- This should:
  - Calculate VAT for any existing sales that don't have it
  - Update profit calculations
  - Show a success message

### 9. **Verify Calculations**
Test with known values:
- Sale price: €121.00 (including VAT)
  - VAT (21%): €21.00
  - Net: €100.00
- Sale price: €100.00 (including VAT)
  - VAT (21%): €17.36
  - Net: €82.64

### 10. **Check Current Quarter Updates**
- If you're in Q1 (Jan-Mar), Q1 should be highlighted
- When calendar hits April 1st, Q2 should automatically become highlighted
- Previous quarters remain visible but not highlighted

## Expected Results

✅ **VAT Calculation**: 21% VAT calculated correctly for sales from Jan 1, 2025 onwards
✅ **Quarter Detection**: Current quarter automatically detected and highlighted
✅ **Data Persistence**: All sales saved and VAT calculated on app restart
✅ **Quarterly Breakdown**: Sales grouped correctly by quarter
✅ **UI Display**: Current quarter has orange border and "Current" badge
✅ **Historical Sales**: Sales before Jan 1, 2025 show no VAT (as expected)

## Common Issues & Solutions

### Issue: VAT not showing
- **Solution**: Make sure sale date is January 1, 2025 or later
- **Solution**: Click "Update Profits" to calculate VAT for existing items

### Issue: Current quarter not highlighted
- **Solution**: Check your PC's system date is correct
- **Solution**: Refresh the app (close and reopen)

### Issue: Sales not appearing in quarterly breakdown
- **Solution**: Make sure sale date is January 1, 2025 or later
- **Solution**: Check the item status is "sold" (not "in-stock" or "traded")

### Issue: Wrong VAT amount
- **Solution**: VAT is calculated as: `sellPrice × 0.21 / 1.21`
- **Solution**: Make sure you're entering the price INCLUDING VAT

## Quick Test Commands

1. **Add test sale with VAT**:
   - Item: Test Item
   - Sell Price: €121
   - Date: January 15, 2025
   - Expected VAT: €21.00
   - Expected Net: €100.00

2. **Add test sale without VAT**:
   - Item: Test Item 2
   - Sell Price: €100
   - Date: December 15, 2024
   - Expected VAT: €0.00 (not applicable)

3. **Check quarterly totals**:
   - Add 3 sales in Q1 (Jan-Mar 2025)
   - Add 2 sales in Q2 (Apr-Jun 2025)
   - Check that totals are correct for each quarter

