import { useEffect, useMemo, useState } from 'react';
import api from '../api/api';

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('module_code');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const res = await api.get('/modules');
        if (res.data.success) {
          setModules(res.data.data || []);
        } else {
          setError('Failed to load modules');
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err.response?.data?.message || 'Failed to load modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const sortedFilteredModules = useMemo(() => {
    let data = [...modules];

    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter(
        (m) =>
          m.module_code.toLowerCase().includes(term) ||
          m.module_name.toLowerCase().includes(term) ||
          (m.module_leader_name || '').toLowerCase().includes(term)
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
  }, [modules, search, sortField, sortDirection]);

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
          <h2 className="text-2xl font-semibold text-gray-800">Modules</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or leader..."
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading modules...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('module_code')}
                  >
                    <span className="inline-flex items-center">
                      Code
                      {renderSortIcon('module_code')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('module_name')}
                  >
                    <span className="inline-flex items-center">
                      Name
                      {renderSortIcon('module_name')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('module_leader_name')}
                  >
                    <span className="inline-flex items-center">
                      Module Leader
                      {renderSortIcon('module_leader_name')}
                    </span>
                  </th>
                  <th
                    className="px-4 py-2 border-b cursor-pointer select-none"
                    onClick={() => handleSort('credits')}
                  >
                    <span className="inline-flex items-center">
                      Credits
                      {renderSortIcon('credits')}
                    </span>
                  </th>
                  <th className="px-4 py-2 border-b text-sm text-gray-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredModules.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                      colSpan={5}
                    >
                      No modules found.
                    </td>
                  </tr>
                ) : (
                  sortedFilteredModules.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 text-sm">
                      <td className="px-4 py-2 border-b font-medium">{m.module_code}</td>
                      <td className="px-4 py-2 border-b">{m.module_name}</td>
                      <td className="px-4 py-2 border-b">
                        {m.module_leader_name || '-'}
                      </td>
                      <td className="px-4 py-2 border-b">{m.credits}</td>
                      <td className="px-4 py-2 border-b text-xs text-gray-500">
                        {m.created_at
                          ? new Date(m.created_at).toLocaleDateString()
                          : '-'}
                      </td>
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
