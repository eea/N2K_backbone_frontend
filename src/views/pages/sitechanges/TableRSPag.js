import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded, initialExpanded } from 'react-table'
import DropdownSiteChanges from './components/DropdownSiteChanges';
import {
  CPagination,
  CPaginationItem,
  CImage,
} from '@coreui/react'

import ConfigData from '../../../config.json';

import {matchSorter} from 'match-sorter'

import { ModalChanges } from './ModalChanges';
import justificationrequired from './../../../assets/images/exclamation.svg'
import justificationprovided from './../../../assets/images/file-text.svg'

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <div className={"checkbox" + (rest.hidden ? " d-none" :"")} >
            <input type="checkbox" className="input-checkbox" ref={resolvedRef} {...rest}/>
            <label htmlFor={rest.id}></label>
          </div>
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
        placeholder={`Search`}
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

  function Table({ columns, data, setSelected, siteCodes, currentPage, currentSize, loadPage }) {

    const [pgCount, setPgCount] = useState(Math.ceil(siteCodes.length / currentSize));

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
        initialState: {pageSize: currentSize, pageIndex:currentPage},
        manualPagination:true,
        pageCount: pgCount,
        paginateExpandedRows: false
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
              
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} id="sitechanges_check_all" />
              
            ),
            Cell: ({ row }) => (
              row.canExpand ?(
              
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} name={"chk_"+row.original.SiteCode} sitecode={row.original.SiteCode} id={"sitechanges_check_" + row.id} />
             
              ): null
            ),
          },
          ...columns,
        ])
      }
    )

    if(setSelected) setSelected(Object.keys(selectedRowIds).filter(v=>!v.includes(".")).map(v=>{return {SiteCode:data[v].SiteCode, VersionId: data[v].Version}}));

    let changePage = (page,chunk)=>{
      loadPage(page,pageSize);
    }

    // Render the UI for your table
    return (
      <>        
        <table  className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>
                      {column.render('Header')}
                        {/*<div>{column.canFilter ? column.render('Filter') : null}</div>*/}
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
          <CPaginationItem onClick={() => changePage(0,gotoPage(0))} disabled={!canPreviousPage}>
            <i className="fa-solid fa-angles-left"></i>
          </CPaginationItem>
          <CPaginationItem onClick={() => changePage(pageIndex,previousPage())} disabled={!canPreviousPage}>
            <i className="fa-solid fa-angle-left"></i>
          </CPaginationItem>
          <span>
            Page{' '}
            <strong>
              {pageIndex+1} of {pageCount}
            </strong>{' '}
          </span>
          <CPaginationItem onClick={() => changePage(pageIndex+1,nextPage())} disabled={!canNextPage}>
            <i className="fa-solid fa-angle-right"></i>
          </CPaginationItem>
          <CPaginationItem onClick={() => changePage(pageCount-1,gotoPage(pageCount - 1))} disabled={!canNextPage}>
            <i className="fa-solid fa-angles-right"></i>
          </CPaginationItem>
          <div className='pagination-rows'>
            <label className='form-label'>Rows per page</label>
            <select
              className='form-select'
              value={pageSize}
              onChange={e => {
                setPgCount(Math.ceil(siteCodes.length / Number(e.target.value)));
                setPageSize(Number(e.target.value));
                loadPage(0,Number(e.target.value));
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
    const [siteCodes, setSitecodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentSize, setCurrentSize] = useState(30);
    const [levelCountry, setLevelCountry] = useState({});

    useEffect(() => {
      fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/get')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      });
    }, [])

    let forceRefreshData = ()=> setChangesData({});

    let resetPagination = () =>{
      setCurrentPage(0);
      setCurrentSize(30);
    }

    let loadPage = (page,size) =>{
      setCurrentPage(page);
      setCurrentSize(size);
      forceRefreshData();
    }

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
            props.setRefresh("pending",false);
            props.setRefresh("accepted",true);
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

    let markChanges = (change) =>{
      return props.mark({SiteCode:change.SiteCode,"Justification":change.JustificationRequired})
      .then(data => {
        if(data?.ok){
          forceRefreshData();          
        }else
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
                <div
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
                </div>
              ) : null,
        },
        {
          Header: 'Sitecode',
          accessor: 'SiteCode',
        },
        {
          Header: 'Level',
          accessor: 'Level',
          //Cell: (row ) => {            
           // row.styles['backgroundColor'] = row.value === 'Critical' ? 'badge badge--critical' : null
           // return row.value === "Critical" ? 'red' : 'green';              
          //}
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
          Header: '',
          accessor: "JustificationRequired",
          Cell: ({ row }) => (
            row.canExpand ? <> {row.value === true ? <CImage src={justificationrequired} className="ico--md "></CImage> : null } </> : null             
          ),
        },    
        {
          Header: '',
          accessor: "JustificationProvided",
          Cell: ({ row }) => (
            row.canExpand ? <> {row.value === true ? <CImage src={justificationprovided} className="ico--md "></CImage> : null  } </> : null             
          ),
        },    
        {
          Header: () => null, 
          id: 'dropdownsiteChanges',
          Cell: ({ row }) => {
              const contextActions = {
                review: ()=>openModal(row.original),
                accept: ()=>props.updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", ()=>acceptChanges(row.original), "Cancel", ()=>{}),
                reject: ()=>props.updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", ()=>rejectChanges(row.original), "Cancel", ()=>{}),
                switchMark: ()=>props.updateModalValues("Mark Changes", "This will mark all the site changes", "Continue", ()=>switchMarkChanges(row.original), "Cancel", ()=>{}),
              }
              return row.canExpand ? (
                <DropdownSiteChanges actions={contextActions}/>          
              ) : null
          }
        },
      ],
      []
    )

    let getSiteCodes= ()=>{
      let url = ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/GetSiteCodes/';
      url += 'country='+props.country;
      url += '&status='+props.status;
      url += '&level='+props.level;
      return fetch(url)
      .then(response => response.json())
      .then(data => {
        setSitecodes(data.Data);
      });      
    }
  
    let loadData= ()=>{
      
      if(props.getRefresh()||(!isLoading && changesData!=="nodata" && Object.keys(changesData).length===0)){

        let promises=[];
        setIsLoading(true);
        
        if(props.getRefresh()||(levelCountry==={})||(levelCountry.level!==props.level)||(levelCountry.country!==props.country)){
          props.setRefresh(props.status,false);  //For the referred status, data is updated
          resetPagination();
          promises.push(getSiteCodes());
          setLevelCountry({level:props.level,country:props.country});
        }

        let url = ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/get/';
        url += 'country='+ props.country;
        url += '&status='+props.status;
        url += '&level='+props.level;
        url += '&page='+(currentPage+1);
        url += '&limit='+currentSize;
        promises.push(
          fetch(url)
          .then(response => response.json())
          .then(data => {
            if(Object.keys(data.Data).length===0)
              setChangesData("nodata");
            else
              setChangesData(data.Data);
          })
        )
        Promise.all(promises).then(v=>setIsLoading(false));
      }
    }
    
    loadData();

    if(isLoading)
      return (<div className="loading-container"><em>Loading...</em></div>)
    else
      if(changesData==="nodata")
        return (<p><em>No Data Avalaible</em></p>)
      else
        return (
        <>
          <Table 
            columns={columns} 
            data={changesData} 
            setSelected={props.setSelected} 
            siteCodes={siteCodes} 
            currentPage={currentPage}
            currentSize={currentSize} 
            loadPage = {loadPage}
          />        
          <ModalChanges visible = {modalVisible} 
                        close = {closeModal} 
                        accept={()=>acceptChanges(modalItem)} 
                        reject={()=>rejectChanges(modalItem)} 
                        mark={()=>switchMarkChanges(modalItem)}
                        item={modalItem.SiteCode} 
                        version={modalItem.Version} 
                        updateModalValues = {props.updateModalValues}
          />
        </>
        )
  
  }
  
  export default TableRSPag
  