import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../utils/AuthContext';

export default function TukarPromo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [members, setMembers] = useState([]); // fallback list
  const [selectedMember, setSelectedMember] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [promosList, setPromosList] = useState([]);
  const [notification, setNotification] = useState(null); // { type: 'error'|'success', message: '' }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (id) {
          const { data: promoData, error: promoErr } = await supabase
            .from('promos')
            .select('*')
            .eq('id', id)
            .single();

          if (promoErr || !promoData) {
            setError(promoErr?.message || 'Promo tidak ditemukan');
            setLoading(false);
            return;
          }

          setPromo(promoData);
        } else {
          // load list of promos for selection
          const { data: allPromos, error: promosErr } = await supabase
            .from('promos')
            .select('id, title, description, point_cost, is_active')
            .eq('is_active', true)
            .order('id', { ascending: false });

          if (promosErr) throw promosErr;
          setPromosList(allPromos || []);
        }

        const search = new URLSearchParams(window.location.search);
        const preMemberId = search.get('memberId');

        // If a memberId is provided via query param, fetch and preselect
        if (preMemberId) {
          const { data: memberData, error: memberErr } = await supabase
            .from('members')
            .select('id, name, points')
            .eq('id', preMemberId)
            .maybeSingle();

          if (memberErr) {
            console.error('Error loading member by id', memberErr);
          } else if (memberData) {
            setSelectedMember(memberData);
          }
        }

        // Try to resolve current member by logged-in user id if not preselected
        if (!selectedMember && user?.id) {
          const { data: memberByUser } = await supabase
            .from('members')
            .select('id, name, points')
            .eq('user_id', user.id)
            .maybeSingle();

          if (memberByUser) {
            setSelectedMember(memberByUser);
          }
        }

        // If still no selected member, load members list for manual selection
        if (!selectedMember) {
          const { data: membersList, error: membersErr } = await supabase
            .from('members')
            .select('id, name, points')
            .order('name', { ascending: true });

          if (membersErr) throw membersErr;
          setMembers(membersList || []);
        }
      } catch (err) {
          setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, user]);

  const handleSelectMember = (e) => {
    const mid = e.target.value;
    const m = members.find((x) => String(x.id) === String(mid));
    setSelectedMember(m || null);
  };

  const handleClearSelectedMember = async () => {
    setSelectedMember(null);
    setNotification(null);
    try {
      const { data: membersList, error: membersErr } = await supabase
        .from('members')
        .select('id, name, points')
        .order('name', { ascending: true });

      if (membersErr) throw membersErr;
      setMembers(membersList || []);
      setNotification({ type: 'success', message: 'Silakan pilih ulang member.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal memuat daftar member.' });
    }
  };

  const handleRefreshMember = async () => {
    if (!selectedMember) return;
    try {
      const { data: refreshed, error } = await supabase
        .from('members')
        .select('id, name, points')
        .eq('id', selectedMember.id)
        .maybeSingle();

      if (error) throw error;
      if (refreshed) setSelectedMember(refreshed);
      setNotification({ type: 'success', message: 'Data member diperbarui.' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal memperbarui data member.' });
    }
  };

  const handleRedeem = async () => {
    if (!promo) return;
    if (!selectedMember) {
      setNotification({ type: 'error', message: 'Pilih member terlebih dahulu.' });
      return;
    }
    if (!promo.is_active) {
      setNotification({ type: 'error', message: 'Promo ini tidak aktif.' });
      return;
    }

    const cost = Number(promo.point_cost || 0);
    const memberPoints = Number(selectedMember.points || 0);

    if (memberPoints < cost) {
      setNotification({ type: 'error', message: 'Poin tidak mencukupi untuk menukarkan promo ini.' });
      return;
    }

    setProcessing(true);
      try {
      const newPoints = memberPoints - cost;
      const { error: updateErr } = await supabase
        .from('members')
        .update({ points: newPoints })
        .eq('id', selectedMember.id);

      if (updateErr) throw updateErr;

      // Record redemption in audit table (ensure migration created table)
      const { data: redemptionData, error: redemptionErr } = await supabase
        .from('promo_redemptions')
        .insert([{ member_id: selectedMember.id, promo_id: promo.id, points_spent: cost, remaining_points: newPoints }])
        .select()
        .single();

      if (redemptionErr) {
        // Surface audit errors to the user but do not silently ignore
        setNotification({ type: 'error', message: 'Penukaran terjadi, tetapi gagal mencatat audit: ' + redemptionErr.message });
        setSelectedMember({ ...selectedMember, points: newPoints });
        setProcessing(false);
        return;
      }

      // update local state
      setSelectedMember({ ...selectedMember, points: newPoints });
      setPromo({ ...promo });

      setNotification({ type: 'success', message: 'Promo berhasil ditukarkan! Poin Anda telah dikurangi.' });
      // brief delay to show notification, then navigate back
      setTimeout(() => navigate('/promo-membership'), 1200);
    } catch (err) {
      setNotification({ type: 'error', message: 'Gagal menukarkan promo: ' + (err.message || 'Terjadi kesalahan') });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-6">Memuat...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 w-full p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Tukar Promo</h2>
        </div>

          {notification && (
            <div className={`mb-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {notification.message}
            </div>
          )}

        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300">Member</label>
          {selectedMember ? (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-100">{selectedMember.name}</div>
                  <div className="text-sm text-yellow-600">{selectedMember.points} Poin</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRefreshMember}
                    className="text-xs bg-blue-100 dark:bg-blue-700 hover:bg-blue-200 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-100 font-medium py-1 px-2 rounded"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={handleClearSelectedMember}
                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium py-1 px-2 rounded"
                  >
                    Pilih Ulang
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <select onChange={handleSelectMember} className="form-select w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm">
              <option value="">Pilih Member...</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name} — {m.points} Poin</option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold">{promo.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{promo.description}</p>
          <div className="mt-3">
            <span className="inline-block font-medium text-violet-600">Biaya Poin: {promo.point_cost}</span>
            <span className="ml-3 text-sm text-gray-500">Status: {promo.is_active ? 'Aktif' : 'Nonaktif'}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRedeem}
            disabled={processing || !promo.is_active || !selectedMember}
            className="btn bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {processing ? 'Memproses...' : 'Tukarkan Promo'}
          </button>
          <button onClick={() => navigate(-1)} className="btn border px-4 py-2 rounded">Kembali</button>
        </div>
      </div>
    </div>
  );
}
