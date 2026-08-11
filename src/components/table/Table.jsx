import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../../components/ui/alert";
export default function Table({
  columns = [],
  data = [],
  actions,
  cellRenderers = {},
  showSearch = true,
  searchPlaceholder = "Search records...",
  searchValue,
  onSearchChange,
  showPagination = true,
  showRowDividers = true,
  rowsPerPage = 5,
  title = "Table records",
  subtitle,
  emptyTitle = "No records found",
  emptyDescription = "Try a different search term or clear the filter to see all rows.",
  className = "",
  tableWrapperClassName = "",
  tableClassName = "",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isSearchControlled = typeof searchValue !== "undefined" && typeof onSearchChange === "function";
  const activeSearch = isSearchControlled ? String(searchValue ?? "") : search;

  const normalizedColumns = useMemo(
    () =>
      columns.map((column) =>
        typeof column === "string" ? { key: column, label: column } : column
      ),
    [columns]
  );

  const filteredData = useMemo(() => {
    const query = activeSearch.trim().toLowerCase();

    if (!query) return data;

    return data.filter((row) =>
      normalizedColumns.some((col) => {
        if (col.searchable === false) return false;
        const value = row[col.searchKey ?? col.key];
        return String(value ?? "").toLowerCase().includes(query);
      })
    );
  }, [data, normalizedColumns, activeSearch]);

  const handleSearchChange = (value) => {
    if (isSearchControlled) {
      onSearchChange(value);
    } else {
      setSearch(value);
    }
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(start, start + rowsPerPage);
  const showingStart = filteredData.length === 0 ? 0 : start + 1;
  const showingEnd = Math.min(start + rowsPerPage, filteredData.length);
  const visibleRows = showPagination ? paginatedData : filteredData;
  const hasData = visibleRows.length > 0;
  const columnCount = normalizedColumns.length + 1 + (actions ? 1 : 0);

  const renderCellValue = (row, col, index) =>
    cellRenderers[col.key]
      ? cellRenderers[col.key](row, index)
      : col.render
        ? col.render(row, index)
        : row[col.key];

  const getMobileTitle = (row, index) =>
    row.name ||
    row.title ||
    row.label ||
    row.rollNumber ||
    row.roll ||
    row.email ||
    `Record ${showPagination ? start + index + 1 : index + 1}`;

  return (
    <div className={`rounded-2xl border border-blue-100 bg-white/90 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/80 ${className}`}>
      <div className="border-b border-blue-100 px-4 py-4 sm:px-5 dark:border-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {title}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {subtitle ?? `Showing ${filteredData.length} record${filteredData.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {showSearch && (
            <div className="relative w-full sm:max-w-sm">
              <FaSearch
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="search"
                value={activeSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-blue bg-[#fbfaf7] py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-slate-50 focus:ring-1 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-white/10"
              />
            </div>
          )}
        </div>
      </div>

      <div className={`max-h-[70vh] overflow-y-auto px-3 py-3 md:hidden ${tableWrapperClassName}`}>
        {hasData ? (
          <div className="space-y-3">
            {visibleRows.map((row, index) => {
              const rowKey = row._id ?? row.id ?? index;
              const displayIndex = showPagination ? start + index + 1 : index + 1;

              return (
                <div
                  key={rowKey}
                  className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:border-blue-200 dark:border-white/10 dark:bg-slate-950/80"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-blue-50 pb-3 dark:border-white/10">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        S.N. {displayIndex}
                      </p>

                    </div>

                    {actions && <div className="shrink-0">{actions(row)}</div>}
                  </div>

                  <dl className="mt-3 space-y-2">
                    {normalizedColumns.map((col) => {
                      const value = renderCellValue(row, col, index);

                      return (
                        <div
                          key={col.key}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <dt className="min-w-0 font-medium text-slate-500 dark:text-slate-400">
                            {col.headerRender
                              ? col.headerRender(col)
                              : col.label ?? col.key}
                          </dt>
                          <dd className="max-w-[60%] break-words text-right text-slate-700 dark:text-slate-200">
                            {value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-8 text-center dark:border-white/10 dark:bg-slate-950/80">
            <Alert>
              <AlertTitle>{emptyTitle}</AlertTitle>
              <AlertDescription>
                {emptyDescription}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <div className={`hidden overflow-x-auto md:block ${tableWrapperClassName}`}>
        <table className={`min-w-full border-separate border-spacing-0 ${tableClassName}`}>
          <thead className="sticky top-0 z-10 bg-[#f7f9fc] dark:bg-slate-900">
            <tr>
              <th className="border-b border-blue-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                S.N.
              </th>
              {normalizedColumns.map((col) => (
                <th
                  key={col.key}
                  className="border-b border-blue-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400"
                >
                  {col.headerRender ? col.headerRender(col) : col.label ?? col.key}
                </th>
              ))}
              {actions && (
                <th className="border-b border-blue-100 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className={showRowDividers ? "divide-y divide-blue-50 dark:divide-white/10" : ""}>
            {hasData ? (
              visibleRows.map((row, index) => (
                <tr
                  key={row._id ?? row.id ?? index}
                  className="transition-colors  hover:bg-blue-50/40  dark:hover:bg-white/5 "
                >
                  <td className="whitespace-nowrap  border-b dark:border-slate-700 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {showPagination ? start + index + 1 : index + 1}
                  </td>

                  {normalizedColumns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3  border-b dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200"
                    >
                      {renderCellValue(row, col, index)}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 border-b dark:border-slate-700 py-3 text-sm text-slate-700 dark:text-slate-200">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                  colSpan={columnCount}
                >
                  <div className="mx-auto max-w-sm">
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {emptyTitle}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex flex-col gap-3 border-t border-blue-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredData.length === 0
              ? "No rows to display"
              : `Showing ${showingStart} to ${showingEnd} of ${filteredData.length}`}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              disabled={currentPage === 1}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                type="button"
                key={i}
                className={`min-w-[2.5rem] rounded-xl px-3 py-2 text-sm font-medium transition ${currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                  }`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium  transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              disabled={currentPage === totalPages}
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
