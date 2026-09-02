export const APP_PACKAGE_NAME = 'com.lechi.insanjo';
export const APP_STORE_URL = 'https://insanjo.com/download';

/** Deep link into the Insanjo app; falls back to an Android intent URL when on Android. */
export function getAppDeepLink(path) {
  if (/android/i.test(navigator.userAgent)) {
    return `intent://${path}#Intent;scheme=tops;package=${APP_PACKAGE_NAME};end`;
  }
  return `tops://${path}`;
}
