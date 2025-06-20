import { useState } from 'react';

function ReportTable({ data, columns }) {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const sortedData = [...data].sort((a, b) => {
    const field = sortField.split('.').reduce((obj, key) => obj[key], { ...a });
    const fieldB = sortField.split('.').reduce((obj, key) => obj[key], { ...b });
    if (sortOrder === 'asc') {
      return field > fieldB ? 1 : -1;
    }
    return field < fieldB ? 1 : -1;
  });

  const filteredData = sortedData.filter(row =>
    columns.some(col =>
      String(col.accessor(row)).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by SKU..."
        className="mb-2 p-2 border rounded w-full"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.header}
                className="border p-2 text-left cursor-pointer bg-blue-100"
                onClick={() => handleSort(col.accessor)}
              >
                {col.header} {sortField === col.accessor ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} className="border-b">
              {columns.map(col => (
                <td key={col.header} className="border p-2">
                  {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;