import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hrte.examschedule',
  appName: 'Lịch Thi',
  webDir: 'dist',
  server: {
    //dat
    // Thêm mục này để debug trên thiết bị thật
    androidScheme: 'https',
    // Nếu trên máy thật không load được, thử mở chế độ debug:
    url: 'http://172.20.10.2:5173/', // Địa chỉ dev server
    cleartext: true
  },
  // Thêm cấu hình this để debug
  loggingBehavior: 'debug'
};

export default config;
