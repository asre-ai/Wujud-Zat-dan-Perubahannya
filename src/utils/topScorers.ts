/**
 * Utilitas Pengambilan dan Pemeringkatan Top Scorers dari 'histori_energi'
 */

export interface TopScorerStudent {
  rank: number;
  nama: string;
  waktu: string;
  skor: number;
  medal: 'gold' | 'silver' | 'bronze' | 'none';
  avatarEmoji: string;
}

const AVATAR_EMOJIS = ['🌟', '🚀', '🔬', '⚡', '🧪', '🎈', '🏆', '🎯', '🎨', '💡'];

export const SEED_DEMO_SCORERS = [
  { nama: 'Aisyah Putri', waktu: '15 Okt 2026, 08:30', skor: 100 },
  { nama: 'Budi Santoso', waktu: '15 Okt 2026, 09:15', skor: 90 },
  { nama: 'Citra Kirana', waktu: '15 Okt 2026, 10:00', skor: 90 },
  { nama: 'Doni Pratama', waktu: '15 Okt 2026, 10:45', skor: 80 },
  { nama: 'Eka Lestari', waktu: '15 Okt 2026, 11:20', skor: 70 },
];

/**
 * Memeriksa apakah suatu catatan berasal dari akun guru / pengajar / admin
 * Akun guru tidak boleh masuk ke papan peringkat siswa
 */
export function isTeacherRecord(nama?: string, item?: any): boolean {
  if (item && (item.isTeacher === true || item.role === 'guru')) return true;
  if (!nama) return false;
  const n = nama.trim().toLowerCase();
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

/**
 * Membaca data dari localStorage key 'histori_energi'
 * Mengelompokkan per siswa (skor tertinggi tiap siswa) atau mengambil sesi terbaik
 * Mengurutkan berdasarkan skor tertinggi (descending) dan mengambil 5 teratas
 * PENGAMANAN KHUSUS: Akun Guru TIDAK PERNAH dimasukkan ke Papan Peringkat Juara Siswa!
 */
export function getTop5FromHistoriEnergi(filterMode: 'highest' | 'all' = 'highest'): {
  students: TopScorerStudent[];
  totalRecords: number;
  isRealData: boolean;
  filterMode: 'highest' | 'all';
} {
  try {
    const raw = localStorage.getItem('histori_energi');
    let list: Array<{ nama?: string; waktu?: string; skor?: number; isTeacher?: boolean; role?: string }> = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }

    // Selalu sertakan semua hasil kuis dari riwayatKuisEnergi agar seluruh skor siswa antar-gadget sinkron
    const rawKuis = localStorage.getItem('riwayatKuisEnergi');
    if (rawKuis) {
      try {
        const parsedKuis = JSON.parse(rawKuis);
        if (Array.isArray(parsedKuis) && parsedKuis.length > 0) {
          parsedKuis.forEach((k: any) => {
            if (k && k.nama) {
              list.push({
                nama: k.nama,
                waktu: k.waktu || '-',
                skor: k.nilaiAkhir != null ? k.nilaiAkhir : (k.skor ?? 0),
                isTeacher: k.isTeacher,
                role: k.role,
              });
            }
          });
        }
      } catch (e) {
        // ignore
      }
    }

    // FILTER MUTLAK:
    // 1. Buang semua entri guru / pengajar agar tidak pernah masuk papan peringkat siswa
    // 2. Hanya masukkan siswa yang benar-benar telah mengerjakan kuis (ada di riwayat kuis, atau skor > 0)
    list = list.filter((item: any) => {
      if (isTeacherRecord(item.nama, item)) return false;
      const hasTakenQuiz = item.jumlahBenar != null || item.jumlahSalah != null || (typeof item.skor === 'number' && item.skor > 0);
      return hasTakenQuiz;
    });

    if (list.length === 0) {
      return {
        students: [],
        totalRecords: 0,
        isRealData: false,
        filterMode,
      };
    }

    let processedList: Array<{ nama: string; waktu: string; skor: number }> = [];

    if (filterMode === 'highest') {
      // Kelompokkan per nama siswa (ambil skor tertinggi masing-masing anak, amankan dari kejahilan nama ganda)
      const map = new Map<string, { nama: string; waktu: string; skor: number }>();

      list.forEach((item) => {
        const rawName = (item.nama || 'Siswa').trim();
        if (!rawName) return;
        if (isTeacherRecord(rawName, item)) return;

        const key = rawName.toLowerCase();
        const score = typeof item.skor === 'number' ? item.skor : parseInt(String(item.skor || 0), 10) || 0;
        const waktu = item.waktu || '-';

        const existing = map.get(key);
        if (!existing || score > existing.skor) {
          map.set(key, { nama: rawName, waktu, skor: score });
        }
      });

      processedList = Array.from(map.values());
    } else {
      // Mode 'all': tampilkan semua riwayat tanpa deduplikasi (tetap tanpa akun guru)
      processedList = list
        .filter((item) => (item.nama || '').trim() !== '' && !isTeacherRecord(item.nama, item))
        .map((item) => ({
          nama: (item.nama || 'Siswa').trim(),
          waktu: item.waktu || '-',
          skor: typeof item.skor === 'number' ? item.skor : parseInt(String(item.skor || 0), 10) || 0,
        }));
    }

    // Urutkan berdasarkan skor descending, jika sama urutkan berdasarkan waktu
    processedList.sort((a, b) => b.skor - a.skor);

    // Ambil top 5
    const top5 = processedList.slice(0, 5).map((s, idx) => {
      const rank = idx + 1;
      let medal: 'gold' | 'silver' | 'bronze' | 'none' = 'none';
      if (rank === 1) medal = 'gold';
      else if (rank === 2) medal = 'silver';
      else if (rank === 3) medal = 'bronze';

      return {
        rank,
        nama: s.nama,
        waktu: s.waktu,
        skor: s.skor,
        medal,
        avatarEmoji: AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length],
      };
    });

    return {
      students: top5,
      totalRecords: processedList.length,
      isRealData: true,
      filterMode,
    };
  } catch (err) {
    console.error('Gagal mengambil top scorers dari histori_energi:', err);
    return {
      students: [],
      totalRecords: 0,
      isRealData: false,
      filterMode,
    };
  }
}

/**
 * Menyimpan data sampel demo ke histori_energi jika diperlukan untuk pengujian instan
 */
export function seedDemoHistoriEnergi(): void {
  try {
    const raw = localStorage.getItem('histori_energi');
    let current: any[] = [];
    if (raw) {
      try {
        current = JSON.parse(raw);
      } catch (e) {}
    }
    if (!Array.isArray(current)) current = [];

    // Tambahkan data demo yang belum ada
    SEED_DEMO_SCORERS.forEach((demo) => {
      current.push({
        nama: demo.nama,
        waktu: demo.waktu,
        skor: demo.skor,
      });
    });

    localStorage.setItem('histori_energi', JSON.stringify(current));
  } catch (err) {
    console.error('Gagal mengisi data demo histori_energi:', err);
  }
}
