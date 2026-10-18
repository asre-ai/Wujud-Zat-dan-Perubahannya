/**
 * Utilitas Riwayat Kuis & Ekspor CSV
 * Menyimpan data kuis ke localStorage dengan key: 'riwayatKuisEnergi'
 * Mendukung Ekspor Siswa (individu) dan Rekap Guru (seluruh kelas)
 */

export interface QuizHistoryRecord {
  nama: string;
  waktu: string;
  jumlahBenar: number;
  jumlahSalah: number;
  nilaiAkhir: number;
  isTeacher?: boolean;
}

export const QUIZ_STORAGE_KEY = 'riwayatKuisEnergi';
export const ACTIVE_STUDENT_KEY = 'siswa_aktif_nama';

import { saveQuizResultToCloud, clearAllHistoryCloudAndLocal } from './firebaseSync';

/**
 * Memeriksa apakah nama atau sesi akun saat ini adalah akun Guru / Pengajar
 */
export function isTeacherName(name?: string): boolean {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return (
    n.includes('guru') ||
    n.includes('pengajar') ||
    n.includes('admin') ||
    n.includes('bapak/ibu') ||
    n.includes('wali kelas') ||
    n.startsWith('pak guru') ||
    n.startsWith('bu guru')
  );
}

export function isCurrentUserTeacher(): boolean {
  try {
    const role = localStorage.getItem('user_role');
    const isGuru = localStorage.getItem('is_guru');
    if (role === 'guru' || isGuru === 'true') return true;
    const active = localStorage.getItem(ACTIVE_STUDENT_KEY) || '';
    if (isTeacherName(active)) return true;
  } catch (e) {}
  return false;
}

/**
 * Format tanggal dan waktu standar Indonesia (contoh: 15 Okt 2026, 12:45)
 */
export function getWaktuFormatted(): string {
  const d = new Date();
  const tgl = d.getDate().toString().padStart(2, '0');
  const blnArr = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const bln = blnArr[d.getMonth()];
  const thn = d.getFullYear();
  const jam = d.getHours().toString().padStart(2, '0');
  const mnt = d.getMinutes().toString().padStart(2, '0');
  return `${tgl} ${bln} ${thn}, ${jam}:${mnt}`;
}

/**
 * Mendapatkan nama siswa aktif yang sedang belajar
 */
export function getActiveStudentName(): string {
  try {
    const direct = localStorage.getItem(ACTIVE_STUDENT_KEY);
    if (direct && direct.trim()) return direct.trim();

    // Fallback dari histori_energi (riwayat login overlay)
    const rawHistori = localStorage.getItem('histori_energi');
    if (rawHistori) {
      const parsed = JSON.parse(rawHistori);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ambil yang bukan guru
        for (let i = parsed.length - 1; i >= 0; i--) {
          const item = parsed[i];
          if (item && item.nama && !isTeacherName(item.nama)) {
            return item.nama.trim();
          }
        }
      }
    }
  } catch (err) {
    console.error('Gagal mengambil nama siswa:', err);
  }
  return 'Siswa Cilik';
}

export function setActiveStudentName(name: string): void {
  try {
    localStorage.setItem(ACTIVE_STUDENT_KEY, name.trim());
    window.dispatchEvent(new CustomEvent('siswa-login-success', { detail: name.trim() }));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Gagal menyimpan nama siswa:', err);
  }
}

/**
 * Mengambil semua riwayat kuis dari localStorage ('riwayatKuisEnergi')
 * Mendukung opsi 'highest' untuk menyaring nilai tertinggi per nama siswa
 * Secara default mengecualikan akun guru agar tidak masuk peringkat siswa
 */
export function getQuizHistory(filterMode: 'all' | 'highest' = 'all', includeTeacher: boolean = false): QuizHistoryRecord[] {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    let list: QuizHistoryRecord[] = Array.isArray(parsed) ? parsed : [];

    // Filter guru agar tidak mencemari data peringkat siswa
    if (!includeTeacher) {
      list = list.filter((item) => !item.isTeacher && !isTeacherName(item.nama));
    }

    if (filterMode === 'highest') {
      const map = new Map<string, QuizHistoryRecord>();
      list.forEach((item) => {
        const key = (item.nama || 'Siswa').trim().toLowerCase();
        const existing = map.get(key);
        // Pertahankan nilai tertinggi. Jika sama, pertahankan yang lebih awal tercatat (data asli)
        if (!existing || item.nilaiAkhir > existing.nilaiAkhir) {
          map.set(key, item);
        }
      });
      return Array.from(map.values()).sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);
    }

    return list;
  } catch (err) {
    console.error('Gagal membaca riwayatKuisEnergi:', err);
    return [];
  }
}

/**
 * Menyimpan satu hasil kuis baru ke localStorage ('riwayatKuisEnergi' & 'histori_energi')
 * SISTEM REKAM JEJAK (APPEND-ONLY): Selalu PUSH entri baru, TIDAK PERNAH menimpa (overwrite)
 * data teman yang namanya sama demi keamanan dari sabotase/kejahilan siswa.
 *
 * PENGAMANAN KHUSUS GURU:
 * Jika yang mengerjakan adalah Guru (login via panel guru atau nama Guru),
 * datanya TIDAK dimasukkan ke 'histori_energi' agar Guru TIDAK PERNAH masuk Papan Peringkat Top Scorers.
 */
