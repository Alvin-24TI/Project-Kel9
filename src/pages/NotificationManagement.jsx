import React, { useState, useEffect } from 'react';

export default function NotificationManagement() {

  // DATA NOTIFIKASI
  // Diinisialisasi dengan data dummy awal agar format tabel langsung terlihat rapi
  const [notifList, setNotifList] = useState([
    { idNotif: "IDN001", namaMember: "Alvin Zikrianda", tanggal: "2026-07-07", isi: "Selamat! Poin Sobremessa Anda berhasil ditambahkan." },
    { idNotif: "IDN002", namaMember: "Budi Santoso", tanggal: "2026-07-06", isi: "Diskon 20% khusus untuk pembelian cake hari ini." }
  ]); 
  const [filteredNotifs, setFilteredNotifs] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 

  // FORM INPUT
  const [formData, setFormData] = useState({
    namaMember: "",
    tanggal: "",
    isi: "",
  });

  // ==========================================
  // LOGIKA UTAMA: DEBOUNCE SEARCH
  // ==========================================
  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchTerm.toLowerCase();

      const hasilFilter = notifList.filter((notif) => {
        return (
          notif.idNotif.toLowerCase().includes(query) ||
          notif.namaMember.toLowerCase().includes(query) ||
          notif.tanggal.toLowerCase().includes(query) ||
          notif.isi.toLowerCase().includes(query)
        );
      });

      setFilteredNotifs(hasilFilter);
    }, 500); 

    return () => clearTimeout(timeout);
  }, [searchTerm, notifList]); 

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // TAMBAH NOTIFIKASI
  const tambahNotif = (e) => {
    e.preventDefault();

    if (!formData.namaMember || !formData.tanggal || !formData.isi) {
      alert("Semua field wajib diisi!");
      return;
    }

    // Pembuatan otomatis format IDN001, IDN002, dst.
    const nextIdNumber = notifList.length + 1;
    const formatIDN = `IDN${String(nextIdNumber).padStart(3, '0')}`;

    const notifBaru = {
      idNotif: formatIDN,
      ...formData,
      status: "Terkirim"
    };

    setNotifList([...notifList, notifBaru]);
    alert(`Notifikasi ${formatIDN} berhasil disimpan!`);

    // Reset Form
    setFormData({
      namaMember: "",
      tanggal: "",
      isi: "",
    });
  };

  // HAPUS NOTIFIKASI
  const hapusNotif = (idNotif) => {
    const konfirmasi = confirm(`Yakin ingin menghapus riwayat ${idNotif}?`);
    if (konfirmasi) {
      const filterNotif = notifList.filter((notif) => notif.idNotif !== idNotif);
      setNotifList(filterNotif);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
      <main className="py-8">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Manajemen Notifikasi
            </h1>
          </div>

          {/* INPUT BAR SEARCH */}
          <div className="mb-6 max-w-md">
            <input
              type="text"
              placeholder="Cari histori berdasarkan ID, nama, tanggal, isi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* FORM INPUT NOTIFIKASI (Kiri) */}
            <div className="col-span-full lg:col-span-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5">
                Buat Notifikasi Baru
              </h2>

              <form onSubmit={tambahNotif} className="space-y-4">
                {/* Nama Member */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Nama Member
                  </label>
                  <input
                    type="text"
                    name="namaMember"
                    value={formData.namaMember}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap member"
                    className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  />
                </div>

                {/* Tanggal Notif */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Tanggal Notifikasi
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  />
                </div>

                {/* Isi Notif */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Isi Notifikasi
                  </label>
                  <textarea
                    name="isi"
                    rows="4"
                    value={formData.isi}
                    onChange={handleChange}
                    placeholder="Tulis pesan atau info pengingat di sini..."
                    className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm resize-none"
                  ></textarea>
                </div>

                {/* BUTTON SUBMIT */}
                <button
                  type="submit"
                  className="w-full btn bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm shadow-sm"
                >
                  Kirim & Simpan Notif
                </button>
              </form>
            </div>

            {/* TABLE HISTORI NOTIFIKASI (Kanan) */}
            <div className="col-span-full lg:col-span-7 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  Histori Notifikasi Terinput ({filteredNotifs.length})
                </h2>
              </header>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full dark:text-gray-300">
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">ID Notif</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Nama Member</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Tanggal</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Isi Notifikasi</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Aksi</div></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredNotifs.length > 0 ? (
                        filteredNotifs.map((notif) => (
                          <tr key={notif.idNotif} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                            <td className="p-2 whitespace-nowrap">
                              <div className="font-bold text-violet-600 dark:text-violet-400">{notif.idNotif}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="font-medium text-gray-800 dark:text-gray-100">{notif.namaMember}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-gray-500 text-xs">{notif.tanggal}</div>
                            </td>
                            <td className="p-2 max-w-xs md:max-w-sm">
                              <div className="truncate text-gray-600 dark:text-gray-400 text-xs" title={notif.isi}>
                                {notif.isi}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => hapusNotif(notif.idNotif)}
                                  className="text-xs bg-red-50/80 hover:bg-red-500 text-red-600 hover:text-white font-medium py-1 px-3 rounded-lg transition-all"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-400 dark:text-gray-500">
                            Tidak ada histori notifikasi yang sesuai pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}