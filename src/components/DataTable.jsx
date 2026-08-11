import { useMemo, useState } from "react";

const DataTable = ({
    columns,
    data,
    actions = [],
    searchKeys = [],
    rowsPerPage = 5,
}) => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Search
    const filteredData = useMemo(() => {
        if (!search) return data;

        return data.filter((row) =>
            searchKeys.some((key) =>
                String(row[key] || "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
        );
    }, [search, data, searchKeys]);

    // Pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / rowsPerPage)
    );

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(start, start + rowsPerPage);

    // Alert
    const getAlert = (endMonth) => {
        if (!endMonth) return null;

        const today = new Date();
        const end = new Date(endMonth);

        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
            (end - today) / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {
            return (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    Expired
                </span>
            );
        }

        if (diffDays <= 7) {
            return (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                    Ending in {diffDays} day(s)
                </span>
            );
        }

        return (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                Active
            </span>
        );
    };

    const hasAlertColumn = data.some((row) => row.endMonth);

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow border border-gray-200 p-2">
            {/* Search */}
            {searchKeys.length > 0 && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-72 px-4 py-2 border border-slate-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full  table-fixed border-collapse">
                    <thead className="bg-gray-100 ">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.accessor}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                                >
                                    {col.header}
                                </th>
                            ))}

                            {hasAlertColumn && (
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                    Alert
                                </th>
                            )}

                            {actions.length > 0 && (
                                <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, index) => (
                                <tr key={row.id || index} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td
                                            key={col.accessor}
                                            className="px-4 py-3 text-sm text-gray-700 truncate max-w-55 whitespace-nowrap"
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : row[col.accessor]}
                                        </td>
                                    ))}

                                    {hasAlertColumn && (
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            {getAlert(row.endMonth)}
                                        </td>
                                    )}

                                    {actions.length > 0 && (
                                        <td className="w-32 px-4 py-3">
                                            <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                                                {actions.map((action, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => action.onClick(row)}
                                                        className={`
                              w-9 h-9
                              flex items-center justify-center
                              rounded-lg text-white
                              transition-colors
                              ${action.className}
                            `}
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (hasAlertColumn ? 1 : 0) +
                                        (actions.length > 0 ? 1 : 0)
                                    }
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    No matching data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        {start + 1} to {Math.min(start + rowsPerPage, filteredData.length)} of {filteredData.length}
                    </p>

                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm rounded-lg border bg-gray-100 disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-2 text-sm">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm rounded-lg border bg-gray-100 disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;