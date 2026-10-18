import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { QuizHistoryRecord, QUIZ_STORAGE_KEY, isTeacherName } from './quizHistory';

const QUIZ_RESULTS_PATH = 'quiz_results';
const STUDENT_SESSIONS_PATH = 'student_sessions';

/**
 * Menyimpan sesi login siswa ke Firestore agar perangkat lain (laptop guru / teman)
 * langsung mengetahui ada siswa baru yang masuk secara real-time.
 */
export async function saveStudentSessionToCloud(nama: string, waktu: string, skor: number = 0): Promise<void> {
  const cleanName = (nama || '').trim();
  if (!cleanName || cleanName === 'Siswa Cilik' || isTeacherName(cleanName)) {
    return;
  }

  // ID dokumen yang aman dan terurut waktu (hanya huruf, angka, underscore, hyphen)
  const randomPart = Math.random().toString(36).substring(2, 10).replace(/[^a-zA-Z0-9]/g, 'x');
  const docId = `session_${Date.now()}_${randomPart}`;
  const payload = {
    nama: cleanName.substring(0, 60),
    waktu: (waktu || '-').substring(0, 60),
    skor: Math.max(0, Math.min(100, Math.round(Number(skor) || 0))),
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, STUDENT_SESSIONS_PATH, docId), payload);
  } catch (error) {
    console.error('Gagal sinkronisasi sesi siswa ke cloud:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, STUDENT_SESSIONS_PATH);
    } catch {
      // Tetap lanjutkan aplikasi meski offline
    }
  }
}

// Daftarkan fungsi global seawal mungkin agar index.html (Vanilla JS) dapat memanggil sinkronisasi langsung
if (typeof window !== 'undefined') {
  (window as any).syncStudentSessionToCloud = saveStudentSessionToCloud;
  (window as any).syncQuizResultToCloud = saveQuizResultToCloud;
  (window as any).clearAllHistoryCloudAndLocal = clearAllHistoryCloudAndLocal;
}

/**
 * RESTART & PEMBERSIHAN TOTAL RIWAYAT (Lokal + Cloud Firestore):
 * Menghapus semua dokumen dari koleksi quiz_results dan student_sessions di Cloud Firestore
 * serta mengosongkan seluruh localStorage agar nama-nama tidak lengket saat web dimuat ulang.
 */
export async function clearAllHistoryCloudAndLocal(): Promise<boolean> {
  console.log('🧹 Memulai Pembersihan Total Riwayat Kuis & Sesi Siswa (Cloud + Local)...');
  try {
    // 1. Bersihkan koleksi quiz_results di Firestore
    try {
      const quizDocs = await getDocs(collection(db, QUIZ_RESULTS_PATH));
      const deleteQuizPromises = quizDocs.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deleteQuizPromises);
      console.log(`✅ Berhasil menghapus ${quizDocs.size} dokumen quiz_results di cloud.`);
    } catch (e) {
      console.warn('Kendala menghapus dokumen quiz_results di cloud:', e);
    }

    // 2. Bersihkan koleksi student_sessions di Firestore
    try {
      const sessionDocs = await getDocs(collection(db, STUDENT_SESSIONS_PATH));
      const deleteSessionPromises = sessionDocs.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deleteSessionPromises);
      console.log(`✅ Berhasil menghapus ${sessionDocs.size} dokumen student_sessions di cloud.`);
    } catch (e) {
      console.warn('Kendala menghapus dokumen student_sessions di cloud:', e);
    }

    // 3. Bersihkan memori localStorage
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
      localStorage.removeItem('histori_energi');
      localStorage.removeItem('pending_cloud_sessions');
      localStorage.removeItem('siswa_aktif_nama');
      localStorage.setItem(QUIZ_STORAGE_KEY, '[]');
      localStorage.setItem('histori_energi', '[]');
    } catch (e) {}

    // 4. Picu pembaruan ke seluruh UI aplikasi web
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cloud-sync-update'));
      window.dispatchEvent(new Event('storage'));
      if (typeof (window as any).renderAdminTable === 'function') {
        (window as any).renderAdminTable();
      }
    }

    return true;
  } catch (err) {
    console.error('Gagal membersihkan total riwayat:', err);
    return false;
  }
}

/**
 * Migrasi pembersihan satu kali otomatis sesuai instruksi user:
 * "restart saja riwayatnya karena ada nama nama yang lengket saat dibersihkan dan webnya dimuat ulang"
 */
export function checkAndTriggerOneTimeRestart(): void {
  try {
    const RESTART_KEY = 'riwayat_bersih_total_v1';
    if (localStorage.getItem(RESTART_KEY) !== 'true') {
      console.log('🔄 Menjalankan one-time restart riwayat untuk membersihkan nama-nama yang tersangkut...');
      localStorage.setItem(RESTART_KEY, 'true');
      clearAllHistoryCloudAndLocal().catch(() => {});
    }
  } catch (e) {}
}

