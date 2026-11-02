/* script.js - logika semua halaman BukuKita (data dari data.js) */

/* ================= Helper ================= */
const $ = (sel) => document.querySelector(sel);
const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const simpan = (key, nilai) => localStorage.setItem(key, JSON.stringify(nilai));
const ambil = (key, awal) => JSON.parse(localStorage.getItem(key)) ?? awal;
const esc = (teks) => String(teks).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ================= Akses data ================= */
const getUsers = () => dataPengguna.concat(ambil("users", []));
const getKatalog = () => ambil("katalog", dataKatalogBuku.map((b) => ({ ...b })));
const getPemesanan = () => dataPemesanan.concat(ambil("pemesananBaru", []));
const getTracking = () => dataTracking.concat(ambil("trackingBaru", []));
const sesi = () => ambil("sesi", null);

/* ================= Modal (pop-up) ================= */
function bukaModal(judul, isi) {
  let dlg = $("#modal");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "modal";
    document.body.append(dlg);
  }
  dlg.innerHTML = `<h2>${judul}</h2>${isi}<button type="button" class="btn btn-garis tutup">Tutup</button>`;
  dlg.querySelector(".tutup").onclick = () => dlg.close();
  dlg.onclick = (e) => { if (e.target === dlg) dlg.close(); };
  dlg.showModal();
  return dlg;
}

/* ================= Header & sesi ================= */
function renderHeader() {
  const menu = [["dashboard", "Dashboard"], ["stok", "Katalog"], ["checkout", "Pemesanan"], ["tracking", "Tracking"]];
  const aktif = document.body.dataset.page;
  const link = menu.map(([h, t]) => `<a href="${h}.html" class="${h === aktif ? "aktif" : ""}">${t}</a>`).join("");
  $("#header").innerHTML = `
    <div class="wadah bar">
      <a class="brand" href="dashboard.html"><img src="assets/logo.png" alt="">BukuKita</a>
      <nav>${link}</nav>
      <span>👤 ${esc(sesi().nama)} <button type="button" id="logout" class="btn btn-garis">Logout</button></span>
    </div>`;
  $("#logout").onclick = () => {
    localStorage.removeItem("sesi");
    location.href = "index.html";
  };
}

/* ================= 1. Login ================= */
function initLogin() {
  $("#form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim().toLowerCase();
    const password = $("#password").value;
    const user = getUsers().find((u) => u.email === email && u.password === password);

    if (!user) {
      alert("Email/password yang anda masukkan salah");
      return;
    }
    simpan("sesi", { nama: user.nama, email: user.email });
    location.href = "dashboard.html";
  });

  $("#btn-lupa").onclick = () => {
    const dlg = bukaModal("Lupa Password", `
      <form id="form-lupa" novalidate>
        <div class="form-grup"><label for="lupa-email">Email terdaftar</label><input type="email" id="lupa-email"></div>
        <button type="submit" class="btn btn-penuh">Kirim Link Reset</button>
      </form>`);
    dlg.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const email = $("#lupa-email").value.trim().toLowerCase();
      if (!getUsers().some((u) => u.email === email)) return alert("Email tidak terdaftar.");
      alert("Link reset password telah dikirim ke " + email);
      dlg.close();
    };
  };

  $("#btn-daftar").onclick = () => {
    const dlg = bukaModal("Daftar Akun", `
      <form id="form-daftar" novalidate>
        <div class="form-grup"><label for="d-nama">Nama</label><input type="text" id="d-nama"></div>
        <div class="form-grup"><label for="d-email">Email</label><input type="email" id="d-email"></div>
        <div class="form-grup"><label for="d-pw">Password (min. 6 karakter)</label><input type="password" id="d-pw"></div>
        <button type="submit" class="btn btn-penuh">Daftar</button>
      </form>`);
    dlg.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const nama = $("#d-nama").value.trim();
      const email = $("#d-email").value.trim().toLowerCase();
      const password = $("#d-pw").value;

      if (!nama || !/^\S+@\S+\.\S+$/.test(email)) return alert("Nama dan email wajib diisi dengan benar.");
      if (password.length < 6) return alert("Password minimal 6 karakter.");
      if (getUsers().some((u) => u.email === email)) return alert("Email sudah terdaftar.");

      simpan("users", ambil("users", []).concat({ nama, email, password }));
      alert("Pendaftaran berhasil. Silakan login.");
      dlg.close();
    };
  };
}

/* ================= 2. Dashboard ================= */
function sapaan(jam) {
  if (jam >= 5 && jam < 11) return "Selamat Pagi";
  if (jam >= 11 && jam < 15) return "Selamat Siang";
  if (jam >= 15 && jam < 18) return "Selamat Sore";
  return "Selamat Malam";
}

