import React from "react";
//import DefaultColumnFilter from "./DefaultColumnFilter";
import GlobalFilter from "./GlobalFilter";
import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination, useRowSelect } from 'react-table';
import * as Icons from "react-icons/fa";

function Table({ columns, data, initialSortColumn, updateMyData, skipPageReset, defaultColumnRender, editableRowIndex,
    setEditableRowIndex, setOriginalData, paginationSize, withFilter = true }) {

    const defaultColumn = defaultColumnRender;
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [
                    {
                        id: { initialSortColumn },
                        desc: false
                    }
                ],
                pageSize: (paginationSize ? paginationSize : 50),
                hiddenColumns: [
                    '_id'
                ]
            },
            useSortBy,
            defaultColumn,
            autoResetPage: false,
            updateMyData,
            editableRowIndex,
            setEditableRowIndex,
            setOriginalData // setState hook for toggling edit on/off switch
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect
    )

    return (
        <div className="data-table">
            {withFilter &&
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            }
            <table style={{ marginTop: '1.3rem' }} className="table" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>{!column.disableSortBy ?
                                        column.isSorted ?
                                            column.isSortedDesc ? <Icons.FaSortUp /> : <Icons.FaSortDown />
                                            : <Icons.FaSort />
                                        : ""}</span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <br />
            <div className="pagination row" style={{ lineHeight: '2em' }}>
                <div className="col-4">
                    <button className="btn btn-secondary btn-sm" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <Icons.FaAngleDoubleLeft />
                    </button>{" "}
                    <button className="btn btn-secondary btn-sm" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <Icons.FaAngleLeft />
                    </button>{" "}
                    <button className="btn btn-secondary btn-sm" onClick={() => nextPage()} disabled={!canNextPage}>
                        <Icons.FaAngleRight />
                    </button>{" "}
                    <button className="btn btn-secondary btn-sm" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        <Icons.FaAngleDoubleRight />
                    </button>{" "}
                </div>
                <div className="col-2">
                    <span>
                        Seite{" "}
                        <strong>
                            {pageIndex + 1} / {pageCount}
                        </strong>{" "}
                    </span>
                </div>
                <div className="col-3">
                    <span>
                        | Zur Seite:{" "}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                            style={{ width: "1.9em", height: "2em", lineHeight: "2em" }}
                        />
                    </span>{" "}
                </div>
                <div className="col-3">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50, 100, 200, 500].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Zeige {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Table;