export function saveQuizResult(data: {
  nama: string;
  jumlahBenar: number;
  jumlahSalah: number;
  nilaiAkhir: number;
}): QuizHistoryRecord {
  const isTeacher = isCurrentUserTeacher() || isTeacherName(data.nama);

  const newRecord: QuizHistoryRecord = {
    nama: data.nama || getActiveStudentName(),
    waktu: getWaktuFormatted(),
    jumlahBenar: data.jumlahBenar,
    jumlahSalah: data.jumlahSalah,
    nilaiAkhir: data.nilaiAkhir,
    isTeacher: isTeacher || undefined,
  };

  try {
    // 1. Simpan ke riwayatKuisEnergi (Append-Only / Push)
    const history = getQuizHistory('all', true);
    history.push(newRecord);
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(history));

    // 2. Simpan juga ke histori_energi HANYA UNTUK SISWA
    // Guru TIDAK dimasukkan ke histori_energi agar tidak masuk Papan Peringkat / Top Scorers
    if (!isTeacher) {
      const studentName = data.nama || getActiveStudentName();
      const rawLogin = localStorage.getItem('histori_energi');
      let loginList: any[] = [];
      if (rawLogin) {
        try {
          const parsed = JSON.parse(rawLogin);
          if (Array.isArray(parsed)) loginList = parsed;
        } catch (e) {}
      }

      // APPEND-ONLY: Selalu tambahkan riwayat percobaan baru bagi siswa
      loginList.push({
        nama: studentName,
        waktu: newRecord.waktu,
        skor: data.nilaiAkhir,
        jumlahBenar: data.jumlahBenar,
        jumlahSalah: data.jumlahSalah,
      });
      localStorage.setItem('histori_energi', JSON.stringify(loginList));
    }

    // 3. Sinkronisasikan secara Real-Time ke Cloud Firestore antar-gadget
    if (!isTeacher) {
      saveQuizResultToCloud(newRecord).catch((e) => console.warn('Cloud sync error:', e));
    }

    // Picu event storage agar pembaruan langsung sinkron ke seluruh UI
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Gagal menyimpan hasil kuis:', err);
  }

  return newRecord;
}

/**
 * Trigger pengunduhan file CSV di browser
 */
function triggerCsvDownload(csvString: string, filename: string): void {
  // \uFEFF adalah BOM UTF-8 agar Microsoft Excel mengenali karakter dengan rapi
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 1. UNDUHAN SISWA:
 * Mengubah data kuis individu yang baru saja dimainkan menjadi file CSV (misal: Nilai_Budi.csv)
 */
export function exportStudentCsv(record: QuizHistoryRecord): void {
  const sanitizeName = (record.nama || 'Siswa').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const filename = `Nilai_${sanitizeName}.csv`;

  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const csvRows = [
    ['Nama', 'Waktu/Tanggal', 'Jumlah Benar', 'Jumlah Salah', 'Nilai Akhir'].join(','),
    [
      escapeCsv(record.nama),
      escapeCsv(record.waktu),
      record.jumlahBenar,
      record.jumlahSalah,
      record.nilaiAkhir,
    ].join(','),
  ];

  triggerCsvDownload(csvRows.join('\r\n'), filename);
}

/**
 * 2. UNDUHAN GURU:
 * Mengambil seluruh data array dari localStorage ('riwayatKuisEnergi')
 * dan mengekspornya menjadi satu tabel CSV rapi berisi riwayat semua anak (misal: Rekap_Kelas_Energi.csv)
 */
export function exportTeacherCsv(filterMode: 'all' | 'highest' = 'all'): { success: boolean; count: number; filename: string } {
  const list = getQuizHistory(filterMode);

  if (list.length === 0) {
    return { success: false, count: 0, filename: '' };
  }

  const escapeCsv = (str: string) => `"${str.replace(/"/g, '""')}"`;

  const csvRows = [
    ['No', 'Nama Siswa', 'Waktu/Tanggal', 'Jumlah Benar', 'Jumlah Salah', 'Nilai Akhir', 'Keterangan'].join(','),
  ];

  list.forEach((item, index) => {
    csvRows.push(
      [
        index + 1,
        escapeCsv(item.nama || 'Siswa'),
        escapeCsv(item.waktu || '-'),
        item.jumlahBenar ?? 0,
        item.jumlahSalah ?? 0,
        item.nilaiAkhir ?? 0,
        filterMode === 'highest' ? 'Nilai Tertinggi Siswa' : 'Riwayat Percobaan',
      ].join(',')
    );
  });

  const filename = filterMode === 'highest' ? 'Rekap_Kelas_Nilai_Tertinggi.csv' : 'Rekap_Kelas_Semua_Percobaan.csv';
  triggerCsvDownload(csvRows.join('\r\n'), filename);
  return { success: true, count: list.length, filename };
}

/**
 * 3. RESET DATA GURU:
 * Menghapus data riwayatKuisEnergi & histori_energi dari localStorage dan Cloud Firestore
 * jika kelas sudah selesai dan berganti ke kelas baru
 */
export function resetQuizHistory(): void {
  try {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    localStorage.removeItem('histori_energi');
    localStorage.removeItem('pending_cloud_sessions');
    localStorage.setItem(QUIZ_STORAGE_KEY, '[]');
    localStorage.setItem('histori_energi', '[]');
    clearAllHistoryCloudAndLocal().catch(() => {});
  } catch (err) {
    console.error('Gagal mereset riwayatKuisEnergi:', err);
  }
}
