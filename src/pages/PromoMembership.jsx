import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const PROMO_TABLE = 'promos'; // Ganti nama tabel jika di Supabase Anda menggunakan nama lain

export default function PromoMembership() {

  // DATA PROMO 
  const [promoList, setPromoList] = useState([]); // State Master data asli
  const [filteredPromos, setFilteredPromos] = useState([]); // State data yang tampil di tabel
  const [searchTerm, setSearchTerm] = useState(''); // State penampung text input pencarian
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const preMemberId = searchParams.get('memberId');

  // FORM INPUT
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    point_cost: "",
  });

  // ==========================================
  // LOGIKA UTAMA: DEBOUNCE SEARCH (TANPA AXIOS)sdsd
  // ==========================================
  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      setError('');

      const { data, error: supabaseError } = await supabase
        .from(PROMO_TABLE)
        .select('*')
        .order('id', { ascending: false });

      if (supabaseError) {
        setError(supabaseError.message || 'Gagal mengambil data promo dari Supabase.');
        setPromoList([]);
        setFilteredPromos([]);
      } else {
        setPromoList(data || []);
        setFilteredPromos(data || []);
      }

      setLoading(false);
    };

    fetchPromos();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const query = searchTerm.toLowerCase();

      const hasilFilter = promoList.filter((promo) => {
        return (
          (promo.title || '').toLowerCase().includes(query) ||
          (promo.description || '').toLowerCase().includes(query) ||
          (promo.point_cost?.toString() || '').toLowerCase().includes(query) ||
          ((promo.is_active ? 'aktif' : 'nonaktif') || '').toLowerCase().includes(query)
        );
      });

      setFilteredPromos(hasilFilter);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeout);
  }, [searchTerm, promoList]);
  // ==========================================

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // TAMBAH PROMO
  const tambahPromo = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.point_cost) {
      alert("Semua field wajib diisi!");
      return;
    }

    const promoBaru = {
      title: formData.title,
      description: formData.description,
      point_cost: Number(formData.point_cost),
      is_active: true,
    };

    const { data, error: supabaseError } = await supabase
      .from(PROMO_TABLE)
      .insert([promoBaru])
      .select();

    if (supabaseError) {
      alert(`Gagal menambahkan promo: ${supabaseError.message}`);
      return;
    }

    setPromoList([...(promoList || []), ...(data || [])]);
    setFormData({ title: "", description: "", point_cost: "" });
    alert("Promo berhasil ditambahkan!");
  };

  // HAPUS PROMO
  const hapusPromo = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus promo?");
    if (!konfirmasi) return;

    const { error: supabaseError } = await supabase
      .from(PROMO_TABLE)
      .delete()
      .eq('id', id);

    if (supabaseError) {
      alert(`Gagal menghapus promo: ${supabaseError.message}`);
      return;
    }

    setPromoList(promoList.filter((promo) => promo.id !== id));
  };

  // UBAH STATUS
  const toggleStatus = async (id) => {
    const promo = promoList.find((promo) => promo.id === id);
    if (!promo) return;

    const nextStatus = !promo.is_active;

    const { error: supabaseError } = await supabase
      .from(PROMO_TABLE)
      .update({ is_active: nextStatus })
      .eq('id', id);

    if (supabaseError) {
      alert(`Gagal mengubah status promo: ${supabaseError.message}`);
      return;
    }

    setPromoList(
      promoList.map((item) =>
        item.id === id ? { ...item, is_active: nextStatus } : item
      )
    );
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
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* FORM TAMBAH PROMO (Kiri) */}
            <div className="col-span-full lg:col-span-5 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5">
                Tambah Promo Baru
              </h2>

              <form onSubmit={tambahPromo} className="space-y-4">
                {/* Judul Promo */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Judul Promo
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Contoh: Cashback Akhir Tahun"
                    className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  />
                </div>

                {/* Deskripsi Promo */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Deskripsi Promo
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Contoh: Dapatkan 10% cashback untuk semua pembelian"
                    className="form-textarea w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                    rows={3}
                  />
                </div>

                {/* Biaya Poin */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Point Cost
                  </label>
                  <input
                    type="number"
                    name="point_cost"
                    value={formData.point_cost}
                    onChange={handleChange}
                    placeholder="Contoh: 250"
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
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Judul Promo</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Deskripsi</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Point Cost</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Status</div></th>
                        <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Aksi</div></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredPromos.length > 0 ? (
                        filteredPromos.map((promo) => (
                          <tr key={promo.id}>
                            <td className="p-2 whitespace-nowrap">
                              <div className="font-medium text-gray-800 dark:text-gray-100">{promo.title}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-gray-500 text-sm">{promo.description}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-violet-500 font-medium">{promo.point_cost}</div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <span
                                className={`inline-flex font-medium text-xs rounded-full px-2.5 py-0.5 ${
                                  promo.is_active
                                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                    : "bg-red-500/20 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {promo.is_active ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => navigate(`/tukar-promo/${promo.id}${preMemberId ? `?memberId=${encodeURIComponent(preMemberId)}` : ''}`)}
                                  className="text-xs bg-emerald-100 dark:bg-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-100 font-medium py-1 px-2.5 rounded transition-colors"
                                >
                                  Tukarkan
                                </button>
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