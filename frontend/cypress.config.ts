import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    retries: {
      runMode: 2,
      openMode: 0
    },
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          // Keep headed runs stable when browser window is not focused.
          launchOptions.args.push('--disable-background-timer-throttling');
          launchOptions.args.push('--disable-renderer-backgrounding');
          launchOptions.args.push('--disable-backgrounding-occluded-windows');
          launchOptions.args.push('--disable-features=CalculateNativeWinOcclusion');
        }

        return launchOptions;
      });
    }
  },
  video: false,
  screenshotOnRunFailure: true
});