function initDashboard() {
  const sekarang = new Date();
  $("#greeting").textContent = `${sapaan(sekarang.getHours())}, ${sesi().nama}!`;
  $("#waktu-lokal").textContent = sekarang.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" });

  $("#menu-laporan").onclick = () => {
    const data = getPemesanan();
    const pendapatan = data.reduce((sum, p) => sum + p.total, 0);
    const perStatus = {};
    data.forEach((p) => { perStatus[p.status] = (perStatus[p.status] || 0) + 1; });
    const baris = Object.entries(perStatus).map(([s, j]) => `<tr><td>${s}</td><td>${j}</td></tr>`).join("");
    bukaModal("Laporan Pemesanan", `
      <p>Total pesanan: <strong>${data.length}</strong><br>
         Total item: <strong>${data.reduce((sum, p) => sum + p.item, 0)}</strong><br>
         Total pendapatan: <strong>${rupiah(pendapatan)}</strong></p>
      <table><thead><tr><th>Status</th><th>Jumlah</th></tr></thead><tbody>${baris}</tbody></table>`);
  };

  $("#menu-history").onclick = () => {
    const baris = getPemesanan().map((p) => `
      <tr><td>${p.noDO}</td><td>${p.tanggal}</td><td>${esc(p.pemesan)}</td><td>${rupiah(p.total)}</td><td>${p.status}</td></tr>`).join("");
    bukaModal("History Transaksi", `
      <div class="tabel-wrap"><table>
        <thead><tr><th>No. DO</th><th>Tanggal</th><th>Pemesan</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${baris}</tbody></table></div>`);
  };
}

/* ================= 3. Stok / Katalog ================= */
function statusStok(stok) {
  if (stok === 0) return ["Habis", "habis"];
  if (stok <= 5) return ["Menipis", "menipis"];
  return ["Tersedia", "tersedia"];
}

function buatBaris(b) {
  const [label, kelas] = statusStok(b.stok);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><img class="cover" src="${esc(b.gambar)}" alt="Sampul ${esc(b.judul)}"></td>
    <td>${esc(b.kode)}</td>
    <td>${esc(b.judul)}<span class="penulis">${esc(b.penulis)}</span></td>
    <td>${esc(b.kategori)}</td>
    <td>${rupiah(b.harga)}</td>
    <td>${b.stok}</td>
    <td><span class="badge ${kelas}">${label}</span></td>`;
  return tr;
}

function initStok() {
  const katalog = getKatalog();
  const tbody = $("#tbody-katalog");
  katalog.forEach((b) => tbody.append(buatBaris(b)));

  $("#form-stok").addEventListener("submit", (e) => {
    e.preventDefault();
    const buku = {
      kode: $("#s-kode").value.trim().toUpperCase(),
      judul: $("#s-judul").value.trim(),
      penulis: $("#s-penulis").value.trim(),
      kategori: $("#s-kategori").value.trim(),
      harga: Number($("#s-harga").value),
      stok: Number($("#s-stok").value),
      gambar: "img/default.png"
    };

    if (!buku.kode || !buku.judul || !buku.penulis || !buku.kategori) return alert("Semua kolom wajib diisi.");
    if ($("#s-harga").value === "" || $("#s-stok").value === "" || buku.harga < 0 || buku.stok < 0) return alert("Harga dan stok harus berupa angka 0 atau lebih.");
    if (katalog.some((b) => b.kode === buku.kode)) return alert("Kode buku sudah ada.");

    katalog.push(buku);
    simpan("katalog", katalog);
    tbody.append(buatBaris(buku)); // tambah baris baru lewat DOM
    e.target.reset();
    alert("Buku berhasil ditambahkan.");
  });
}

/* ================= 4. Checkout / Pemesanan ================= */
function initCheckout() {
  const katalog = getKatalog();
  const keranjang = []; // { kode, qty }
  const tbody = $("#tbody-keranjang");
  const cari = (kode) => katalog.find((b) => b.kode === kode);

  $("#pilih-buku").innerHTML = katalog.filter((b) => b.stok > 0)
    .map((b) => `<option value="${b.kode}">${esc(b.judul)} - ${rupiah(b.harga)} (stok ${b.stok})</option>`).join("");
  $("#nama").value = sesi().nama;

  const total = () => keranjang.reduce((sum, i) => sum + cari(i.kode).harga * i.qty, 0);

  function render() {
    tbody.innerHTML = "";
    keranjang.forEach((item, idx) => {
      const b = cari(item.kode);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${esc(b.judul)}</td>
        <td>${rupiah(b.harga)}</td>
        <td><input type="number" min="1" max="${b.stok}" value="${item.qty}" data-idx="${idx}"></td>
        <td>${rupiah(b.harga * item.qty)}</td>
        <td><button type="button" class="btn btn-garis" data-hapus="${idx}">Hapus</button></td>`;
      tbody.append(tr);
    });
    $("#total").textContent = rupiah(total());
  }

  $("#btn-tambah").onclick = () => {
    const kode = $("#pilih-buku").value;
    const qty = Number($("#qty").value);
    if (!kode) return alert("Tidak ada buku yang tersedia.");
    if (!Number.isInteger(qty) || qty < 1) return alert("Jumlah minimal 1.");

    const ada = keranjang.find((i) => i.kode === kode);
    const terpakai = ada ? ada.qty : 0;
    if (terpakai + qty > cari(kode).stok) return alert("Jumlah melebihi stok yang tersedia.");

    if (ada) ada.qty += qty;
    else keranjang.push({ kode, qty });
    render();
  };

  // ubah jumlah & hapus baris (event delegation)
  tbody.addEventListener("change", (e) => {
    const idx = e.target.dataset.idx;
    if (idx === undefined) return;
    const item = keranjang[idx];
    const maks = cari(item.kode).stok;
    item.qty = Math.min(Math.max(parseInt(e.target.value) || 1, 1), maks);
    render();
  });
  tbody.addEventListener("click", (e) => {
    if (e.target.dataset.hapus === undefined) return;
    keranjang.splice(e.target.dataset.hapus, 1);
    render();
  });

  $("#form-pesan").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = $("#nama").value.trim();
    const telp = $("#telp").value.trim();
    const alamat = $("#alamat").value.trim();

    if (keranjang.length === 0) return alert("Keranjang masih kosong. Tambahkan buku terlebih dahulu.");
    if (!nama || !alamat) return alert("Nama dan alamat wajib diisi.");
    if (!/^08\d{8,11}$/.test(telp)) return alert("No. telepon tidak valid (contoh: 08123456789).");

    const noDO = "DO" + new Date().getFullYear() + String(getPemesanan().length + 1).padStart(3, "0");
    const hariIni = new Date().toISOString().slice(0, 10);
    const jumlahItem = keranjang.reduce((sum, i) => sum + i.qty, 0);

    simpan("pemesananBaru", ambil("pemesananBaru", []).concat({
      noDO, tanggal: hariIni, pemesan: nama, item: jumlahItem,
      total: total(), metode: $("#metode").value, status: "Diterima"
    }));
    simpan("trackingBaru", ambil("trackingBaru", []).concat({
      noDO, nama, status: 0, ekspedisi: $("#ekspedisi").value, tanggalKirim: hariIni,
      jenisPaket: "Paket Buku (Reguler)", totalBayar: total(),
      perjalanan: [{ waktu: new Date().toLocaleString("id-ID"), ket: "Pesanan diterima toko" }]
    }));

    keranjang.forEach((i) => { cari(i.kode).stok -= i.qty; }); // kurangi stok
    simpan("katalog", katalog);

    alert(`Pesanan berhasil dibuat!\nNomor DO Anda: ${noDO}`);
    location.reload();
  });
}

