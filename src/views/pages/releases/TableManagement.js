import React, {useState} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {matchSorter} from 'match-sorter'
import ConfigData from '../../../config.json';
import {
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import {DataLoader} from '../../../components/DataLoader';

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {

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
          id: 'unionListEdit',
          cellWidth: "48px",
          Cell: ({ row }) => (
            <div className="btn-icon" onClick={() => modalProps.showEditModal(row.original.ID, row.original.Title, row.original.Final === "Yes" ? true : false)}>
              <i className="fa-solid fa-pencil"></i>
            </div>
          )
        },
        {
          Header: () => null,
          id: 'unionListDelete',
          cellWidth: "48px",
          Cell: ({ row }) => (
            <div className="btn-icon" onClick={() => modalProps.showDeleteModal(row.original.ID)}>
              <i className="fa-regular fa-trash-can"></i>
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
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [releasesData, setReleasesDate] = useState([]);
  let dl = new(DataLoader);

  const formatDate = (date) => {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    date = (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    return date;
  };

  const customFilter = (rows, columnIds, filterValue) => {
    if(columnIds[0] === "CreateDate") {
      return rows.filter((row) => formatDate(row.values[columnIds]).includes(filterValue));
    }
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'Title',
      },
      {
        Header: 'Official',
        accessor: 'Final',
      },
      {
        Header: 'User',
        accessor: 'Author',
      },
      {
        Header: 'Date',
        accessor: 'CreateDate',
        Cell: ({ cell }) => (
          formatDate(cell.value)
        ),
        filter: customFilter,
      },
    ],
    []
  )

  let loadData = () => {
    if((!isLoading && props.refresh) || (!isLoading && releasesData !== "nodata" && Object.keys(releasesData).length===0)){
      if(props.refresh){
        props.setRefresh(false);
      } 
      setIsLoading(true);
      dl.fetch(ConfigData.RELEASES_GET)
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setReleasesDate("nodata");
          }
          else {
            data.Data = data.Data.map(a=>{a.Final = a.Final? "Yes":"No"; return a});
            setReleasesDate(data.Data.sort((a,b)=>new Date(b.CreateDate)-new Date(a.CreateDate)));
          }
          setIsLoading(false);
        }
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
    if(releasesData==="nodata")
      return (<div className="nodata-container"><em>No Data</em></div>)
    else
    return (
      <>
        <Table
          columns={columns}
          data={releasesData}
          modalProps={props.modalProps}
          updateModalValues={props.updateModalValues}
        />
      </>
    )
}

export default TableManagement
