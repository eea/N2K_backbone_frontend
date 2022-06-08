import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded, initialExpanded } from 'react-table'
import DropdownSiteChanges from './components/DropdownSiteChanges';
import {
  CPagination,
  CPaginationItem,
} from '@coreui/react'

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
      /*
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`search`}
        className="input--table-filters"
      />
      */
     <></>
    )
  }

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
  }
  
  fuzzyTextFilterFn.autoRemove = val => !val

  function Table({ columns, data, setSelected }) {

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
      initialExpanded,
      state: { pageIndex, pageSize, selectedRowIds, expanded, expandSubRows },
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
        initialState: {pageSize: 30},
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
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} name={"chk_"+row.original.SiteCode} sitecode={row.original.SiteCode} />
              </div>
              ): null
            ),            
          },
          ...columns,
        ])
      }
    )

    if(setSelected) setSelected(Object.keys(selectedRowIds).filter(v=>!v.includes(".")).map(v=>{return {SiteCode:data[v].SiteCode, VersionId: data[v].Version}}))
  
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
  
  function TableRSPag(props) {

    const [events, setEvents] = useState([]);
    const [modalItem, setModalItem] = useState({});
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

    let forceRefreshData = ()=> setChangesData({});

    let openModal = (data)=>{
      setModalVisible(true);
      setModalItem(data);
    }
  
    let closeModal = (refresh)=>{
      setModalVisible(false);
      setModalItem({});
      if(refresh) forceRefreshData(); //To force refresh
    }

    let acceptChanges = (change)=>{
      return props.accept({"SiteCode":change.SiteCode,"VersionId":change.Version})
      .then(data => {
          if(data?.ok){
            forceRefreshData();
          }
          return data;
      });
    }

    let rejectChanges = (change)=>{
      return props.reject({"SiteCode":change.SiteCode,"VersionId":change.Version})
      .then(data => {
        if(data?.ok){
          forceRefreshData();
          props.setRefresh("pending",false);
          props.setRefresh("rejected",true);
        }
        else
          alert("something went wrong!");
        return data;
    }).catch(e => {
          alert("something went wrong!");
    });
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
                  className="row-expand"
                >
                  {row.isExpanded ? 
                    <i className="fa-solid fa-square-minus"></i>
                    : 
                    <i className="fa-solid fa-square-plus"></i>
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
          Cell: ({ row }) => {
              const contextActions = {
                review: ()=>openModal(row.original),
                accept: ()=>props.updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", ()=>acceptChanges(row.original), "Cancel", ()=>{}),
                reject: ()=>props.updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", ()=>rejectChanges(row.original), "Cancel", ()=>{}),
              }
              return row.canExpand ? (
                <DropdownSiteChanges actions={contextActions}/>          
              ) : null
          }
        },
      ],
      []
    )
  
    let loadData= ()=>{
      if(props.getRefresh()||(!isLoading && changesData!=="nodata" && Object.keys(changesData).length===0)){
        props.setRefresh(props.status,false);
        setIsLoading(true);
        fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/getbystatus?status='+props.status)
        .then(response => response.json())
        .then(data => {
                        if(Object.keys(data.Data).length===0)
                          setChangesData("nodata");
                        else
                          setChangesData(data.Data);
                        setIsLoading(false);
                      });
      }
    }
    
    loadData();

    if(isLoading)
      return (<p><em>Loading...</em></p>)
    else
      if(changesData==="nodata")
        return (<p><em>No Data Avalaible</em></p>)
      else
        return (
        <>
          <Table columns={columns} data={changesData} setSelected={props.setSelected}/>        
          <ModalChanges visible = {modalVisible} 
                        close = {closeModal} 
                        accept={()=>acceptChanges(modalItem)} 
                        reject={()=>rejectChanges(modalItem)} 
                        item={modalItem.SiteCode} 
                        version={modalItem.Version} 
                        updateModalValues = {props.updateModalValues}
          />
        </>
        )
  
  }
  
  export default TableRSPag