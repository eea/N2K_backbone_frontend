import React, {useState} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {matchSorter} from 'match-sorter'
import ConfigData from '../../../config.json';
import {
  CTooltip,
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
      initialState: {hiddenColumns: ["EditedDate", "EditedBy"]}, //pageSize: currentSize, pageIndex:currentPage, 
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
          id: 'siteEdited',
          Cell: ({ row }) => {
            return (
              row.values.EditedDate && row.values.EditedBy ? (
                  <CTooltip 
                    content={"Edited"
                      + (row.values.EditedDate && " on " + row.values.EditedDate.slice(0,10).split('-').reverse().join('/'))
                      + (row.values.EditedBy && " by " + row.values.EditedBy)}>
                    <div className="btn-icon btn-hover">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </div>
                  </CTooltip>
              ) : null
            )
          }
        },
        {
          Header: () => null,
          id: 'siteEdit',
          cellWidth: "48px",
          Cell: ({ row }) => (
            <div className="btn-icon" onClick={() => modalProps.showEditModal(row.original.ID, row.original.Title, row.original.IsOfficial === "Yes" ? true : false)}>
              <a>Edit</a>
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

function TableEdition(props) {
  const [isLoading, setIsLoading] = useState(props.isLoading);
  const [releasesData, setReleasesData] = useState([]);
  let dl = new(DataLoader);

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
        Header: 'Site Code',
        accessor: 'SiteCode',
        className:"cell-sitecode",
        Cell: ({ row }) => {
          return (
            row.values.SiteCode ? (
              <CTooltip
                content={row.original.Name}
                placement="top"
              >
                <div>
                  {row.values.SiteCode + " - " + row.original.Name}
                </div>
              </CTooltip>
            ) : null
          )
        }
      },
      {
        Header: 'Site Type',
        accessor: 'Type',
      },
      {
        Header: 'Edited By',
        accessor: 'EditedBy',
      },
      {
        Header: 'Edited Date',
        accessor: 'EditedDate',
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
      dl.fetch(ConfigData.SITEEDITION_NON_PENDING_GET+"country="+props.country)
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setReleasesData("nodata");
          }
          else {
            setReleasesData(data.Data);
            //setSearchList(getSitesList(data.Data));
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

export default TableEdition
