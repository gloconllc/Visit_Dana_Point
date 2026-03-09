/**
 * CoStar / STR Data Export Automation
 * ------------------------------------
 * Automates the 10-step flow to log in to CoStar, apply the "VDP Select"
 * saved search, navigate to Analytics → Data, and download both the Daily
 * and Monthly data exports into the project's downloads/ folder.
 *
 * Prerequisites:
 *   npm install -D playwright
 *   npx playwright install chromium
 *
 * Configuration (environment variables — never hard-code credentials):
 *   COSTAR_URL      Full login URL  (required)
 *   COSTAR_USER     Your username / email  (required)
 *   COSTAR_PASS     Your password  (required)
 *
 * Usage:
 *   COSTAR_URL="https://..." COSTAR_USER="you@example.com" COSTAR_PASS="secret" \
 *     node scripts/costar_export.js
 *
 *   Or store vars in a local .env file and load with:
 *     node --env-file=.env scripts/costar_export.js
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const COSTAR_URL  = process.env.COSTAR_URL;
const COSTAR_USER = process.env.COSTAR_USER;
const COSTAR_PASS = process.env.COSTAR_PASS;

if (!COSTAR_URL || !COSTAR_USER || !COSTAR_PASS) {
  console.error('ERROR: Set COSTAR_URL, COSTAR_USER, and COSTAR_PASS environment variables.');
  process.exit(1);
}

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const DOWNLOADS   = path.resolve(__dirname, '../downloads');
const TIMEOUT_MS  = 30_000; // max wait per step

// Ensure downloads/ exists at runtime too
fs.mkdirSync(DOWNLOADS, { recursive: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Timestamp string for file naming: YYYYMMDD_HHMMSS */
function timestamp() {
  return new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
}

/**
 * Wait for a download triggered by `action`, save it into downloads/ with
 * a timestamped prefix, and return the saved file path.
 */
async function captureDownload(page, action, label) {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: TIMEOUT_MS }),
    action(),
  ]);
  const suggestedName = download.suggestedFilename() || `${label}.csv`;
  const ext           = path.extname(suggestedName) || '.csv';
  const savePath      = path.join(DOWNLOADS, `${timestamp()}_${label}${ext}`);
  await download.saveAs(savePath);
  console.log(`  Saved: ${savePath}`);
  return savePath;
}

// ---------------------------------------------------------------------------
// Main automation
// ---------------------------------------------------------------------------

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',   // use installed Google Chrome; falls back to Chromium
    headless: false,     // set true for fully silent / CI runs
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT_MS);

  try {
    // ------------------------------------------------------------------
    // Step 1: Navigate to login page
    // ------------------------------------------------------------------
    console.log('Step 1: Navigating to CoStar login…');
    await page.goto(COSTAR_URL, { waitUntil: 'domcontentloaded' });

    // ------------------------------------------------------------------
    // Step 2: Log in
    // ------------------------------------------------------------------
    console.log('Step 2: Logging in…');
    await page.waitForSelector('text=Secured Login', { timeout: TIMEOUT_MS });

    const inputs = page.locator('input');
    await inputs.nth(0).fill(COSTAR_USER);
    await inputs.nth(1).fill(COSTAR_PASS);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    // ------------------------------------------------------------------
    // Step 3: Navigate to Properties
    // ------------------------------------------------------------------
    console.log('Step 3: Clicking Properties in top nav…');
    await page.getByRole('navigation').getByText('Properties').click();
    await page.waitForLoadState('networkidle');

    // ------------------------------------------------------------------
    // Step 4: Open the Save dropdown
    // ------------------------------------------------------------------
    console.log('Step 4: Opening Save dropdown…');
    await page.getByRole('button', { name: 'Save' }).click();

    // ------------------------------------------------------------------
    // Step 5: Select saved search "VDP Select"
    // ------------------------------------------------------------------
    console.log('Step 5: Selecting "VDP Select" saved search…');
    await page.getByText('VDP Select').click();
    await page.waitForLoadState('networkidle');

    // ------------------------------------------------------------------
    // Step 6: Switch to Analytics view
    // ------------------------------------------------------------------
    console.log('Step 6: Switching to ANALYTICS view…');
    await page.getByRole('tab', { name: 'ANALYTICS' }).click();
    await page.waitForLoadState('networkidle');

    // ------------------------------------------------------------------
    // Step 7: Dismiss "Composite Methodology" popup (if present)
    // ------------------------------------------------------------------
    console.log('Step 7: Handling Composite Methodology popup…');
    try {
      const popup = page.locator('text=Composite Methodology');
      await popup.waitFor({ timeout: 5_000 });

      // Check "Don't show me again" if present and unchecked
      const dontShow = page.locator('text=Don\'t show me again');
      if (await dontShow.isVisible()) {
        await dontShow.click();
      }
      await page.getByRole('button', { name: "Okay, got it" }).click();
      console.log('  Popup dismissed.');
    } catch {
      console.log('  Popup not present — skipping.');
    }

    // ------------------------------------------------------------------
    // Step 8: Click the "Data" tab
    // ------------------------------------------------------------------
    console.log('Step 8: Clicking Data tab…');
    await page.getByRole('tab', { name: 'Data' }).click();
    await page.waitForLoadState('networkidle');

    // ------------------------------------------------------------------
    // Step 9: Export Daily data
    // ------------------------------------------------------------------
    console.log('Step 9: Exporting Daily data…');

    // Select "Daily" from the period dropdown
    const periodDropdown = page.locator('select, [role="combobox"], [role="listbox"]')
      .filter({ hasText: /Monthly|Daily/i })
      .first();
    await periodDropdown.click();
    await page.getByRole('option', { name: 'Daily' }).click();
    await page.waitForLoadState('networkidle');

    // Export → Data Export
    await page.getByRole('button', { name: 'Export' }).click();
    await captureDownload(
      page,
      () => page.getByRole('menuitem', { name: 'Data Export' }).click(),
      'STR_Daily'
    );

    // ------------------------------------------------------------------
    // Step 10: Export Monthly data
    // ------------------------------------------------------------------
    console.log('Step 10: Exporting Monthly data…');

    await periodDropdown.click();
    await page.getByRole('option', { name: 'Monthly' }).click();
    await page.waitForLoadState('networkidle');

    await page.getByRole('button', { name: 'Export' }).click();
    await captureDownload(
      page,
      () => page.getByRole('menuitem', { name: 'Data Export' }).click(),
      'STR_Monthly'
    );

    console.log('\nDone. Both files saved to downloads/');

  } catch (err) {
    console.error('\nAutomation failed:', err.message);
    // Save a screenshot to help diagnose failures
    const shot = path.join(DOWNLOADS, `error_${timestamp()}.png`);
    await page.screenshot({ path: shot, fullPage: true });
    console.error(`Screenshot saved: ${shot}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
