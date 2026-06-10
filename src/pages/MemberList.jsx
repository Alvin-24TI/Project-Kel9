import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. TAMBAHKAN Link DI SINI
import axios from 'axios';

function MemberList() {
  const navigate = useNavigate();

  // State Utama
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. useEffect Pertama: Ambil data awal
  useEffect(() => {
    const timeout = setTimeout(() => {
      axios
        .get(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((response) => {

          const formattedMembers = response.data.users.map((user) => ({
            id: `MEM-${user.id}0${user.age}`,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            points: user.age * 10,
            joinedAt: "10/05/2025",
          }));

          setFilteredMembers(formattedMembers);
        })
        .catch((err) => {
          setError(err.message);
        });

    }, 500);

    return () => clearTimeout(timeout);

  }, [searchTerm]);

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

      {error && (
        <div className="mb-5 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Search Form */}
      <div className="mb-5 max-w-md">
        <input
          type="text"
          placeholder="Cari berdasarkan nama, ID, email, atau telepon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Semua Member ({filteredMembers.length})</h2>
        </header>
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-gray-300">
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">ID Member</div></th>
                  {/* KEMBALIKAN BAGIAN INI MENJADI TEKS HEADER BIASA */}
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Nama</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Email</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">No. Telepon</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Poin</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-left">Tgl Bergabung</div></th>
                  <th className="p-2 whitespace-nowrap"><div className="font-semibold text-center">Aksi</div></th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <tr key={member.id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-mono font-medium text-gray-800 dark:text-gray-100">{member.id}</div>
                      </td>
                      {/* PINDAHKAN LINK KE SINI (Tempat variabel 'member' bisa dibaca) */}
                      <td className="p-2 whitespace-nowrap">
                        <div className="font-medium">
                          <Link
                            to={`/member-detail?id=${member.id}&name=${encodeURIComponent(member.name)}&points=${member.points}&phone=${member.phone}`}
                            className="text-emerald-400 hover:text-emerald-500 transition-colors"
                          >
                            {member.name}
                          </Link>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{member.email}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium">{member.phone}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-bold text-yellow-600 dark:text-yellow-400">{member.points} Pts</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left text-gray-500">{member.joinedAt}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          <button
                            onClick={() => handleViewDetail(member)}
                            className="text-xs bg-violet-500 hover:bg-violet-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Lihat QR / Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-400">
                      Tidak ada data member ditemukan.
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