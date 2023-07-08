import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'comanda',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins":{
    "GoogleAuth":{
      "scopes": ["profile", "email"],
      "serverClientId" : "34748268613-usps44vpese91d2ro7kqvme870eh2fcr.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true,
      "androidClientId" : "34748268613-usps44vpese91d2ro7kqvme870eh2fcr.apps.googleusercontent.com",
    }
  }
};

export default config;
