const { contextBridge, ipcRenderer } = require('electron');

// Safe APIs to expose to the frontend/renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  // We can add desktop-specific messaging here if needed later
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload script loaded successfully.');
});
