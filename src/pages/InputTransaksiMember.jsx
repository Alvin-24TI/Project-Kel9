import React, { useState, useEffect } from 'react';

function InputTransaksiMember() {
    // State untuk menyimpan input transaksi (tanpa pricePerUnit)
    const [transactionData, setTransactionData] = useState({
        memberName: '',
        productName: '',
        orderDate: new Date().toISOString().split('T')[0], // Default ke tanggal hari ini (YYYY-MM-DD)
        quantity: 1,
    });

    // State untuk menyimpan data transaksi yang sukses dibuat (Dummy)
    const [receipt, setReceipt] = useState(null);

    // Otomatisasi: Menangkap nama member jika halaman ini dibuka lewat scan QR Code
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const nameFromQR = queryParams.get('name');
        
        if (nameFromQR) {
            setTransactionData(prev => ({
                ...prev,
                memberName: decodeURIComponent(nameFromQR)
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransactionData({
            ...transactionData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulasi pembuatan Nomor Invoice unik
        const invoiceNo = 'INV-' + Date.now().toString().slice(-6);
        
        // Karena input harga dihilangkan, kita pakai harga simulasi/flat per item (misal: Rp 20.000 per unit)
        const dummyPricePerUnit = 20000; 
        const totalAmount = (parseInt(transactionData.quantity) || 1) * dummyPricePerUnit;

        // Hitung poin bonus (misal: tiap kelipatan Rp 10.000 dapat 1 poin)
        const earnedPoints = Math.floor(totalAmount / 10000);

        const newReceiptData = {
            invoice: invoiceNo,
            memberName: transactionData.memberName,
            productName: transactionData.productName,
            orderDate: new Date(transactionData.orderDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            quantity: transactionData.quantity,
            total: totalAmount,
            pointsBonus: earnedPoints
        };

        setReceipt(newReceiptData);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Input Transaksi Member</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Kolom Kiri: Form Input Transaksi */}
                <div className="col-span-full lg:col-span-7 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Formulir Pesanan</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Member</label>
                            <input
                                type="text" name="memberName" required value={transactionData.memberName} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-emerald-500"
                                placeholder="Contoh: Poki ganteng"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Produk yang Dipesan</label>
                            <input
                                type="text" name="productName" required value={transactionData.productName} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-emerald-500"
                                placeholder="Contoh: Paket Ayam Geprek Sedap"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Jumlah (Qty)</label>
                            <input
                                type="number" name="quantity" min="1" required value={transactionData.quantity} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-emerald-500"
                                placeholder="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tanggal Pemesanan</label>
                            <input
                                type="date" name="orderDate" required value={transactionData.orderDate} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100 focus:outline-emerald-500"
                            />
                        </div>

                        <button type="submit" className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium w-full shadow transitions-colors">
                            Simpan Transaksi & Hitung Poin
                        </button>
                    </form>
                </div>

                {/* Kolom Kanan: Ringkasan Struk Belanja / Hasil */}
                <div className="col-span-full lg:col-span-5 flex flex-col justify-start">
                    {receipt ? (
                        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 text-gray-800 dark:text-gray-100 relative overflow-hidden">
                            {/* Dekorasi Garis Atas Struk */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-600"></div>
                            
                            <div className="text-center mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">
                                    TRANSAKSI BERHASIL
                                </span>
                                <h3 className="text-xl font-mono font-bold mt-3 text-gray-900 dark:text-white">{receipt.invoice}</h3>
                            </div>

                            {/* Tampilan Detail Transaksi */}
                            <div className="space-y-3 font-mono text-sm border-t border-b border-dashed border-gray-300 dark:border-gray-600 py-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Pelanggan:</span>
                                    <span className="font-semibold text-right">{receipt.memberName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tanggal:</span>
                                    <span>{receipt.orderDate}</span>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 mb-1">Item:</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{receipt.productName}</span>
                                    <span className="text-xs text-gray-500">Qty: {receipt.quantity}x</span>
                                </div>
                            </div>

                            {/* Total Biaya & Poin */}
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">Total Bayar:</span>
                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        Rp {receipt.total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-3">
                                    <span className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">Bonus Poin Diperoleh:</span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-400 font-mono">
                                        +{receipt.pointsBonus} Pts
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="mt-6 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors w-full"
                            >
                                Cetak Struk Belanja
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center text-gray-400 dark:text-gray-500 min-h-[350px]">
                            <svg className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <p className="text-sm">Silakan isi formulir di sebelah kiri untuk merekam transaksi pembelian.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InputTransaksiMember;