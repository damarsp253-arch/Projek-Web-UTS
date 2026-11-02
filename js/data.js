/* =========================================================
   data.js - Data dummy (Array JSON) untuk aplikasi BukuKita
   Dipakai oleh semua halaman melalui script.js
   ========================================================= */

// Akun pengguna untuk simulasi login
const dataPengguna = [
  { nama: "Damar", email: "damar@bukukita.id", password: "damar123" },
  { nama: "Admin Toko", email: "admin@bukukita.id", password: "admin123" }
];

// Katalog buku (konstanta utama untuk halaman stok.html)
const dataKatalogBuku = [
  { kode: "BK-001", judul: "Kepemimpinan", penulis: "Hj. Mu'ah, Tri Ifa Indrayani, H. Masram, Muhammad Sulton", kategori: "Manajemen", harga: 95000, stok: 20, gambar: "img/buku1.png" },
  { kode: "BK-002", judul: "Manajemen Keuangan", penulis: "Erna Chotidjah Suhatmi, SE., M.Ak", kategori: "Ekonomi", harga: 88000, stok: 15, gambar: "img/buku2.png" },
  { kode: "BK-003", judul: "Mikrobiologi Dasar", penulis: "Imam Mishbach, Henderite L. Ohee, Dirk YP Runtuboi, John D. Kalor, Basa T. Rumahorbo, Ervina Indrayani", kategori: "Sains", harga: 110000, stok: 4, gambar: "img/buku3.png" },
  { kode: "BK-004", judul: "Perkembangan Anak Usia Dini: Pengantar dalam Berbagai Aspeknya", penulis: "Drs. Ahmad Susanto, M.Pd.", kategori: "Pendidikan", harga: 79000, stok: 0, gambar: "img/buku4.png" },
  { kode: "BK-005", judul: "Ilmu Komunikasi: Ilmiah dan Populer", penulis: "Nurudin", kategori: "Komunikasi", harga: 72000, stok: 12, gambar: "img/buku5.png" }
];

// Data pelacakan pengiriman (key = Nomor Delivery Order)
// status: 0 Diterima, 1 Dikemas, 2 Dikirim, 3 Dalam Perjalanan, 4 Selesai
const dataTracking = [
  {
    noDO: "DO2026001", nama: "Damar", status: 3, ekspedisi: "JNE Reguler", tanggalKirim: "2026-10-28",
    jenisPaket: "Paket Buku (Reguler)", totalBayar: 180000,
    perjalanan: [
      { waktu: "2026-10-28 09:10", ket: "Pesanan diterima toko" },
      { waktu: "2026-10-28 13:45", ket: "Pesanan dikemas" },
      { waktu: "2026-10-29 08:30", ket: "Paket diserahkan ke kurir JNE" },
      { waktu: "2026-10-31 15:20", ket: "Paket tiba di hub Cikarang" }
    ]
  },
  {
    noDO: "DO2026002", nama: "Siti Aminah", status: 4, ekspedisi: "J&T Express", tanggalKirim: "2026-10-20",
    jenisPaket: "Paket Buku (Express)", totalBayar: 95000,
    perjalanan: [
      { waktu: "2026-10-20 10:00", ket: "Pesanan diterima toko" },
      { waktu: "2026-10-20 14:00", ket: "Pesanan dikemas" },
      { waktu: "2026-10-21 09:00", ket: "Paket diserahkan ke kurir J&T" },
      { waktu: "2026-10-22 11:30", ket: "Paket dalam perjalanan" },
      { waktu: "2026-10-23 13:15", ket: "Paket diterima oleh penerima" }
    ]
  },
  {
    noDO: "DO2026003", nama: "Rizky Pratama", status: 1, ekspedisi: "SiCepat", tanggalKirim: "2026-11-03",
    jenisPaket: "Paket Buku (Reguler)", totalBayar: 270000,
    perjalanan: [
      { waktu: "2026-11-01 16:20", ket: "Pesanan diterima toko" },
      { waktu: "2026-11-02 08:05", ket: "Pesanan sedang dikemas" }
    ]
  }
];

// Data laporan pemesanan & history transaksi awal
const dataPemesanan = [
  { noDO: "DO2026001", tanggal: "2026-10-28", pemesan: "Damar", item: 2, total: 180000, metode: "Transfer Bank", status: "Dalam Perjalanan" },
  { noDO: "DO2026002", tanggal: "2026-10-20", pemesan: "Siti Aminah", item: 1, total: 95000, metode: "E-Wallet", status: "Selesai" },
  { noDO: "DO2026003", tanggal: "2026-11-01", pemesan: "Rizky Pratama", item: 3, total: 270000, metode: "COD", status: "Dikemas" }
];
