import React, { forwardRef, useEffect, useRef } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { Table } from "react-bootstrap";
import { Loader } from "Components/CommonComponents";
const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, chkType, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className={`${
            chkType === "header" ? "tablethcheckbox" : "tabletdcheckbox"
          }`}
        />
      </>
    );
  }
);

function XATableLayout({
  columns,
  loading,
  data,
  fetchData,
  pageCount: controlledPageCount,
  rowSelectOp,
  getRowProps = () => ({})
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize, selectedRowIds },
    selectedFlatRows
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 25 }, // Pass our hoisted table state
      manualPagination: true,
      pageCount: controlledPageCount
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        let cols = [];

        if (rowSelectOp) {
          // Let's make a column for selection
          const selectionCol = {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllPageRowsSelectedProps()}
                  chkType="header"
                />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            )
          };
          if (rowSelectOp && rowSelectOp.position === "first") {
            cols.push(selectionCol, ...columns);
          } else {
            cols.push(...columns, selectionCol);
          }
        } else {
          cols = [...columns];
        }
        return cols;
      });
    }
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  useEffect(() => {
    if (rowSelectOp) {
      rowSelectOp.selectedRows.current = selectedFlatRows;
    }
  }, [selectedFlatRows]);

  return (
    // apply the table props
    <div className="row">
      <div className="col-sm-12">
        <div className="table-responsive">
          <Table bordered hover {...getTableProps()}>
            <thead className="thead-light">
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => (
                  // Apply the header row props
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column) => (
                        // Apply the header cell props
                        <th {...column.getHeaderProps()}>
                          {
                            // Render the header
                            column.render("Header")
                          }
                        </th>
                      ))
                    }
                  </tr>
                ))
              }
            </thead>
            {/* Apply the table body props */}
            <tbody {...getTableBodyProps()}>
              {
                // Loop over the table rows
                rows.map((row) => {
                  // Prepare the row for display
                  prepareRow(row);
                  return (
                    // Apply the row props
                    <tr {...row.getRowProps(getRowProps(row))}>
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          // Apply the cell props
                          return (
                            <td {...cell.getCellProps()}>
                              {
                                // Render the cell contents
                                loading ? <Loader /> : cell.render("Cell")
                              }
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </Table>
        </div>

        <div className="row mt-2">
          <div className="col-2">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="pagebtn btn btn-outline-dark btn-sm"
            >
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="pagebtn btn btn-outline-dark btn-sm"
            >
              {"<"}
            </button>
          </div>
          <div className="col-4">
            <span className="pagelbl">
              Page
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span>
              | Go to page:
              <input
                className="inputpagebtn"
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
              />
            </span>
          </div>
          <div className="col-4">
            <span>
              <select
                className="selectpage custom-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[25, 50, 75, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <div className="col-2">
            <button
              onClick={() => nextPage()}
              className="pagebtn btn btn-outline-dark btn-sm"
              disabled={!canNextPage}
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount)}
              className="pagebtn btn btn-outline-dark btn-sm"
              disabled={!canNextPage}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default XATableLayout;
