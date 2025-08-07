import { getApps, initializeApp } from '@react-native-firebase/app';

export function initializeFirebase() {
  if (getApps().length === 0) {
    const app = initializeApp({
      apiKey: "AIzaSyCj0KeoJD-syc-qbgCsURze92UbUw5jj9A",
      authDomain: "ai-apps-a1de3.firebaseapp.com",
      projectId: "ai-apps-a1de3",
      storageBucket: "ai-apps-a1de3.firebasestorage.app",
      messagingSenderId: "357874709429",
      appId: "1:357874709429:android:646ccb4620b73a77475ffc",
      measurementId: "G-5JZJZJZJZJ"
    });
    return app;
  } else {
    return getApps()[0];
  }
}