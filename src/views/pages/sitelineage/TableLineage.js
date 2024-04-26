import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {matchSorter} from 'match-sorter'
import {
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search`}
        className="input--table-filters"
      />
    )
  }

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  
  fuzzyTextFilterFn.autoRemove = val => !val

  function Table({ columns, data, setSelected, modalProps, tableType }) {
    const filterTypes = React.useMemo(
      () => ({
        fuzzyText: fuzzyTextFilterFn,
        text: (rows, id, filterValue) => {
          return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue !== undefined
              ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
              : true
          })
        },
      }),
      []
    )
    function DropdownHarvesting(props) {
      let row = {version: props.version, country: props.country};
      return (
        <CDropdown>
          <CDropdownToggle className="btn-more" caret={false} size="sm">
            <i className="fa-solid fa-ellipsis"></i>
          </CDropdownToggle>
          <CDropdownMenu>
            {tableType === "ready" &&
              <CDropdownItem onClick={() => props.modalProps.showHarvestModal(row)}>Harvest</CDropdownItem>
            }
            <CDropdownItem onClick={() => props.modalProps.showDiscardModal(row)}>Discard</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      )
    }
    const defaultColumn = React.useMemo(
      () => ({
        Filter: DefaultColumnFilter,
      })
    )
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, 
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageSize,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, selectedRowIds },
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      useExpanded,
      usePagination,
      useRowSelect,
      hooks => {}
    )
  
    // Render the UI for your table
    return (
      <>
        <table  className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} style={{width:column.cellWidth}}>
                    {column.render('Header')}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
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
                    return <td {...cell.getCellProps()} key={cell.column.id + "_" + cell.row.id}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <pre>

        </pre>
        <CPagination>
          <CPaginationItem onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <i className="fa-solid fa-angles-left"></i>
          </CPaginationItem>
          <CPaginationItem onClick={() => previousPage()} disabled={!canPreviousPage}>
            <i className="fa-solid fa-angle-left"></i>
          </CPaginationItem>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
            ({data.length === 1 ? data.length + " result" : data.length + " results"})
          </span>
          <CPaginationItem onClick={() => nextPage()} disabled={!canNextPage}>
            <i className="fa-solid fa-angle-right"></i>
          </CPaginationItem>
          <CPaginationItem onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
            <i className="fa-solid fa-angles-right"></i>
          </CPaginationItem>
          <div className='pagination-rows'>
            <label className='form-label'>Rows per page</label>
            <select
              className='form-select'
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </CPagination>
      </>
    )
  }
  
  function TableLineage(props) {

    const customFilter = (rows, columnIds, filterValue) => {
      let result = filterValue.length === 0 ? rows : rows.filter((row) => row.values[columnIds].Release !== null);
      result = result.filter((row)=>row.values[columnIds].SiteCode === row.values.SiteCode && row.values[columnIds].Release.includes(filterValue.toUpperCase()) || row.values[columnIds].SiteCode !== row.values.SiteCode && row.values[columnIds].SiteCode.includes(filterValue.toUpperCase()));
      return result;
    }

    const columns = React.useMemo(
      () => [
        {
          Header: 'Site Code',
          accessor: 'SiteCode',
        },
        {
          Header: 'Release',
          accessor: 'Release',
          Cell: ({ row }) => (
            <span className={"badge badge--lineage " + (props.siteCode === row.values.SiteCode ? "green":"yellow")}>{row.values.Release}</span>
          )
        },
        {
          Header: 'Predecessors',
          accessor: 'Predecessors',
          Cell: ({ row }) => {
            let tags = [];
            if(row.values.SiteCode !== row.values.Predecessors.SiteCode) {
              let values =  row.values.Predecessors.SiteCode?.split(",");
              for(let i in values) {
                tags.push(<span className="badge badge--lineage basic" key={"pred_"+row+values[i]}>{values[i]}</span>);
              }
            }
            return <span className="lineage-cell">{tags}</span>;
          },
          filter: customFilter,
        },
        {
          Header: 'Successors',
          accessor: 'Successors',
          Cell: ({ row }) => {
            let tags = [];
            if(row.values.SiteCode !== row.values.Successors.SiteCode) {
              let values = row.values.Successors.SiteCode?.split(",");
              for(let i in values) {
                tags.push(<span className="badge badge--lineage basic" key={"suc_"+row+values[i]}>{values[i]}</span>);
              }
            }
            // if(props.siteCode !== row.values.SiteCode && row.values.SiteCode !== row.values.Successors.SiteCode) {
            //   let values = row.values.Successors.SiteCode?.split(",");
            //   for(let i in values) {
            //     tags.push(<span className="badge badge--lineage basic" key={"suc_"+row+values[i]}>{values[i]}</span>);
            //   }
            // }
            return <span className="lineage-cell">{tags}</span>;
          },
          filter: customFilter,
        },
      ],
      []
    )

    if(props.hasOwnProperty('getRefresh') && props.getRefresh()){
      props.setRefresh(false);
      setEnvelopsData([]);
    }
    if(props.data==="nodata")
      return (<div className="nodata-container"><em>No Data</em></div>)
    else
    return (
      <>
        <Table
          columns={columns}
          data={props.data}
        />
      </>
    )
  }

export default TableLineage
