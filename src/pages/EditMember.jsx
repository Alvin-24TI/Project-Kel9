import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';

emailjs.init('732UV6Q_JQdHmoFZ9');

function EditMember() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const memberId = query.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) {
        setFeedback({ type: 'error', message: 'ID member tidak ditemukan.' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('members')
        .select('name, email, username, phone')
        .eq('id', memberId)
        .single();

      if (error || !data) {
        setFeedback({ type: 'error', message: error?.message || 'Gagal memuat data member.' });
        setLoading(false);
        return;
      }

      setFormData({
        name: data.name || '',
        email: data.email || '',
        username: data.username || '',
        phone: data.phone || '',
        password: '',
      });
      setLoading(false);
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username || !formData.phone) {
      setFeedback({ type: 'error', message: 'Lengkapi semua field sebelum menyimpan.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const updatePayload = {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
    };

    if (formData.password.trim()) {
      updatePayload.password = formData.password;
    }

    const { error } = await supabase
      .from('members')
      .update(updatePayload)
      .eq('id', memberId);

    if (error) {
      setFeedback({ type: 'error', message: `Gagal menyimpan data: ${error.message}` });
      setSaving(false);
      return;
    }

    try {
      const templateParams = {
        to_name: formData.name,
        to_email: formData.email,
        notification_message: 'Perubahan data akun Anda telah berhasil disimpan. Jika Anda tidak merasa melakukan perubahan ini, segera hubungi tim dukungan.',
        notification_date: new Date().toLocaleDateString('id-ID'),
        notification_id: `EDIT-${memberId}`,
      };

      await emailjs.send(
        'service_zmqs5y2',
        'template_gdct1jg',
        templateParams
      );

      setFeedback({ type: 'success', message: 'Data member berhasil diperbarui dan email notifikasi sudah dikirim.' });
    } catch (emailError) {
      console.error('Gagal mengirim email notifikasi:', emailError);
      setFeedback({
        type: 'warning',
        message: 'Data member berhasil diperbarui, tetapi pengiriman email notifikasi gagal.',
      });
    }

    setSaving(false);
    setTimeout(() => navigate('/member-list'), 1200);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit Data Member</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Perbarui informasi member dan simpan perubahan.
          </p>
        </div>

        {feedback && (
          <div className={`mb-6 rounded-xl px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200'}`}>
            {feedback.message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-500">Memuat data member...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">No. Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ubah Password (opsional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Biarkan kosong jika tidak ingin mengganti"
                className="form-input w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/member-list')}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Kembali ke Daftar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditMember;
