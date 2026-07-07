import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function InputTransaksiMember() {
  const location = useLocation();
  const [memberName, setMemberName] = useState(location.state?.namaMember || '');
  // product selection: dropdown domain + readonly input showing chosen product
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const products = [
    { name: 'Blueberry Cheesecake Loyang', price: 185000 },
    { name: 'Original Cheesecake Loyang', price: 160000 },
    { name: 'Sourdough Country Loaf', price: 75000 },
    { name: 'Sourdough Brioche Multigrain', price: 65000 },
    { name: 'Sourdough Brioche Original', price: 60000 },
    { name: 'Sourdough Tuna Sandwich', price: 55000 },
    { name: 'Blueberry Cheesecake Slice', price: 45000 },
    { name: 'Original Cheesecake Slice', price: 40000 },
    { name: 'Matilda Chocolate Cake Slice', price: 40000 },
    { name: 'Mont Blanc', price: 38000 },
    { name: 'Ice Shaken Palm Sugar', price: 35000 },
    { name: 'Awan Nyiur', price: 35000 },
    { name: 'Mozzarella Pepperoni', price: 35000 },
    { name: 'Sourdough Kaya Toast Double', price: 35000 },
    { name: 'Tiramisu', price: 35000 },
    { name: 'Scrambled Eggs with Mushroom', price: 30000 },
    { name: 'Earl Grey Latte', price: 30000 },
    { name: 'Citrus Berry', price: 30000 },
    { name: 'Limoncello', price: 30000 },
    { name: 'Potato Wedges', price: 30000 },
    { name: 'White', price: 28000 },
    { name: 'Lychee Tea', price: 28000 },
    { name: 'Black', price: 25000 },
    { name: 'Sourdough Kaya Toast Single', price: 25000 },
    { name: 'Espresso', price: 20000 },
    { name: 'Mineral Water', price: 8000 }
  ];
  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!memberName || !productName || !quantity) {
      setMessage({ type: 'error', text: 'Semua bidang input wajib diisi!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Cek apakah member terdaftar
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('id, points, name')
        .ilike('name', `%${memberName}%`)
        .limit(1)
        .single();

      if (memberError || !member) {
        throw new Error('Member tidak ditemukan di sistem!');
      }

      // 2. Hitung poin baru berdasarkan total harga produk: 1 poin per Rp 1.000
      const jumlah = parseInt(quantity, 10) || 0;
      const amount = (productPrice || 0) * jumlah;
      const poinDiperoleh = Math.floor(amount / 1000);
      const totalPoinBaru = member.points + poinDiperoleh;

      // 3. Catat riwayat ke tabel transactions (simpan amount, produk, quantity)
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{ member_id: member.id, amount: amount, points_earned: poinDiperoleh, product_name: productName, product_price: productPrice, quantity: jumlah }]);

      if (txError) throw txError;

      // 4. Update total poin member bersangkutan
      const { error: updateError } = await supabase
        .from('members')
        .update({ points: totalPoinBaru })
        .eq('id', member.id);

      if (updateError) throw updateError;

      setMessage({
        type: 'success',
        text: `Transaksi sukses! ${member.name} membeli ${productName} (${jumlah} pcs) — Total: Rp ${amount.toLocaleString('id-ID')} — mendapatkan +${poinDiperoleh} Pts. Total poin sekarang: ${totalPoinBaru} Pts.`
      });
      // Keep `memberName` so cashier can continue transactions for same member.
      setProductName('');
      setProductPrice(0);
      setQuantity('1');
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100">Input Transaksi Kasir</h1>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-[30px] shadow-2xl border border-gray-200 dark:border-gray-700">
        {message && (
          <div className={`mb-4 p-4 text-sm rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleTransaction} className="space-y-7">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nama Member</label>
            <input
              type="text"
              value={memberName}
              readOnly
              className="form-input w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-100"
              placeholder="Masukkan nama member"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Pilih Produk</label>
            <div className="flex gap-3">
              <select
                value={productName}
                onChange={(e) => {
                  const sel = products.find(p => p.name === e.target.value);
                  setProductName(e.target.value);
                  setProductPrice(sel ? sel.price : 0);
                }}
                className="form-select w-2/5 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-100"
                disabled={loading}
                required
              >
                <option value="">-- Pilih Produk --</option>
                {products.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} — Rp {p.price.toLocaleString('id-ID')}</option>
                ))}
              </select>

              <input
                type="text"
                value={productName}
                readOnly
                className="form-input flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-100"
                placeholder="Produk terpilih"
                disabled
              />
            </div>
            <div className="mt-2 text-sm text-gray-500">Harga: <strong>Rp {productPrice.toLocaleString('id-ID')}</strong></div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Jumlah</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="form-input w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl text-sm text-gray-800 dark:text-gray-100"
              placeholder="Contoh: 2"
              disabled={loading}
            />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              Poin akan bertambah berdasarkan jumlah produk yang dibeli.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Proses Transaksi Poin'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputTransaksiMember;