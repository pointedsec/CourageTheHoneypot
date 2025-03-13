import { useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useRouter } from "next/router";

const SessionList = ({ sessions }: { sessions: { id: string, createdAt: string | null, endTime: string | null, ip: string | null, total_cmds: number }[] }) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("");

  const filteredData = useMemo(() => {
    return sessions.filter(session => {
      return (
        !statusFilter || 
        (statusFilter === "active" && session.endTime === null) || 
        (statusFilter === "finished" && session.endTime !== null)
      );
    });
  }, [sessions, statusFilter]);

  const data = useMemo(
    () =>
      filteredData.map(session => ({
        ...session,
        endTime: session.endTime ? session.endTime : "Sesión activa",
        isActive: session.endTime === null,
      })),
    [filteredData]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Session ID",
        accessor: "id",
      },
      {
        Header: "Start Time",
        accessor: "createdAt",
      },
      {
        Header: "End Time",
        accessor: "endTime",
        Cell: ({ row }: { row: any }) => (
          <span className={row.original.isActive ? "text-green-400 font-bold" : "text-gray-300"}>
            {row.original.endTime}
          </span>
        ),
      },
      {
        Header: "IP",
        accessor: "ip",
      },
      {
        Header: "Total Commands Executed",
        accessor: "total_cmds",
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // @ts-ignore
    page,
    prepareRow,
    // @ts-ignore
    nextPage,
    // @ts-ignore
    previousPage,
    // @ts-ignore
    canNextPage,
    // @ts-ignore
    canPreviousPage,
    // @ts-ignore
  } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 14 } }, useSortBy, usePagination);

  return (
    <div className="bg-gray-900 text-white shadow-md rounded-lg p-4">
      <div className="flex space-x-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-800 text-white rounded"
        >
          <option value="">Todos</option>
          <option value="active">Activas</option>
          <option value="finished">Finalizadas</option>
        </select>
      </div>

      <table {...getTableProps()} className="w-full border-collapse border border-gray-700">
        <thead className="bg-gray-800">
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="border p-2 text-left cursor-pointer text-gray-300">
                  {column.render("Header")} {column.isSorted ? (column.isSortedDesc ? "↓" : "↑") : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr key={row.original.id}
                {...row.getRowProps()} 
                className={`border border-gray-700 hover:bg-gray-800 cursor-pointer ${row.original.isActive ? "bg-green-900" : ""}`}
                onClick={() => router.push(`/sessions/${row.original.id}`)}
              >
                {row.cells.map((cell: any) => (
                  <td {...cell.getCellProps()} className="border p-2 text-gray-300">{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button onClick={previousPage} disabled={!canPreviousPage} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">Previous</button>
        <button onClick={nextPage} disabled={!canNextPage} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default SessionList;