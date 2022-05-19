import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded  } from 'react-table'
import DropdownSiteChanges from './components/DropdownSiteChanges';

import ConfigData from '../../../config.json';

import {matchSorter} from 'match-sorter'

import { ModalChanges } from './ModalChanges';

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  )
  
  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <span>
        Search:{' '}
        <input
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
      </span>
    )
  }
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter, filteredRows },
  }) {
    const count = preFilteredRows.length
    const _filteredRows = filteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`pre: `+count+` FilteredRows: `+_filteredRows}
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
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
 
      state: { pageIndex, pageSize, selectedRowIds, expanded },
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
          {
            id: 'selection',          
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              row.canExpand ?(
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
              ): null
            ),            
          },
          ...columns,
        ])
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
                  <th>
                      {column.render('Header')}
                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>              
            ))}
             <tr>
          </tr>
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
        <pre>
            
        </pre>
        {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'«'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'Previous'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
          
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'Next'}
        </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'»'}
          </button>{' '}
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
        </div>
      </>
    )
  }
  
  function TableRSPag() {

    const [events, setEvents] = useState([]);
    const [modalItem, setModalItem] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [changesData, setChangesData] = useState({});

    useEffect(() => {
      fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/get')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      });
    }, [])

    let openModal = (data)=>{
      setModalVisible(true);
      setModalItem(data);
    }
  
    let closeModal = ()=>{
      setModalVisible(false);
      setModalItem("");
    }

    

    const columns = React.useMemo(
      () => [
        {
            id: 'expander',
            Cell: ({ row }) =>              
              row.canExpand ? (
                <span
                  {...row.getToggleRowExpandedProps({
                    style: {                      
                      paddingLeft: `${row.depth * 2}rem`,
                    },
                  })}
                >
                  {row.isExpanded ? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#22a4fb" width="16" height="16" viewBox="0 0 448 512">
                      <path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM136 232C122.7 232 112 242.7 112 256C112 269.3 122.7 280 136 280H312C325.3 280 336 269.3 336 256C336 242.7 325.3 232 312 232H136z"/>
                    </svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#22a4fb" width="16" height="16" viewBox="0 0 448 512">
                      <path d="M384,32H64C28.7,32,0,60.7,0,96v320c0,35.3,28.7,64,64,64h320c35.3,0,64-28.7,64-64V96C448,60.7,419.3,32,384,32z M312,280 h-64v64c0,13.3-10.7,24-24,24s-24-10.7-24-24v-64h-64c-13.3,0-24-10.7-24-24s10.7-24,24-24h64v-64c0-13.3,10.7-24,24-24 s24,10.7,24,24v64h64c13.3,0,24,10.7,24,24S325.3,280,312,280z"/>
                    </svg>
                  }
                </span>
              ) : null,
        },
        {
          Header: 'Sitecode',
          accessor: 'SiteCode',
        },
        {
          Header: 'Level',
          accessor: 'Level',
        },
        {
          Header: 'Change Category',
          accessor: 'ChangeCategory',
        },
        {
          Header: 'Change Type',
          accessor: 'ChangeType',
        },
        {
          Header: 'Country',
          accessor: 'Country',
        },
        {
          Header: () => null, 
          id: 'dropdownsiteChanges',
          Cell: ({ row }) =>
              row.canExpand ? (
                <DropdownSiteChanges clickFunction={()=>openModal(row.values.SiteCode)}/>          
              ) : null,
        },
      ],
      []
    )
  
    //const data = React.useMemo( () => SitechangesFile);

    let load_data= ()=>{

      if(!isLoading && Object.keys(changesData).length===0){
        setIsLoading(true);
        fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/get')
        .then(response => response.json())
        .then(data => {
                        setChangesData(data.Data);
                        setIsLoading(false);
                      });
      }
    }
    
    load_data();

    if(isLoading)
      return (<p><em>Loading...</em></p>)
    else
      return (
      <>
        <Table columns={columns} data={changesData} />        
        <ModalChanges visible = {modalVisible} close = {closeModal} item={modalItem} />
      </>
      )
  
  }
  
  export default TableRSPag