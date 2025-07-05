//C:\UNI\DProject\tracebit\TraceBit\frontend\src\app\utils\fingerprintCollector.ts

import * as UAParser from 'ua-parser-js';

export interface FingerprintData {
  parsedUserAgent: {
    browser: string;
    os: string;
    device: string;
    engine: string;
    fullUserAgent: string;
  };
  language: string;
  platform: string;
  timezone: string;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  webGL: {
    supported: boolean;
    renderer: string;
    vendor: string;
  };
  capabilities: {
    cookiesEnabled: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    serviceWorker: boolean;
    webRTC: boolean;
    touchSupport: boolean;
    online: boolean;
  };
  orientation: string;
}

export const collectFingerprintData = (): FingerprintData => {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl');

  const webGLInfo: { renderer: string; vendor: string } =
    gl &&
    typeof WebGLRenderingContext !== 'undefined' &&
    gl instanceof WebGLRenderingContext
      ? (() => {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          return {
            renderer: debugInfo
              ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
              : 'N/A',
            vendor: debugInfo
              ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
              : 'N/A',
          };
        })()
      : { renderer: 'N/A', vendor: 'N/A' };

  const parser = new UAParser.UAParser();
  const parsedUA = parser.getResult();

  return {
    parsedUserAgent: {
      browser: `${parsedUA.browser.name ?? 'Unknown'} ${parsedUA.browser.version ?? ''}`.trim(),
      os: `${parsedUA.os.name ?? 'Unknown'} ${parsedUA.os.version ?? ''}`.trim(),
      device: parsedUA.device.model ?? 'Desktop',
      engine: parsedUA.engine.name ?? 'Unknown',
      fullUserAgent: navigator.userAgent,
    },
    language: navigator.language,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    },
    webGL: {
      supported: !!gl,
      ...webGLInfo,
    },
    capabilities: {
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      webRTC: typeof RTCPeerConnection !== 'undefined',
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      online: navigator.onLine,
    },
    orientation: screen.orientation?.type || 'unknown',
  };
};
