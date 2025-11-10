// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  appName: 'PlaceMy FrontHouse',
  version: '1.0.0',
  
  // Configuración de PWA
  pwa: {
    enabled: true,
    updateCheckInterval: 30000, // Verificar actualizaciones cada 30 segundos
  },
  
  // Configuración de notificaciones push
  pushNotifications: {
    enabled: true,
    vapidPublicKey: '' // Se configurará más adelante cuando tengamos el servidor de push
  },
  
  // Configuración de la cámara
  camera: {
    enabled: true,
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080
  }
};
