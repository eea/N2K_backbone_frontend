import React, {useState} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {
  CButton,
  CTooltip,
  CAlert,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';

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

  function Table({ columns, data }) {
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
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,   
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
        initialState: {hiddenColumns: ["Version"]},
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      useExpanded,
      usePagination,
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          ...columns,
          {
            Header: () => null,
            id: 'siteSDF',
            Cell: ({ row }) => {
              return (
                <CButton color="link" href={"/#/sdf?sitecode=" + row.original.SiteCode + "&version=" + row.original.Version + "&type=reference"} target="_blank">
                  SDF
                </CButton>
              )
            },
            canFilter: false
          },
        ]);
      }
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
                    return <td {...cell.getCellProps()} className={cell.column.className}>{cell.render('Cell')}</td>
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
  
  function TableNoChanges(props) {
    const [isLoading, setIsLoading] = useState(props.isLoading);
    const [sitesData, setSitesData] = useState([]);
    const [errorRequest, setErrorRequest] = useState(false);

    let dl = new(DataLoader);

    const customFilter = (rows, columnIds, filterValue) => {
      let result = filterValue.length === 0 ? rows : rows.filter((row) => row.original.SiteCode.toLowerCase().includes(filterValue.toLowerCase()) || row.original.Name.toLowerCase().includes(filterValue.toLowerCase()))
      return result;
    }

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
          },
          filter: customFilter,
        },
        {
          Header: 'Site Type',
          accessor: 'Type',
        },
      ],
      []
    )

    let loadData = () => {
      if((!isLoading && props.refresh) || (!isLoading && props.siteCodes !== "nodata" && Object.keys(props.siteCodes).length===0)){
        if(props.refresh){
          props.setRefresh(false);
        } 
        setIsLoading(true);
        let url = ConfigData.NOCHANGES_GET;
        url += 'country='+props.country;
        dl.fetch(url)
        .then(response =>response.json())
        .then(data => {
          if(data?.Success) {
            if(Object.keys(data.Data).length === 0){
              setSitesData("nodata");
              props.setSitecodes("nodata");
            }
            else {
              data.Data.map(a => {let row = a; a.Type = UtilsData.SITE_TYPES[a.Type]; return row});
              setSitesData(data.Data);
              props.setSitecodes(data.Data);
            }
          }
          else {
            setSitesData("nodata");
            props.setSitecodes("nodata");
            setErrorRequest(true);
          }
          setIsLoading(false);
        });
      }
    }
    
    if(!props.country) {
      if(sitesData !== "nodata") {
        setSitesData("nodata");
        props.setSitecodes({});
        setIsLoading(false);
      }
    } else {
      loadData();
    }

    if(isLoading)
      return (<div className="loading-container"><em>Loading...</em></div>)
    else
      if(sitesData==="nodata")
        if(errorRequest)
          return (<CAlert color="danger" className="mt-3">Something went wrong</CAlert>)
        else 
          return (<div className="nodata-container"><em>No Data</em></div>)
      else
        return (
          <>
            <Table
              columns={columns}
              data={sitesData}
            />
          </>
        )
  }

export default TableNoChanges
