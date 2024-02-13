import 'firebase/auth';
import * as dotenv from 'dotenv';

dotenv.config();
const firebaseConfig = {
  type: process.env.TYPE || '',
  projectId: process.env.PROJECT_ID || '',
  privateKeyId: process.env.PRIVATE_KEY_ID || '',
  privateKey: process.env.PRIVATE_KEY || '',
  clientEmail: process.env.CLIENT_EMAIL || '',
  clientId: process.env.CLIENT_ID || '',
  authUri: process.env.AUTH_URL || '',
  tokenUri: process.env.TOKEN_URI || '',
  authProviderX509CertUrl: process.env.auth_provider_x509_cert_url || '',
  clientX509CertUrl: process.env.client_x509_cert_url || '',
};

const firebaseAuthConfig = {
  apiKey: process.env.API_KEY || '',
  authDomain: process.env.AUTH_DOMAIN || '',
  projectId: process.env.PROJECT_ID || '',
  storageBucket: process.env.STORAGE_BUCKET || '',
  messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
  appId: process.env.APP_ID || '',
  measurementId: process.env.MEASUREMENT_ID || '',
};

export { firebaseConfig, firebaseAuthConfig };
