const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    name: 'ProfitTracker Pro',
    executableName: 'ProfitTracker Pro',
    appBundleId: 'com.profittracker.pro',
    appCategoryType: 'public.app-category.finance',
    appVersion: '1.0.0',
    buildVersion: '1.0.0',
    copyright: '© 2024 ProfitTracker Pro. All rights reserved.',
    win32metadata: {
      CompanyName: 'ProfitTracker Pro',
      ProductName: 'ProfitTracker Pro',
      FileDescription: 'Professional finance and inventory management app',
      OriginalFilename: 'ProfitTracker Pro.exe',
      InternalName: 'ProfitTracker Pro'
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ProfitTrackerPro',
        setupExe: 'ProfitTracker Pro Setup.exe',
        noMsi: true,
        remoteReleases: false,
        authors: 'ProfitTracker Pro',
        description: 'Professional finance and inventory management app for reselling business',
        setupVersion: '1.0.0',
        setupMsi: false,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: 'ProfitTracker Pro'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32', 'darwin', 'linux'],
      config: {
        name: 'ProfitTrackerPro'
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'profit-tracker-pro-mac',
        background: './assets/icon.png',
        format: 'UDZO',
        icon: './assets/icon.png',
        iconSize: 128,
        contents: [
          { x: 380, y: 280, type: 'link', path: '/Applications' },
          { x: 110, y: 280, type: 'file', path: 'ProfitTracker Pro.app' }
        ],
        window: {
          size: {
            width: 540,
            height: 380
          }
        }
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: 'profit-tracker-pro',
        productName: 'ProfitTracker Pro',
        genericName: 'Finance & Inventory Manager',
        description: 'Professional finance and inventory management app for reselling business',
        categories: ['Office', 'Finance'],
        icon: './assets/icon.png'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        name: 'profit-tracker-pro',
        productName: 'ProfitTracker Pro',
        genericName: 'Finance & Inventory Manager',
        description: 'Professional finance and inventory management app for reselling business',
        categories: ['Office', 'Finance'],
        icon: './assets/icon.png'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
