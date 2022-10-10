import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {matchSorter} from 'match-sorter'
import ConfigData from '../../../config.json';
import {
  CPagination,
  CPaginationItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

const confStatus = ConfigData.HARVESTING_STATUS;

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

function Table({ columns, data, setSelected, modalProps, updateModalValues }) {
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
    hooks => {
      hooks.visibleColumns.push(columns => [
        ...columns,
        {
          Header: () => null, 
          id: 'unionListActions',
          cellWidth: "120px",
          Cell: ({ row }) => (
            <div className="display-flex">
              <div className="btn-icon" onClick={() => modalProps.downloadUnionList(row.original.idULHeader)}>
                <i className="fa-solid fa-download"></i>
              </div>
              <div className="btn-icon" onClick={() => modalProps.showEditModal(row.original.idULHeader, row.original.Name, row.original.Final)}>
                <i className="fa-solid fa-pencil"></i>
              </div>
              <div className="btn-icon" onClick={() => modalProps.showDeleteModal(row.original.idULHeader)}>
                <i className="fa-regular fa-trash-can"></i>
              </div>
            </div>
          )
        },
      ])
    }
  )
  if(setSelected) setSelected(Object.keys(selectedRowIds).filter(v=>!v.includes(".")).map(v=>{return {country:data[v].Country, version: data[v].Version}}))

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

function TableManagement(props) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [unionListsData, setUnionListsData] = useState([]);

  // useEffect(() => {
  //   fetch(ConfigData.HARVESTING_PRE_HARVESTED)
  //   .then(response => response.json())
  //   .then(data => {
  //     setEvents(data);
  //   });
  // }, [])

  const formatDate = (date) => {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    date = (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    return date;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'Name',
      },
      {
        Header: 'Final',
        accessor: 'Final',
        Cell: ({ cell }) => (
          cell.value ? "Yes" : "No"
        )
      },
      {
        Header: 'User',
        accessor: 'CreatedBy',
      },
      {
        Header: 'Date',
        accessor: 'Date',
        Cell: ({ cell }) => (
          formatDate(cell.value)
        )
      },
    ],
    []
  )

  let loadData = () => {
    if((!isLoading && props.refresh) || (!isLoading && unionListsData !== "nodata" && Object.keys(unionListsData).length===0)){
      if(props.refresh){        
        props.setRefresh(false);
      } 
      setIsLoading(true);
      fetch(ConfigData.UNIONLISTS_GET)
      .then(response =>response.json())
      .then(data => {
        if(Object.keys(data.Data).length === 0){
          setUnionListsData("nodata");
        }
        else {
          setUnionListsData(data.Data);
        }
        setIsLoading(false);
      });
    }
  }

  if(props.hasOwnProperty('getRefresh') && props.getRefresh()){
    props.setRefresh(false);
    setEnvelopsData([]);
    loadData();
  }
  else {
    loadData();
  }

  if(isLoading)
    return (<div className="loading-container"><em>Loading...</em></div>)
  else
    if(unionListsData==="nodata")
      return (<div className="nodata-container"><em>No Data</em></div>)
    else
    return (
      <>
        <Table
          columns={columns}
          data={unionListsData}
          modalProps={props.modalProps}
          updateModalValues={props.updateModalValues}
        />
      </>
    )
}

export default TableManagement
