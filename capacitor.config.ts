import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myexample.app',
  appName: 'mamusique',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