/**
 * Menyimpan hasil kuis siswa ke Firestore agar langsung muncul di Papan Juara (Top Scorers)
 * dan Panel Guru di gadget lain.
 * PENGAMANAN: Akun guru tidak disimpan ke papan hasil kuis siswa.
 */
export async function saveQuizResultToCloud(record: QuizHistoryRecord): Promise<void> {
  const cleanName = (record.nama || '').trim();
  if (!cleanName || cleanName === 'Siswa Cilik') return;

  // Jika guru, jangan masukkan ke ranking siswa di cloud
  const isTeacher = record.isTeacher === true || isTeacherName(cleanName);
  if (isTeacher) return;

  const randomPart = Math.random().toString(36).substring(2, 10).replace(/[^a-zA-Z0-9]/g, 'x');
  const docId = `quiz_${Date.now()}_${randomPart}`;
  const payload = {
    nama: cleanName.substring(0, 60),
    waktu: (record.waktu || '-').substring(0, 60),
    skor: Math.max(0, Math.min(100, Math.round(Number(record.nilaiAkhir) || 0))),
    jumlahBenar: Math.max(0, Math.min(10, Math.round(Number(record.jumlahBenar) || 0))),
    jumlahSalah: Math.max(0, Math.min(10, Math.round(Number(record.jumlahSalah) || 0))),
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, QUIZ_RESULTS_PATH, docId), payload);
  } catch (error) {
    console.error('Gagal sinkronisasi hasil kuis ke cloud:', error);
    try {
      handleFirestoreError(error, OperationType.WRITE, QUIZ_RESULTS_PATH);
    } catch {
      // Graceful offline fallback
    }
  }
}

/**
 * Menggabungkan entri dari Cloud ke localStorage tanpa merusak data yang sudah ada (Append-Only)
 */
function mergeCloudQuizResults(cloudRecords: any[]): void {
  try {
    const rawLocal = localStorage.getItem(QUIZ_STORAGE_KEY);
    let localList: QuizHistoryRecord[] = [];
    if (rawLocal) {
      try {
        const parsed = JSON.parse(rawLocal);
        if (Array.isArray(parsed)) localList = parsed;
      } catch {}
    }

    // Set untuk mendeteksi keunikan data (nama + waktu + nilaiAkhir)
    const seen = new Set<string>();
    localList.forEach((r) => {
      seen.add(`${(r.nama || '').trim().toLowerCase()}_${r.waktu}_${r.nilaiAkhir}`);
    });

    let hasNew = false;
    cloudRecords.forEach((c) => {
      const key = `${(c.nama || '').trim().toLowerCase()}_${c.waktu}_${c.skor ?? c.nilaiAkhir}`;
      if (!seen.has(key)) {
        seen.add(key);
        localList.push({
          nama: c.nama,
          waktu: c.waktu,
          jumlahBenar: c.jumlahBenar ?? Math.round((c.skor || 0) / 10),
          jumlahSalah: c.jumlahSalah ?? (10 - Math.round((c.skor || 0) / 10)),
          nilaiAkhir: c.skor ?? c.nilaiAkhir ?? 0,
        });
        hasNew = true;
      }
    });

    if (hasNew) {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(localList));
    }

    // Perbarui juga histori_energi untuk Top Scorers dan tabel Guru
    const rawHistori = localStorage.getItem('histori_energi');
    let historiList: any[] = [];
    if (rawHistori) {
      try {
        const parsed = JSON.parse(rawHistori);
        if (Array.isArray(parsed)) historiList = parsed;
      } catch {}
    }

    const historiSeen = new Set<string>();
    historiList.forEach((h) => {
      historiSeen.add(`${(h.nama || '').trim().toLowerCase()}_${h.waktu}_${h.skor}`);
    });

    let historiUpdated = false;
    cloudRecords.forEach((c) => {
      const hKey = `${(c.nama || '').trim().toLowerCase()}_${c.waktu}_${c.skor ?? c.nilaiAkhir}`;
      if (!historiSeen.has(hKey)) {
        historiSeen.add(hKey);
        historiList.push({
          nama: c.nama,
          waktu: c.waktu,
          skor: c.skor ?? c.nilaiAkhir ?? 0,
          jumlahBenar: c.jumlahBenar ?? Math.round((c.skor || 0) / 10),
          jumlahSalah: c.jumlahSalah ?? (10 - Math.round((c.skor || 0) / 10)),
        });
        historiUpdated = true;
      }
    });

    if (historiUpdated) {
      localStorage.setItem('histori_energi', JSON.stringify(historiList));
    }

    if (hasNew || historiUpdated) {
      window.dispatchEvent(new CustomEvent('cloud-sync-update'));
      window.dispatchEvent(new Event('storage'));
      if (typeof (window as any).renderAdminTable === 'function') {
        (window as any).renderAdminTable();
      }
    }
  } catch (err) {
    console.error('Gagal menggabungkan data kuis dari cloud:', err);
  }
}

/**
 * Menggabungkan entri sesi login dari Cloud ke histori_energi
 */
