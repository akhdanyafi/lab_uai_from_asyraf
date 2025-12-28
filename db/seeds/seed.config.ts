/**
 * Seed Configuration
 * Customize sample data quantities here
 */

export const SEED_CONFIG = {
    // User accounts
    users: {
        studentsCount: 12,
        lecturersCount: 4,
        defaultPassword: 'tes', // Used for all test accounts
    },

    // Academic data
    academic: {
        coursesCount: 5,
        classesCount: 8,
        modulesPerCourse: 3,
        sessionsPerClass: 4,
        reportsPerSession: 2, // How many students submit per session
    },

    // Facilities
    facilities: {
        roomBookingsCount: 15,
        itemsPerCategory: 8,
        itemLoansCount: 10,
        labAttendanceCount: 5,
    },

    // Content
    content: {
        publicationsCount: 8,
        heroPhotosCount: 3,
        governanceDocsCount: 4, // Mix of SOP and LPJ
    },
} as const;

// Sample data for realistic content
export const SAMPLE_DATA = {
    courses: [
        { code: 'IF101', name: 'Algoritma dan Pemrograman', description: 'Dasar-dasar algoritma dan pemrograman komputer' },
        { code: 'IF102', name: 'Struktur Data', description: 'Konsep struktur data dan implementasinya' },
        { code: 'IF201', name: 'Basis Data', description: 'Sistem manajemen basis data relasional' },
        { code: 'IF202', name: 'Jaringan Komputer', description: 'Konsep jaringan komputer dan protokol TCP/IP' },
        { code: 'IF301', name: 'Pemrograman Web', description: 'Pengembangan aplikasi berbasis web modern' },
        { code: 'IF302', name: 'Sistem Operasi', description: 'Konsep dan implementasi sistem operasi' },
    ],

    lecturers: [
        { fullName: 'Dr. Budi Santoso, M.Kom', identifier: '0001088901', email: 'budi.santoso@lab.ac.id' },
        { fullName: 'Siti Nurhaliza, S.Kom, M.T', identifier: '0002089502', email: 'siti.nurhaliza@lab.ac.id' },
        { fullName: 'Ahmad Hidayat, M.Cs', identifier: '0003089203', email: 'ahmad.hidayat@lab.ac.id' },
        { fullName: 'Dewi Lestari, S.T, M.Kom', identifier: '0004089804', email: 'dewi.lestari@lab.ac.id' },
        { fullName: 'Eko Prasetyo, Ph.D', identifier: '0005088705', email: 'eko.prasetyo@lab.ac.id' },
    ],

    students: [
        { fullName: 'Andi Wijaya', identifier: '2201010001', email: 'andi.wijaya@student.ac.id', batch: 2022, studyType: 'Reguler' },
        { fullName: 'Rina Maharani', identifier: '2201010002', email: 'rina.maharani@student.ac.id', batch: 2022, studyType: 'Reguler' },
        { fullName: 'Dimas Pradipta', identifier: '2201010003', email: 'dimas.pradipta@student.ac.id', batch: 2022, studyType: 'Hybrid' },
        { fullName: 'Fitri Handayani', identifier: '2201010004', email: 'fitri.handayani@student.ac.id', batch: 2022, studyType: 'Reguler' },
        { fullName: 'Reza Firmansyah', identifier: '2301010001', email: 'reza.firmansyah@student.ac.id', batch: 2023, studyType: 'Reguler' },
        { fullName: 'Sari Permata', identifier: '2301010002', email: 'sari.permata@student.ac.id', batch: 2023, studyType: 'Hybrid' },
        { fullName: 'Yudi Setiawan', identifier: '2301010003', email: 'yudi.setiawan@student.ac.id', batch: 2023, studyType: 'Reguler' },
        { fullName: 'Maya Kusuma', identifier: '2301010004', email: 'maya.kusuma@student.ac.id', batch: 2023, studyType: 'Reguler' },
        { fullName: 'Fajar Nugroho', identifier: '2401010001', email: 'fajar.nugroho@student.ac.id', batch: 2024, studyType: 'Reguler' },
        { fullName: 'Indah Sari', identifier: '2401010002', email: 'indah.sari@student.ac.id', batch: 2024, studyType: 'Hybrid' },
        { fullName: 'Arief Rahman', identifier: '2401010003', email: 'arief.rahman@student.ac.id', batch: 2024, studyType: 'Reguler' },
        { fullName: 'Linda Wati', identifier: '2401010004', email: 'linda.wati@student.ac.id', batch: 2024, studyType: 'Reguler' },
    ],

    semesters: [
        'Ganjil 2024/2025',
        'Genap 2023/2024',
        'Ganjil 2023/2024',
    ],

    itemCategories: [
        'Komputer',
        'Monitor',
        'Keyboard',
        'Mouse',
        'Proyektor',
        'Kabel & Aksesoris',
    ],

    publications: [
        {
            authorName: 'Dr. Ahmad Fauzi',
            title: 'Implementasi Machine Learning untuk Prediksi Cuaca di Indonesia',
            abstract: 'Penelitian ini mengeksplorasi penggunaan algoritma machine learning untuk memprediksi pola cuaca di wilayah Indonesia dengan akurasi tinggi.',
        },
        {
            authorName: 'Prof. Sarah Johnson',
            title: 'Analisis Kinerja Algoritma Sorting pada Big Data',
            abstract: 'Studi komparatif berbagai algoritma sorting dalam menangani dataset berukuran besar dengan kompleksitas waktu yang berbeda.',
        },
        {
            authorName: 'Dr. Budi Santoso',
            title: 'Keamanan Jaringan Komputer Menggunakan Blockchain',
            abstract: 'Implementasi teknologi blockchain untuk meningkatkan keamanan dan integritas data dalam jaringan komputer modern.',
        },
        {
            authorName: 'Siti Nurhaliza, M.T',
            title: 'Optimasi Database dengan Indexing dan Partitioning',
            abstract: 'Teknik-teknik optimasi database menggunakan indexing dan partitioning untuk meningkatkan performa query pada sistem berskala besar.',
        },
        {
            authorName: 'Prof. Eko Prasetyo',
            title: 'Aplikasi Internet of Things untuk Smart Home',
            abstract: 'Pengembangan sistem smart home berbasis IoT dengan integrasi sensor dan aktuator untuk otomasi rumah pintar.',
        },
        {
            authorName: 'Dr. Dewi Lestari',
            title: 'Natural Language Processing untuk Analisis Sentimen Media Sosial',
            abstract: 'Penerapan teknik NLP untuk menganalisis sentimen pengguna media sosial terhadap produk dan layanan.',
        },
        {
            authorName: 'Ahmad Hidayat, M.Cs',
            title: 'Pengembangan Aplikasi Mobile dengan Flutter',
            abstract: 'Studi kasus pengembangan aplikasi mobile cross-platform menggunakan framework Flutter untuk efisiensi development.',
        },
        {
            authorName: 'Dr. Yanto Mulyono',
            title: 'Cloud Computing untuk Sistem Informasi Akademik',
            abstract: 'Implementasi cloud computing dalam sistem informasi akademik untuk meningkatkan skalabilitas dan availability.',
        },
    ],

    heroPhotos: [
        { title: 'Praktikum Jaringan Komputer', description: 'Mahasiswa sedang melakukan konfigurasi router dan switch' },
        { title: 'Workshop Machine Learning', description: 'Pelatihan pengembangan model machine learning untuk pemula' },
        { title: 'Seminar Teknologi AI', description: 'Seminar nasional tentang perkembangan Artificial Intelligence' },
    ],

    governanceDocs: [
        { title: 'SOP Peminjaman Ruangan Laboratorium', type: 'SOP' as const },
        { title: 'SOP Peminjaman Peralatan Lab', type: 'SOP' as const },
        { title: 'Laporan Pertanggungjawaban Bulan Januari 2025', type: 'LPJ Bulanan' as const },
        { title: 'Laporan Pertanggungjawaban Bulan Desember 2024', type: 'LPJ Bulanan' as const },
    ],
};
