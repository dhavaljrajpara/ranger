import React, { forwardRef, useEffect, useRef } from "react";
import { useTable, usePagination, useRowSelect } from "react-table";
import { Table, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
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
  columnHide,
  totalCount,
  pagination,
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
    allColumns,
    getToggleHideAllColumnsProps,
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
    <>
      {columnHide &&
        ["Info"].map((variant, index) => (
          <div className="text-right mt-n5">
            <DropdownButton
              className="p-0"
              key={index}
              menuAlign="right"
              as={ButtonGroup}
              size="sm"
              id={`dropdown-variants-${variant}`}
              variant={variant.toLowerCase()}
              title="Columns"
            >
              <ul className="list-group">
                {allColumns.map((column) => (
                  <li className="column-list">
                    <label>
                      <input
                        type="checkbox"
                        {...column.getToggleHiddenProps()}
                      />
                      {column.id}
                    </label>
                  </li>
                ))}
              </ul>
            </DropdownButton>
          </div>
        ))}

      <div className="row">
        <div className="col-sm-12">
          <div className="table-responsive">
            <Table bordered hover {...getTableProps()}>
              <thead className="thead-light text-center">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          <th
                            {...column.getHeaderProps([
                              { className: column.className }
                            ])}
                          >
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
                                  cell.render("Cell")
                                  // Render the cell contents
                                }
                              </td>
                            );
                          })
                        }
                      </tr>
                    );
                  })
                }

                <tr>
                  <td colSpan={columns.length + 1}>
                    <center>
                      {loading && (
                        <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
                      )}
                      {rows.length === 0 && loading == false && (
                        <span className="text-muted" data-cy="tbleDataMsg">
                          "No data to show!!"
                        </span>
                      )}
                    </center>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          {totalCount > 25 && (
            <div className="row mt-2">
              <div className="col-md-12 m-b-sm">
                <div className="text-center">
                  <button
                    title="First"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="pagination-btn-first btn btn-outline-dark btn-sm mr-1"
                  >
                    {"<<"}
                  </button>
                  <button
                    title="Previous"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="pagination-btn-previous btn btn-outline-dark btn-sm"
                  >
                    {"< "}{" "}
                  </button>
                  <span className="mr-1">
                    <span className="mr-1"> </span>
                    Page{" "}
                    <strong>
                      {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                  </span>
                  <span className="mr-1"> | </span>
                  Go to page:{" "}
                  <input
                    className="pagination-input"
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(page);
                    }}
                  />
                  <span className="mr-1"> </span>
                  <span>
                    <select
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
                  <span className="mr-1"> </span>
                  <button
                    onClick={() => nextPage()}
                    className="pagination-btn-previous mr-1 btn btn-outline-dark btn-sm lh-1"
                    disabled={!canNextPage}
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    className="pagination-btn-last btn btn-outline-dark btn-sm"
                    disabled={!canNextPage}
                  >
                    {">>"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default XATableLayout;
