import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = (firebaseConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

// Inisialisasi Firebase Auth dengan aman
export const auth = (() => {
  try {
    return getAuth(app);
  } catch (err) {
    console.warn('Firebase Auth client initialization skipped:', err);
    return null;
  }
})();

// Penampung Promise agar pemanggilan beruntun tidak memicu multi-request
let anonymousSignInPromise: Promise<User | null> | null = null;

/**
 * Otentikasi Anonim (Firebase Anonymous Auth):
 * Memastikan pengguna memiliki akun & userId unik anonim sebelum menyimpan data kuis/sesi.
 * Jika pengguna belum terautentikasi (auth.currentUser == null), signInAnonymously(auth)
 * akan dipanggil secara otomatis tanpa perlu mengisi email/password.
 */
export async function ensureAnonymousAuth(): Promise<User | null> {
  if (!auth) return null;

  // Jika sudah terautentikasi, gunakan sesi user yang ada
  if (auth.currentUser) {
    return auth.currentUser;
  }

  // Jika sedang dalam antrean sign-in anonim, tunggu promise yang sama
  if (anonymousSignInPromise) {
    return anonymousSignInPromise;
  }

  anonymousSignInPromise = (async () => {
    try {
      const cred = await signInAnonymously(auth);
      console.log('✅ Firebase Anonymous Auth aktif. User ID:', cred.user.uid);
      return cred.user;
    } catch (err: any) {
      // Tangani jika Anonymous provider belum di-enable di Firebase Console atau offline
      console.warn(
        'ℹ️ Firebase Anonymous Auth belum aktif atau offline (aplikasi tetap berjalan dengan fallback lokal):',
        err?.message || err
      );
      return null;
    } finally {
      anonymousSignInPromise = null;
    }
  })();

  return anonymousSignInPromise;
}

// Inisialisasi otomatis Anonymous Auth seawal mungkin saat aplikasi dimuat
if (typeof window !== 'undefined' && auth) {
  ensureAnonymousAuth().catch(() => {});
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is currently offline or unreachable.');
    }
  }
}

testConnection();
