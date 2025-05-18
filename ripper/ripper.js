const { chromium } = require('playwright');
const routes = require('./routes.json');
const credentials = require('./credentials.json');
const constants = require('./constants.json')
const fs = require('fs');
const path = require('path');

const baseURL = constants.BASE_URL_ES; // Change this to your base URL

const resolutions = [
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 }
];

(async () => {
  for (const res of resolutions) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      viewport: res
    });

    const page = await context.newPage();

    // Step 1: Visit Home Page
    await page.goto(baseURL);

    // Step 2: Login (adapt selectors as needed)
    await page.getByLabel('Correo').fill(credentials.username);
    await page.fill('input[type="password"]', credentials.password);
    await page.getByTestId('loginButton').click();
    await page.waitForURL(baseURL+'/products');
    await page.waitForLoadState('networkidle');

    // Step 3: Visit Routes and Take Screenshots
    for (const route of routes) {
      const fullURL = `${baseURL}${route}`;
      await page.goto(fullURL);
      await page.waitForLoadState('networkidle');

      const screenshotPath = path.join(
        'screenshots',
        `${res.width}x${res.height}`,
        route.replace(/\//g, '_') + '.png'
      );

      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Captured ${screenshotPath}`);
    }

    await browser.close();
  }
})();
