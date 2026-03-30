import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification, reload, User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, getDocFromServer, Timestamp, FirestoreError } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore with long polling enabled for better reliability in some environments
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, (firebaseConfig as any).firestoreDatabaseId || '(default)');

export { db };
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics if supported
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Operation types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

/**
 * Handles Firestore errors by logging detailed information and throwing a JSON-formatted error message.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Tests the connection to Firestore and provides detailed diagnostics.
 */
async function testConnection() {
  try {
    // Attempt to force a fetch from the server
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("✅ Firestore connection successful.");
  } catch (error: any) {
    if (error.code === 'unavailable' || error.message.includes('offline')) {
      console.error("❌ Firestore Connection Error: The client is offline.");
      console.error("Please verify that:");
      console.error("1. You have created a Firestore database in the Firebase Console.");
      console.error("2. The 'Cloud Firestore API' is enabled in your Google Cloud Console.");
      console.error(`3. Your Project ID '${firebaseConfig.projectId}' is correct.`);
    } else if (error.code === 'permission-denied') {
      console.warn("⚠️ Firestore connection reached, but access was denied. Check your Security Rules.");
    } else {
      console.error("❌ Firestore Diagnostic Error:", error.code, error.message);
    }
  }
}

// testConnection();

export { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification, reload, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot, Timestamp };
export type { FirebaseUser };
