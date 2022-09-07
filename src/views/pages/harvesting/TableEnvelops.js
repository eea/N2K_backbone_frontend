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

const status = ConfigData.HARVESTING_STATUS;

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
      let checkedAll;
      if (document.querySelectorAll("input:not(#harvesting_check_all):checked").length == 0) {
        indeterminate = false;
      }
      else if (!document.querySelector("#harvesting_check_all").checked && document.querySelectorAll("input[id^=harvesting_check]:not(#harvesting_check_all)").length === document.querySelectorAll("input:not(#harvesting_check_all):checked").length) {
        indeterminate = false;
        checkedAll = true;
      }
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
        if (checkedAll) {
          resolvedRef.current.checked = true;
        }
      }, [resolvedRef, indeterminate])
  
      return (
        <div className={"checkbox" + (rest.hidden ? " d-none" :"")} >
          <input type="checkbox" className="input-checkbox" ref={resolvedRef} {...rest}/>
          <label htmlFor={rest.id}></label>
        </div>
      )
    }
  )
  
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
      let row = {versionId: props.versionId, countryCode: props.countryCode};
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
        if(tableType==="incoming" || tableType==="ready"){
          hooks.visibleColumns.push(columns => [
            {
              id: 'selection',
              cellWidth: '48px',
              Header: ({ getToggleAllPageRowsSelectedProps }) => (
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} id="harvesting_check_all"/>
              ),
              Cell: ({ row }) => (
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} id={"harvesting_check_" + row.values.Version}/>
              ),
            },
            ...columns,
            {
              Header: () => null, 
              id: 'dropdownEnvelops',
              cellWidth: "48px",
              Cell: ({ row }) => (
                tableType === "incoming" || tableType === "ready" ?
                  <DropdownHarvesting canHarvest={row.original.CanHarvest} versionId={row.values.Version} countryCode={row.original.CountryCode} modalProps={modalProps}/>
                : <i className="fa-solid fa-arrow-right"></i>
              )
            },
          ])
        }
        if(tableType==="progress"){
          hooks.visibleColumns.push(columns => [
            ...columns,
            {
              Header: () => null, 
              id: 'dropdownEnvelops',
              cellWidth: "48px",
              Cell: ({ row }) => (
                <a href={"/#/sitechanges?country=" + row.original.CountryCode}>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              )
            },
          ])
        }
        if(tableType==="processed"){
          hooks.visibleColumns.push(columns => [
            ...columns,
            {
              Header: () => null, 
              id: 'dropdownEnvelops',
              cellWidth: "48px",
              Cell: ({ row }) => (
                <a href="">
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              )
            },
          ])
        }
      }
    )
    if(setSelected) setSelected(Object.keys(selectedRowIds).filter(v=>!v.includes(".")).map(v=>{return {CountryCode:data[v].CountryCode, VersionId: data[v].Version}}))
  
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
          </span>
          <CPaginationItem onClick={() => nextPage()} disabled={!canNextPage}>
            <i className="fa-solid fa-angle-right"></i>
          </CPaginationItem>
          <CPaginationItem onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
  
  function TableEnvelops(props) {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [envelopsData, setEnvelopsData] = useState({});

    useEffect(() => {
      fetch(ConfigData.HARVESTING_PRE_HARVESTED)
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      });
    }, [])

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
          Header: 'Envelope ID',
          accessor: 'Version',
        },
        {
          Header: 'Status',
          accessor: 'Status',
          Cell: ({ cell }) => (
            <span className={"badge badge--"+props.tableType}>{status[props.tableType]}</span>
          )
        },
        {
          Header: 'Country',
          accessor: 'Country',
        },
        {
          Header: 'Changes',
          accessor: 'Changes',
        },
        {
          Header: 'Submission date',
          accessor: 'ImportDate',
          Cell: ({ cell }) => (
            formatDate(cell.value)
          )
        },
      ],
      []
    )

    let loadData = () => {
      if(!isLoading && Object.keys(envelopsData).length===0){
        setIsLoading(true);
        fetch(ConfigData.HARVESTING_PRE_HARVESTED)
        .then(response => response.json())
        .then(data => {
          setEnvelopsData(data.Data);
          if(Object.keys(envelopsData).length === 0){
            setIsLoading(false);
          }
          else {
            setIsLoading('nodata');
          }
        });
      }
    }

    loadData();

    if(isLoading) {
      return (<div className="loading-container"><em>Loading...</em></div>)
    }
    else if (isLoading === 'nodata') {
      return (<div className="nodata-container"><em>No Data</em></div>)
    }
    else {
      return (
        <>
          <Table columns={columns} data={envelopsData} tableType={props.tableType} setSelected={props.setSelected} modalProps={props.modalProps}/>
        </>
      )
    }
  }

  export default TableEnvelops