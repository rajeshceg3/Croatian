const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleMessages.push(`[pageerror] ${err.message}`);
  });

  try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // give time to load data

      console.log('App loaded without crashing.');

      if (consoleMessages.length > 0) {
          console.log('Console Errors/Warnings:');
          console.log(consoleMessages.join('\n'));
      } else {
          console.log('No console errors found!');
      }

      await page.screenshot({ path: 'screenshot.png' });
  } catch(e) {
      console.error('Test failed:', e);
  } finally {
      await browser.close();
  }
})();
