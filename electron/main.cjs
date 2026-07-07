const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;
let serverInstance = null;

// Determine if we are in development mode
const isDev = !app.isPackaged;

function startServer() {
  if (!isDev) {
    try {
      console.log('Production mode detected. Starting Express backend server...');

      // Ensure NODE_ENV is set to production
      process.env.NODE_ENV = 'production';

      // Tell the server where the static files are
      const distPath = path.join(__dirname, '..', 'dist');
      process.env.ELECTRON_DIST_PATH = distPath;

      // In production, require the bundled dist/server.cjs server
      // We run the server code inside the main process or spawn it. Requiring it is easiest and highly reliable.
      const serverPath = path.join(distPath, 'server.cjs');
      console.log(`Loading server from: ${serverPath}`);
      require(serverPath);
    } catch (err) {
      console.error('Failed to start internal production Express server:', err);
    }
  }
}

function checkServerReady(port, callback) {
  const req = http.request({
    port,
    host: '127.0.0.1',
    path: '/api/health',
    method: 'GET',
    timeout: 1000
  }, (res) => {
    if (res.statusCode === 200) {
      callback(true);
    } else {
      callback(false);
    }
  });

  req.on('timeout', () => {
    req.destroy();
    callback(false);
  });

  req.on('error', () => {
    callback(false);
  });

  req.end();
}

function waitForServer(port, callback, attempts = 30) {
  checkServerReady(port, (ready) => {
    if (ready) {
      callback();
    } else if (attempts > 0) {
      setTimeout(() => {
        waitForServer(port, callback, attempts - 1);
      }, 200);
    } else {
      console.error('Could not connect to the Express server. Loading fallback message.');
      callback();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: "Client Acquisition & Pitch Optimizer",
    backgroundColor: '#0f172a', // Slate-900 background matching the dark premium theme
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    titleBarStyle: 'default'
  });

  const port = process.env.PORT || 3000;
  const targetUrl = `http://localhost:${port}`;

  if (isDev) {
    console.log(`Dev mode: Waiting for development server on ${targetUrl}...`);
    waitForServer(port, () => {
      mainWindow.loadURL(targetUrl);
      // Open dev tools in development
      mainWindow.webContents.openDevTools();
    });
  } else {
    console.log(`Production mode: Waiting for server on ${targetUrl}...`);
    waitForServer(port, () => {
      mainWindow.loadURL(targetUrl);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Start the server first
startServer();

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
