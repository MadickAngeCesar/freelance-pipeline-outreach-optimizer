import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.clientacquisition.planner',
  appName: 'ClientAcquisitionPlanner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
