import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { supabase } from '../lib/supabaseClient';

function InputTransaksiMember() {
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
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
      const html5QrCode = new Html5Qrcode("scanner-region");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const scannedId = url.searchParams.get('id') || decodedText;
            if (scannedId) {
              setMemberId(scannedId);
              setScannerActive(false);
              html5QrCode.stop().catch(() => {});
            }
          } catch {
            if (decodedText) {
              setMemberId(decodedText);
              setScannerActive(false);
              html5QrCode.stop().catch(() => {});
            }
          }
        },
        () => {}
      );
    } catch (err) {
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

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!memberId || !amount) {
      setMessage({ type: 'error', text: 'Semua bidang input wajib diisi!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Cek apakah member terdaftar
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('points, name')
        .eq('id', memberId)
        .single();

      if (memberError || !member) {
        throw new Error('ID Member tidak ditemukan di sistem!');
      }

      // 2. Hitung poin baru (Contoh Rumus: Rp 10.000 = 10 Poin)
      const nominalBelanja = parseFloat(amount);
      const poinDiperoleh = Math.floor(nominalBelanja / 10000) * 10;
      const totalPoinBaru = member.points + poinDiperoleh;

      // 3. Catat riwayat ke tabel transactions
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{ member_id: memberId, amount: nominalBelanja, points_earned: poinDiperoleh }]);

      if (txError) throw txError;

      // 4. Update total poin member bersangkutan
      const { error: updateError } = await supabase
        .from('members')
        .update({ points: totalPoinBaru })
        .eq('id', memberId);

      if (updateError) throw updateError;

      setMessage({
        type: 'success',
        text: `Transaksi sukses! ${member.name} mendapatkan +${poinDiperoleh} Pts. Total poin sekarang: ${totalPoinBaru} Pts.`
      });
      setMemberId('');
      setAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Input Transaksi Kasir</h1>
      </div>

      <div className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {message && (
          <div className={`mb-4 p-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleTransaction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">ID Member (Ketik / Hasil Scan)</label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-100"
              placeholder="Masukkan UUID Member"
              disabled={loading}
            />
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Scan QR Member</span>
              {!scannerActive ? (
                <button
                  type="button"
                  onClick={startScanner}
                  className="text-xs bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg"
                >
                  Buka Kamera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopScanner}
                  className="text-xs bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg"
                >
                  Stop
                </button>
              )}
            </div>

            {scannerActive ? (
              <div ref={scannerRef} className="w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <div id="scanner-region" className="w-full min-h-[240px] bg-black" />
              </div>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Gunakan kamera untuk memindai QR code member dan ID akan otomatis terisi.</p>
            )}

            {scannerError && (
              <p className="mt-2 text-xs text-red-600">{scannerError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Total Belanja (Rupiah)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
              placeholder="Contoh: 50000"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Proses Transaksi Poin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputTransaksiMember;