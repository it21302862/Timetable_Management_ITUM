import { useEffect, useMemo, useState } from 'react';
import api from '../api/api';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('room_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await api.get('/rooms');
        if (res.data.success) {
          setRooms(res.data.data || []);
        } else {
          setError('Failed to load rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err.response?.data?.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const sortedFilteredRooms = useMemo(() => {
    let data = [...rooms];

    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.room_name.toLowerCase().includes(term) ||
          (r.building || '').toLowerCase().includes(term) ||
          (r.room_type || '').toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null || bv == null) return 0;
      if (av < bv) return sortDirection === 'asc' ? -1 : 1;
      if (av > bv) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [rooms, search, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (field !== sortField) return <span className="ml-1 text-gray-400">↕</span>;
    return sortDirection === 'asc' ? (
      <span className="ml-1 text-gray-700">▲</span>
    ) : (
      <span className="ml-1 text-gray-700">▼</span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">Class Rooms</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, building, or type..."
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading rooms...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('room_name')}
                  >
                    <span className="inline-flex items-center">
                      Room
                      {renderSortIcon('room_name')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('room_type')}
                  >
                    <span className="inline-flex items-center">
                      Type
                      {renderSortIcon('room_type')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('building')}
                  >
                    <span className="inline-flex items-center">
                      Building
                      {renderSortIcon('building')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('capacity')}
                  >
                    <span className="inline-flex items-center">
                      Capacity
                      {renderSortIcon('capacity')}
                    </span>
                  </th>
                  <th className="px-4 py-2 border-b text-sm text-gray-500">Floor</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredRooms.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                      colSpan={5}
                    >
                      No rooms found.
                    </td>
                  </tr>
                ) : (
                  sortedFilteredRooms.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-4 py-2 border-b font-medium">{r.room_name}</td>
                      <td className="px-4 py-2 border-b">{r.room_type}</td>
                      <td className="px-4 py-2 border-b">{r.building || '-'}</td>
                      <td className="px-4 py-2 border-b">{r.capacity ?? '-'}</td>
                      <td className="px-4 py-2 border-b">{r.floor ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
