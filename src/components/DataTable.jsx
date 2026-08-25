import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

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
    // prev and next css
    const pigBtn = "px-4 py-2 text-sm rounded-lg border border-white dark:border-slate-700 bg-gray-100 dark:bg-gray-900 disabled:opacity-50 hover:bg-gray-200 cursor-pointer"
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-slate-700">

            {/* Search */}
            {searchKeys.length > 0 && (
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-80 px-4 py-2 rounded-lg
          bg-gray-50 dark:bg-gray-800
          border border-gray-300 dark:border-slate-600
          text-gray-800 dark:text-white
          placeholder:text-gray-400
          focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.accessor}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                                >
                                    {col.header}
                                </th>
                            ))}

                            {hasAlertColumn && (
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Alert
                                </th>
                            )}

                            {actions.length > 0 && (
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.length ? (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    className="border-t border-gray-200 dark:border-slate-700
                hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.accessor}
                                            className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap"
                                        >
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}

                                    {hasAlertColumn && (
                                        <td className="px-4 py-3 text-center">
                                            {getAlert(row.endMonth)}
                                        </td>
                                    )}

                                    {actions.length > 0 && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                {actions
                                                    .filter((a) => !a.hidden || !a.hidden(row))
                                                    .map((action, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => action.onClick(row)}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white transition ${action.className}`}
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
                                        (actions.length ? 1 : 0)
                                    }
                                    className="py-8 text-center text-gray-500 dark:text-gray-400"
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
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {start + 1}–{Math.min(start + rowsPerPage, filteredData.length)} of{" "}
                        {filteredData.length}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 dark:border-slate-600
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            disabled:opacity-40"
                        >
                            <FiArrowLeft />
                        </button>

                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 dark:border-slate-600
            bg-white dark:bg-gray-800
            text-gray-700 dark:text-gray-200
            disabled:opacity-40"
                        >
                            <FiArrowRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;