/* ================= 5. Tracking ================= */
function initTracking() {
  const tahap = ["Diterima", "Dikemas", "Dikirim", "Dalam Perjalanan", "Selesai"];
  const hasil = $("#hasil");

  $("#form-cari").addEventListener("submit", (e) => {
    e.preventDefault();
    const no = $("#no-do").value.trim().toUpperCase();
    if (!no) return alert("Nomor Delivery Order wajib diisi.");

    const d = getTracking().find((t) => t.noDO === no);
    if (!d) {
      hasil.hidden = true;
      return alert("Nomor Delivery Order tidak ditemukan.");
    }

    const persen = (d.status / (tahap.length - 1)) * 100;
    hasil.innerHTML = `
      <h2>${d.noDO}</h2>
      <dl class="detail">
        <dt>Nama Pemesan</dt><dd>${esc(d.nama)}</dd>
        <dt>Status</dt><dd>${tahap[d.status]}</dd>
        <dt>Ekspedisi</dt><dd>${esc(d.ekspedisi)}</dd>
        <dt>Tanggal Kirim</dt><dd>${new Date(d.tanggalKirim).toLocaleDateString("id-ID", { dateStyle: "long" })}</dd>
        <dt>Jenis Paket</dt><dd>${esc(d.jenisPaket)}</dd>
        <dt>Total Pembayaran</dt><dd>${rupiah(d.totalBayar)}</dd>
      </dl>
      <div class="progress"><div style="width:${persen}%"></div></div>
      <div class="langkah">${tahap.map((t, i) => `<span class="${i <= d.status ? "aktif" : ""}">${t}</span>`).join("")}</div>
      <ul class="riwayat">${d.perjalanan.map((p) => `<li>${p.waktu} - ${esc(p.ket)}</li>`).join("")}</ul>`;
    hasil.hidden = false;
  });
}

/* ================= Inisialisasi ================= */
const halaman = document.body.dataset.page;
if (halaman !== "login") {
  if (!sesi()) location.href = "index.html";
  else renderHeader();
}
const inisialisasi = { login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking };
if (halaman === "login" || sesi()) inisialisasi[halaman]();
