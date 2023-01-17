import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhxFdnPjFnZ67CTjVOY9TAgYJNFayWzJg",
  authDomain: "mobileapp-1504f.firebaseapp.com",
  projectId: "mobileapp-1504f",
  storageBucket: "mobileapp-1504f.appspot.com",
  messagingSenderId: "1081050926664",
  appId: "1:1081050926664:web:08450034c27769740dd27d",
  measurementId: "G-FBWFXPQ5RT",
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// export default app;
