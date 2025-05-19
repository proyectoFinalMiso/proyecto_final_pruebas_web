const { chromium } = require('playwright');
const routes = require('./routes.json');
const credentials = require('./credentials.json');
const constants = require('./constants.json')
const fs = require('fs');
const path = require('path');

const baseURL = constants.BASE_URL_ES; // Change this to your base URL
const baseURLEN = constants.BASE_URL_EN
const testURL = [baseURL, baseURLEN]

const resolutions = [
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 }
];

const modalButtons = [
  '[data-testid="nuevoProducto"]',
  '[data-testid="ProductoMasivo"]',
  '[data-testid="RemoveRedEyeIcon"]',
  '[data-testid="addStock"]',
  '[data-testid="newSeller"]',
  '[data-testid="openReport"]',
  '[data-testid="addPlanForm"]',
];

(async () => {
  for (const res of resolutions) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      viewport: res
    });

    const page = await context.newPage();
    let locale = ''
    let loginUserPlaceholder = ''

    for (const url of testURL) {

      if (url === baseURL) {
        locale = 'es';
        loginUserPlaceholder = 'Correo';
      }
      else {
        locale = 'en';
        loginUserPlaceholder = 'Email';
      }

      // Step 1: Visit Home Page
      await page.goto(url);

      // Step 2: Login (adapt selectors as needed)
      await page.getByLabel(loginUserPlaceholder).fill(credentials.username);
      await page.fill('input[type="password"]', credentials.password);
      await page.getByTestId('loginButton').click();
      await page.waitForURL(url + '/products');
      await page.waitForLoadState('networkidle');

      // Step 3: Visit Routes
      for (const route of routes) {
        const fullURL = `${url}${route}`;
        await page.goto(fullURL);
        await page.waitForLoadState('networkidle');

        const basePath = path.join(
          'screenshots',
          `${res.width}x${res.height}`,
        );
        fs.mkdirSync(basePath, { recursive: true });

        // Screenshot of the base page
        const pageScreenshotPath = path.join(
          basePath,
          route.replace(/\//g, '_') + '_' + locale + '.png'
        );
        await page.screenshot({ path: pageScreenshotPath, fullPage: true });
        console.log(`Captured ${pageScreenshotPath}`);

        // Try modal buttons
        for (const selector of modalButtons) {
          const button = page.locator(selector);
          if (await button.first().isVisible()) {
            try {
              await button.first().click();
              await page.waitForTimeout(3000); // Or use a smarter wait

              const modalScreenshotPath = path.join(
                basePath,
                `modal_${route.replace(/\//g, '_')}_${locale}_${selector.replace(/\W/g, '')}.png`
              );
              await page.screenshot({ path: modalScreenshotPath, fullPage: true });
              console.log(`Captured modal: ${modalScreenshotPath}`);

              // Optional: close modal if there's a known close button
              const closeModal = page.locator('button.MuiButton-colorError');
              if (await closeModal.isVisible()) {
                await closeModal.click();
                await page.waitForTimeout(1000);
              }
            } catch (err) {
              console.warn(`Failed to interact with modal button ${selector} on ${route}:`, err.message);
            }
          }
        }
      }
    }
    await browser.close();
  }
})();
