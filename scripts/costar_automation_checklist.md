# CoStar Automation Checklist

## Step 1: Navigate to Login Page
- Open the CoStar login URL in the browser.

## Step 2: Log In
- Wait for the "Secured Login" heading to appear.
- Fill the first input field with your username/email.
- Fill the second input field with your password.
- Click the button with text **"Login"** to sign in.

## Step 3: Navigate to Properties
- After successful login, wait for the main page to load.
- In the **top navigation bar**, find and click the item labeled **"Properties"**.

## Step 4: Open the Save Dropdown
- On the Properties page (All Properties view), locate the toolbar above the property list containing: "Filters", "Sort", "Save", "Reports", "More".
- Click the button labeled **"Save"**.

## Step 5: Select the Saved Search "VDP Select"
- When the Save dropdown menu opens, locate the saved searches section.
- Click the saved search item labeled exactly **"VDP Select"**.

## Step 6: Switch to Analytics View
- On the All Properties page with "VDP Select" applied, locate the view toggle area in the upper-right.
- Click the tab labeled **"ANALYTICS"** to switch to the Analytics view.

## Step 7: Dismiss the "Composite Methodology" Popup
- When the "Composite Methodology" popup appears:
  - Check/click the **"Don't show me again"** option at the bottom of the popup.
  - Click the button labeled **"Okay, got it"** to dismiss the popup.

## Step 8: Click the "Data" Tab
- After the popup is dismissed and the Analytics view is visible, locate the tab row above the charts: Summary, KPI, Performance, Construction, Sales, Players, Data, Participation.
- Click the tab labeled exactly **"Data"**.

## Step 9: Export Daily Data
- On the Data tab, locate the period dropdown on the left above the table (currently shows "Monthly").
- Click the dropdown and select **"Daily"**.
- Wait for the table to refresh with daily rows.
- In the toolbar above the table, click the button labeled **"Export"**.
- In the dropdown menu that appears, click **"Data Export"**.
- The Daily data file downloads to the browser's default download location (to be redirected to `downloads/` folder).

## Step 10: Export Monthly Data
- After the Daily export completes, click the same period dropdown again.
- Select **"Monthly"**.
- Wait for the table to refresh with monthly rows.
- Click the **"Export"** button again.
- In the dropdown menu, click **"Data Export"** again.
- The Monthly data file downloads to the browser's default download location (to be redirected to `downloads/` folder).

---

## Full Workflow Summary (for Chrome Automation)

1. Navigate to the CoStar login URL.
2. Wait for the "Secured Login" heading; enter username and password; click **"Login"**.
3. Wait for the main page; click **"Properties"** in the top navigation bar.
4. Click the **"Save"** button in the Properties toolbar.
5. In the Save dropdown, click the saved search **"VDP Select"**.
6. In the upper-right view toggle, click **"ANALYTICS"**.
7. When the "Composite Methodology" popup appears: check **"Don't show me again"**, then click **"Okay, got it"**.
8. In the Analytics tab row, click **"Data"**.
9. Click the period dropdown above the table, select **"Daily"**; wait for refresh; click **"Export"** → **"Data Export"** → file saves to `downloads/`.
10. Click the period dropdown again, select **"Monthly"**; wait for refresh; click **"Export"** → **"Data Export"** → file saves to `downloads/`.