function mergeCloudStudentSessions(cloudSessions: any[]): void {
  try {
    const rawHistori = localStorage.getItem('histori_energi');
    let historiList: any[] = [];
    if (rawHistori) {
      try {
        const parsed = JSON.parse(rawHistori);
        if (Array.isArray(parsed)) historiList = parsed;
      } catch {}
    }

    const seen = new Set<string>();
    historiList.forEach((h) => {
      seen.add(`${(h.nama || '').trim().toLowerCase()}_${h.waktu}`);
    });

    let updated = false;
    cloudSessions.forEach((s) => {
      const key = `${(s.nama || '').trim().toLowerCase()}_${s.waktu}`;
      if (!seen.has(key)) {
        seen.add(key);
        historiList.push({
          nama: s.nama,
          waktu: s.waktu,
          skor: s.skor ?? 0,
        });
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('histori_energi', JSON.stringify(historiList));
      window.dispatchEvent(new CustomEvent('cloud-sync-update'));
      window.dispatchEvent(new Event('storage'));
      if (typeof (window as any).renderAdminTable === 'function') {
        (window as any).renderAdminTable();
      }
    }
  } catch (err) {
    console.error('Gagal menggabungkan sesi login dari cloud:', err);
  }
}

let syncInitialized = false;

/**
 * Memulai Sinkronisasi Realtime Firebase Firestore Antar-Gadget (HP, Laptop, Tablet)
 */
export function startFirebaseRealtimeSync(): () => void {
  if (syncInitialized) {
    return () => {};
  }
  syncInitialized = true;

  console.log('☁️ Memulai Sinkronisasi Real-Time Cloud Firestore untuk Hasil Belajar Siswa...');

  // Jalankan pembersihan awal jika ada sisa data lama yang tersangkut (one-time restart)
  checkAndTriggerOneTimeRestart();

  // 1. Dengarkan pembaruan real-time hasil kuis
  const unsubQuiz = onSnapshot(
    collection(db, QUIZ_RESULTS_PATH),
    (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((d) => items.push(d.data()));
      mergeCloudQuizResults(items);
    },
    (error) => {
      console.warn('Gagal langganan real-time hasil kuis:', error.message);
      try {
        handleFirestoreError(error, OperationType.GET, QUIZ_RESULTS_PATH);
      } catch {}
    }
  );

  // 2. Dengarkan pembaruan real-time sesi login siswa
  const unsubSessions = onSnapshot(
    collection(db, STUDENT_SESSIONS_PATH),
    (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((d) => items.push(d.data()));
      mergeCloudStudentSessions(items);
    },
    (error) => {
      console.warn('Gagal langganan real-time sesi siswa:', error.message);
      try {
        handleFirestoreError(error, OperationType.GET, STUDENT_SESSIONS_PATH);
      } catch {}
    }
  );

  // Daftarkan fungsi global agar index.html (Vanilla JS) dapat memanggil sinkronisasi langsung
  if (typeof window !== 'undefined') {
    (window as any).syncStudentSessionToCloud = saveStudentSessionToCloud;
    (window as any).syncQuizResultToCloud = saveQuizResultToCloud;
  }

  // Kirimkan data sesi antrean dari sebelum React selesai dimuat
  try {
    const pendingRaw = localStorage.getItem('pending_cloud_sessions');
    if (pendingRaw) {
      const pending = JSON.parse(pendingRaw);
      if (Array.isArray(pending) && pending.length > 0) {
        localStorage.removeItem('pending_cloud_sessions');
        for (const item of pending) {
          if (item && item.nama && !isTeacherName(item.nama)) {
            saveStudentSessionToCloud(item.nama, item.waktu || '', item.skor || 0).catch(() => {});
          }
        }
      }
    }
  } catch (e) {}

  // Kirimkan data lokal yang sudah ada sebelumnya ke cloud jika belum ada di cloud
  syncLocalToCloudOnce();

  return () => {
    unsubQuiz();
    unsubSessions();
    syncInitialized = false;
  };
}

/**
 * Sinkronisasi satu kali data awal dari localStorage ke cloud saat pertama kali terhubung
 */
async function syncLocalToCloudOnce() {
  try {
    // 1. Unggah histori kuis lokal yang ada ke cloud jika belum tersimpan
    const rawLocalQuiz = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (rawLocalQuiz) {
      const list: QuizHistoryRecord[] = JSON.parse(rawLocalQuiz);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (!item.isTeacher && !isTeacherName(item.nama)) {
            saveQuizResultToCloud(item).catch(() => {});
          }
        }
      }
    }

    // 2. Unggah sesi siswa lokal (histori_energi) ke cloud agar laptop/HP lain langsung melihat nama siswa
    const rawLocalHistori = localStorage.getItem('histori_energi');
    if (rawLocalHistori) {
      const hList = JSON.parse(rawLocalHistori);
      if (Array.isArray(hList)) {
        for (const h of hList) {
          if (h && h.nama && !isTeacherName(h.nama)) {
            saveStudentSessionToCloud(h.nama, h.waktu || '', h.skor || 0).catch(() => {});
          }
        }
      }
    }
  } catch (e) {
    // ignore
  }
}
