import React, { useState, useEffect } from 'react'; // Tambah useEffect di sini
import dummyPromos from '../Data/promoData.json';

export default function PromoMembership() {

  // DATA PROMO 
  const [promoList, setPromoList] = useState(dummyPromos); // State Master data asli
  const [filteredPromos, setFilteredPromos] = useState(dummyPromos); // State data yang tampil di tabel
  const [searchTerm, setSearchTerm] = useState(''); // State penampung text input pencarian

  // FORM INPUT
  const [formData, setFormData] = useState({
    nama: "",
    jenis: "",
    target: "",
    periode: "",
  });

  // ==========================================
  // LOGIKA UTAMA: DEBOUNCE SEARCH (TANPA AXIOS)sdsd
  // ==========================================
  useEffect(() => {
    // Beri jeda 500ms sebelum menyaring data secara lokal
    const timeout = setTimeout(() => {
      const query = searchTerm.toLowerCase();

      const hasilFilter = promoList.filter((promo) => {
        return (
          promo.nama.toLowerCase().includes(query) ||
          promo.jenis.toLowerCase().includes(query) ||
          promo.target.toLowerCase().includes(query) ||
          promo.periode.toLowerCase().includes(query)
        );
      });

      setFilteredPromos(hasilFilter);
    }, 500); // 500ms debounce

    // Cleanup function: Membatalkan proses filter jika user mengetik huruf baru sebelum 500ms
    return () => clearTimeout(timeout);
  }, [searchTerm, promoList]); // Berjalan otomatis jika ketikan search atau data master berubah
  // ==========================================

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // TAMBAH PROMO
  const tambahPromo = (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.jenis || !formData.target || !formData.periode) {
      alert("Semua field wajib diisi!");
      return;
    }

    const maxId = promoList.length > 0 ? Math.max(...promoList.map(p => p.id)) : 0;

    const promoBaru = {
      id: maxId + 1,
      ...formData,
      status: "Aktif",
    };

    // Tambah ke data master (useEffect di atas akan otomatis memperbarui filteredPromos)
    setPromoList([...promoList, promoBaru]);
    alert("Promo berhasil ditambahkan!");

    setFormData({
      nama: "",
      jenis: "",
      target: "",
      periode: "",
    });
  };

  // HAPUS PROMO
  const hapusPromo = (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus promo?");
    if (konfirmasi) {
      const filterPromo = promoList.filter((promo) => promo.id !== id);
      setPromoList(filterPromo);
    }
  };

  // UBAH STATUS
  const toggleStatus = (id) => {
    const updatedPromo = promoList.map((promo) => {
      if (promo.id === id) {
        return {
          ...promo,
          status: promo.status === "Aktif" ? "Nonaktif" : "Aktif",
        };
      }
      return promo;
    });
    setPromoList(updatedPromo);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
      <main className="py-8">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
              Promo Membership
            </h1>
          </div>

          {/* INPUT BAR SEARCH (Tambahan agar fungsi input berjalan rapi) */}
          <div className="mb-6 max-w-md">
            <input
              type="text"
              placeholder="Cari promo berdasarkan nama, jenis, target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* FORM TAMBAH PROMO (Kiri) */}
            <div className="col-span-full lg:col-span-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5">
                Tambah Promo Baru
              </h2>

              <form onSubmit={tambahPromo} className="space-y-4">
                {/* Nama Promo */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Nama Promo
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Contoh: Cashback Akhir Tahun"
                    className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  />
                </div>

                {/* Jenis Promo */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Jenis Promo
                  </label>
                  <select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleChange}
                    className="form-select w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  >
                    <option value="">Pilih Jenis</option>
                    <option value="Diskon">Diskon</option>
                    <option value="Reward">Reward</option>
                    <option value="Cashback">Cashback</option>
                    <option value="Double Point">Double Point</option>
                  </select>
                </div>

                {/* Target Member */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Target Member
                  </label>
                  <select
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    className="form-select w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  >
                    <option value="">Pilih Target</option>
                    <option value="Semua Member">Semua Member</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                  </select>
                </div>

                {/* Periode */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Periode Promo
                  </label>
                  <input
                    type="text"
                    name="periode"
                    value={formData.periode}
                    onChange={handleChange}
                    placeholder="Contoh: 01 Juni - 30 Juni 2026"
                    className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full btn bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Simpan Promo
                </button>
              </form>
            </div>

            {/* TABLE LIST PROMO (Kanan) */}
            <div className="col-span-full lg:col-span-7 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
              <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  {/* Total data dinamis mengikuti filteredPromos */}
                  Daftar Promo Aktif ({filteredPromos.length})
                </h2>
              </header>
              <div className="p-3">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full dark:text-gray-300">
                    <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Nama Promo</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Jenis</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Target</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Periode</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Status</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Aksi</div></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredPromos.length > 0 ? (
                        filteredPromos.map((promo) => (
                          <tr key={promo.id}>
                            <td className="p-2 whitespace-nowrap">
                              <div className="font-medium text-gray-800 dark:text-gray-100">{promo.nama}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div>{promo.jenis}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-violet-500 font-medium">{promo.target}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-gray-500 text-xs">{promo.periode}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <span
                                className={`inline-flex font-medium text-xs rounded-full px-2.5 py-0.5 ${
                                  promo.status === "Aktif"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                    : "bg-red-500/20 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {promo.status}
                              </span>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => toggleStatus(promo.id)}
                                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium py-1 px-2.5 rounded transition-colors"
                                >
                                  Toggle
                                </button>
                                <button
                                  onClick={() => hapusPromo(promo.id)}
                                  className="text-xs bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white font-medium py-1 px-2.5 rounded transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-4 text-center text-gray-400">Tidak ada data promo tersedia.</td>
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