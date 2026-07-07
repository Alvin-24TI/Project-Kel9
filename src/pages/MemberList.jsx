import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../lib/supabaseClient'; // Pastikan path ke client Supabase sudah benar

function MemberList() {
  const navigate = useNavigate();

  // State Utama
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current) return;

    setScannerError('');
    setScannerActive(true);

    try {
      const html5QrCode = new Html5Qrcode('member-list-scanner');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const scannedId = url.searchParams.get('id') || decodedText;
            if (scannedId) {
              setScannerActive(false);
              html5QrCode.stop().catch(() => {});
              navigate(`/member-detail?id=${scannedId}`);
            }
          } catch {
            if (decodedText) {
              setScannerActive(false);
              html5QrCode.stop().catch(() => {});
              navigate(`/member-detail?id=${decodedText}`);
            }
          }
        },
        () => {}
      );
    } catch {
      setScannerError('Tidak bisa mengakses kamera. Pastikan izin kamera sudah aktif.');
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch {}
    }
    setScannerActive(false);
    setScannerError('');
  };

  // useEffect untuk mengambil data secara dinamis dari Supabase
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        // Ambil query data dari tabel 'members'
        let query = supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: false });

        // Fitur Pencarian: Jika user mengetik, filter berdasarkan kolom 'name' di database
        if (searchTerm.trim() !== '') {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        setFilteredMembers(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce 500ms untuk menghemat kuota request ke database

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Fungsi tombol navigasi detail via query params
  const handleViewDetail = (member) => {
    navigate(`/member-detail?id=${member.id}&name=${encodeURIComponent(member.name)}&points=${member.points}&phone=${member.phone}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Data Member Terdaftar</h1>
        </div>
      </div>

      {/* Tampilan Error jika database bermasalah */}
      {error && (
        <div className="mb-5 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-400">Scan QR Member</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pindai QR member dari laptop untuk langsung membuka profilnya.</p>
          </div>
          <div className="flex items-center gap-2">
            {!scannerActive ? (
              <button
                type="button"
                onClick={startScanner}
                className="rounded-lg bg-amber-700 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-800"
              >
                Buka Kamera
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {scannerActive ? (
          <div ref={scannerRef} className="mt-3 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            <div id="member-list-scanner" className="min-h-[240px] w-full bg-black" />
          </div>
        ) : (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Gunakan kamera untuk memindai QR member dari halaman ini.</p>
        )}

        {scannerError && <p className="mt-2 text-xs text-red-600">{scannerError}</p>}
      </div>

      {/* Input Form Pencarian */}
      <div className="mb-5 max-w-md">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:border-emerald-500 focus:ring-0"
        />
      </div>

      {/* Wadah Tabel (Card Container) */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            Semua Member ({filteredMembers.length})
          </h2>
        </header>
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              {/* Header Tabel */}
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">ID Member</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Nama</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">No. Telepon</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Poin</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Tgl Bergabung</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Aksi</div></th>
                </tr>
              </thead>
              
              {/* Isi Badan Tabel */}
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400 animate-pulse">
                      Menghubungkan ke cloud database...
                    </td>
                  </tr>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      {/* ID Member (UUID dari Supabase) */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-mono font-medium text-gray-800 dark:text-gray-100 text-xs truncate max-w-[120px]" title={member.id}>
                          {member.id}
                        </div>
                      </td>
                      {/* Nama Member (Bisa diklik sebagai link alternatif) */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-medium">
                          <Link
                            to={`/member-detail?id=${member.id}&name=${encodeURIComponent(member.name)}&points=${member.points}&phone=${member.phone}`}
                            className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold transition-colors"
                          >
                            {member.name}
                          </Link>
                        </div>
                      </td>
                      {/* Nomor Telepon */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-gray-600 dark:text-gray-400">{member.phone}</div>
                      </td>
                      {/* Poin Member */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-bold text-amber-600 dark:text-amber-400">
                          {member.points} Pts
                        </div>
                      </td>
                      {/* Tanggal Bergabung */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left text-gray-500 dark:text-gray-400">
                          {new Date(member.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </div>
                      </td>
                      {/* Kolom Tombol Aksi */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          <button
                            onClick={() => handleViewDetail(member)}
                            className="text-xs bg-violet-500 hover:bg-violet-600 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                          >
                            Lihat QR / Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400 dark:text-gray-500">
                      Tidak ada data member di dalam database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberList;