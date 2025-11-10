// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.placemy.com/api', // Cambiar cuando tengas la URL de producción
  appName: 'PlaceMy FrontHouse',
  version: '1.0.0',
  
  // Configuración de PWA
  pwa: {
    enabled: true,
    updateCheckInterval: 3600000, // Verificar actualizaciones cada hora en producción
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
