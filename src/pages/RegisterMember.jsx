import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function RegisterMember() {
    // State untuk menyimpan input form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        initialPoints: 0,
    });

    // State untuk menyimpan data member yang sukses dibuat (Dummy)
    const [generatedMember, setGeneratedMember] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulasi pembuatan ID unik untuk member baru
        const memberId = 'MEM-' + Math.floor(100000 + Math.random() * 900000);

        const newMemberData = {
            id: memberId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            points: parseInt(formData.initialPoints) || 0,
            joinedAt: new Date().toLocaleDateString('id-ID'),
        };

        // Simpan ke state untuk memunculkan QR Code
        setGeneratedMember(newMemberData);
    };

    // Teks JSON yang akan dimasukkan ke dalam QR Code
    // Saat di-scan, data string JSON ini yang akan terbaca
    // Mengarahkan ke halaman detail dengan membawa query string data member
    const qrValue = generatedMember
        ? `${window.location.origin}/member-detail?id=${generatedMember.id}&name=${encodeURIComponent(generatedMember.name)}&points=${generatedMember.points}&phone=${generatedMember.phone}`
        : '';

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Pendaftaran Member Baru</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Kolom Kiri: Form Input Admin */}
                <div className="col-span-full lg:col-span-7 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Formulir Pelanggan</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                            <input
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100"
                                placeholder="Contoh: John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                            <input
                                type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100"
                                placeholder="08123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Poin Awal (Opsional)</label>
                            <input
                                type="number" name="initialPoints" value={formData.initialPoints} onChange={handleChange}
                                className="form-input w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-100"
                                placeholder="0"
                            />
                        </div>

                        <button type="submit" className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white px-4 py-2 rounded-lg font-medium w-full">
                            Daftarkan Member & Generate QR
                        </button>
                    </form>
                </div>

                {/* Kolom Kanan: Hasil QR Code & Kartu Member */}
                <div className="col-span-full lg:col-span-5 flex flex-col justify-start">
                    {generatedMember ? (
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-800 text-white shadow-lg rounded-2xl p-6 text-center border border-indigo-500">
                            <span className="text-xs uppercase tracking-widest bg-indigo-900/40 px-3 py-1 rounded-full font-semibold">KARTU MEMBER DIGITAL</span>

                            {/* Tempat QR Code */}
                            <div className="bg-white p-4 rounded-xl inline-block my-6 shadow-md">
                                <QRCodeSVG value={qrValue} size={160} />
                            </div>

                            {/* Tampilan Data Pelanggan */}
                            <div className="space-y-2 text-left border-t border-indigo-400/30 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-indigo-200 text-sm">ID Member:</span>
                                    <span className="font-mono font-bold tracking-wider">{generatedMember.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200 text-sm">Nama:</span>
                                    <span className="font-semibold">{generatedMember.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200 text-sm">Sisa Poin:</span>
                                    <span className="font-bold text-yellow-300 text-lg">{generatedMember.points} Pts</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200 text-sm">Tgl Gabung:</span>
                                    <span className="text-sm">{generatedMember.joinedAt}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="mt-6 text-xs bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
                            >
                                Cetak / Simpan Kartu
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center text-gray-400 dark:text-gray-500">
                            <svg className="w-12 h-12 mb-3 stroke-current" viewBox="0 0 24 24" fill="none">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 11v1m5-6h-1m-4 0H9m12 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">Silakan isi formulir di sebelah kiri untuk membuat QR Code member.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterMember;