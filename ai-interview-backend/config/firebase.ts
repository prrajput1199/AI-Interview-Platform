import "dotenv/config";
import {initializeApp,cert,getApps} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth"

console.log({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
});

if(!getApps().length){
    initializeApp({
       credential: cert({
         projectId: process.env.FIREBASE_PROJECT_ID!,
         clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
         privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
       })
    })
}

export const auth = getAuth();