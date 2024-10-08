import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "AIzaSyCE9Exyd9kL6PrMjJtmctRlAGl4bMZPIMM",
  authDomain: "login-form-c634d.firebaseapp.com",
  projectId: "login-form-c634d",
  storageBucket: "login-form-c634d.appspot.com",
  messagingSenderId: "777199725956",
  appId: "1:777199725956:web:61d57b9989cf76e108c1d1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
