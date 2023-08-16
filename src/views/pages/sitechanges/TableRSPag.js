import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded, initialExpanded } from 'react-table'
import DropdownSiteChanges from './components/DropdownSiteChanges';
import {
  CPagination,
  CPaginationItem,
  CImage,
  CTooltip
} from '@coreui/react'

import ConfigData from '../../../config.json';

import {matchSorter} from 'match-sorter'

import { ModalChanges } from './ModalChanges';
import justificationrequired from './../../../assets/images/exclamation.svg'
import justificationprovided from './../../../assets/images/file-text.svg'
import merge from './../../../assets/images/merge.svg'
import split from  './../../../assets/images/split.svg'
import {DataLoader} from '../../../components/DataLoader';

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

  const ClearSelectionLink = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
         <div className={"hiddenCheckbox" + (rest.hidden ? " d-none" :"")} >
            <input  type="checkbox" className="input-checkbox" ref={resolvedRef} {...rest}/>
            <label htmlFor={rest.id}>
              <span className="message-board-link">Clear selection</span>
            </label>
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

  function Table({ columns, data, setSelected, siteCodes, currentPage, currentSize, loadPage, status, updateModalValues, isTabChanged, setIsTabChanged }) {
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [pgCount, setPgCount] = useState(Math.ceil(siteCodes.length / currentSize));
    const [selectedRows, setSelectedRows] = useState(0);

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
      isAllPageRowsSelected,      
      toggleAllRowsSelected,
      getToggleAllPageRowsSelectedProps,   
      state: { pageIndex, pageSize, selectedRowIds, expanded, expandSubRows },
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
        initialState: {pageSize: currentSize, pageIndex:currentPage, hiddenColumns: ["EditedDate", "EditedBy", "JustificationRequired", "JustificationProvided"]},
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
            cellWidth: '48px',
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} id={"sitechanges_check_all_" + status} />
              {isAllPageRowsSelected ? null : setSelectedRows(0)}
              </>
            ),
            Cell: ({ row }) => (
              row.canExpand ?(
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} name={"chk_"+row.original.SiteCode} sitecode={row.original.SiteCode} id={"sitechanges_check_" +  row.original.SiteCode} />
              ): null
            ),
          },
          ...columns,
        ])
      }
    )

    selectedRows === siteCodes.length && setSelected ?
      setSelected(siteCodes.map(v =>{return {SiteCode: v.SiteCode, VersionId: v.Version}}))
    :
      setSelected(Object.keys(selectedRowIds).filter(v=>!v.includes(".")).map(v=>{return {SiteCode:data[v].SiteCode, VersionId: data[v].Version}}))
        
    let changePage = (page,chunk)=>{
      loadPage(page,pageSize);
    }    
  
    // clear selection when tab is changed
    useEffect(() => {
      if(isTabChanged) {
        setIsTabChanged(false);
        toggleAllRowsSelected(false);
      }
    }, [isTabChanged]);

    let countSitesOnPage = () => {
      return page.filter(row => !row.id.includes(".")).length;
    }

    // Render the UI for your table
    return (
      <>
      {isAllPageRowsSelected && 
        (
          (status === 'pending' || status === 'accepted' || status === 'rejected')
          && (selectedRows === siteCodes.length || pageSize >= siteCodes.length) ?
          <div className="message-board">
            <span className="message-board-text">All the <b>{siteCodes.length}</b> sites are selected</span>
            <ClearSelectionLink {...getToggleAllPageRowsSelectedProps()} id={"sitechanges_check_all_" + status} />
          </div>
          :
          <div className="message-board">
            <span className="message-board-text">The <b>{countSitesOnPage()}</b> sites of this page are selected</span>
            <span className="message-board-link" onClick={() =>(setSelectedRows(siteCodes.length), setSelected(siteCodes))}>Select {siteCodes.length} sites</span>
          </div> 
        )
      }
        <table  className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id} style={{width:column.cellWidth}}>
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
                    return <td {...cell.getCellProps()} className={cell.column.className}>{cell.render('Cell')}</td>
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
          <CPaginationItem onClick={() => changePage(pageIndex-1,previousPage())} disabled={!canPreviousPage}>
            <i className="fa-solid fa-angle-left"></i>
          </CPaginationItem>
          <span>
            Page{' '}
            <strong>
              {pageIndex+1} of {pageCount}
            </strong>{' '}
            ({siteCodes.length === 1 ? siteCodes.length + " result" : siteCodes.length + " results"})
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
    const [modalItem, setModalItem] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [changesData, setChangesData] = useState({});
    const [siteCodes, setSitecodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentSize, setCurrentSize] = useState(30);
    const [levelCountry, setLevelCountry] = useState({});

    let dl = new(DataLoader);

    let forceRefreshData = ()=> setChangesData({});

    let getSite = () => {
      if(siteCodes.length > 0) {
        const site = siteCodes.filter(v => v.SiteCode === props.site)[0];
        if(site) {
          props.setSite("");
          return site;
        }
      }
      return {};
    }

    let loadPage = (page,size) =>{
      setCurrentPage(page);
      setCurrentSize(size);
      forceRefreshData();
    }

    let showModal = (data) => {
      if(Object.keys(modalItem).length === 0)
        if(props.status == data.status || props.site)
          openModal(data);
    }

    let openModal = (data, activeKey)=>{
      setModalItem({...data, ActiveKey: activeKey});
      setModalVisible(true);
    }
  
    let closeModal = ()=>{
      setModalVisible(false);
      setModalItem({});
      props.closeModal();
    }

    let setBackToPendingWithVersion = (version) => {
      let newModalItem = modalItem;
      newModalItem.Version = version;
      setModalItem({...newModalItem});
      return setBackToPending(modalItem);
    }

    let setBackToPending = (change, refresh)=>{
      return props.setBackToPending({"SiteCode":change.SiteCode,"VersionId":change.Version}, refresh)
        .then(data => {
          if(data?.ok){
            if(refresh) {
              forceRefreshData();
            }
          }
          return data;
        });
    }

    let acceptChanges = (change, refresh)=>{
      return props.accept({"SiteCode":change.SiteCode,"VersionId":change.Version}, refresh)
      .then(data => {
          if(data?.ok){
            if(refresh) {
              forceRefreshData();
            }
          }
          return data;
      });
    }

    let rejectChanges = (change, refresh)=>{
      return props.reject({"SiteCode":change.SiteCode,"VersionId":change.Version}, refresh)
      .then(data => {
        if(data?.ok){
          if(refresh) {
            forceRefreshData();
          }
        }
        return data;
    });
    }

    let switchMarkChanges = (change) =>{            
      return props.mark({"SiteCode":change.SiteCode,"VersionId":change.Version,"Justification":!change.JustificationRequired})
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
          cellWidth: '48px',
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
          Header: 'Site Code',
          accessor: 'SiteCode',
          className:"cell-sitecode",
          Cell: ({ row }) => {
            return (
              row.values.SiteCode ? (
                <CTooltip
                  content={row.original.SiteName}
                  placement="top"
                >
                  <div>
                    {row.values.SiteCode + " - " + row.original.SiteName}
                  </div>
                </CTooltip>
              ) : null
            )
          }
        },
        {
          Header: 'Level',
          accessor: 'Level',
          Cell: ({ row }) => {
            return (
              row.original.Level ? (
                <span className={"badge badge--" + row.original.Level.toLowerCase()}>
                  {row.values.Level}
                </span>
              ) : null
            )
          }
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
          Header: () => null,
          accessor: "LineageChangeType",
          Cell: ({ row }) => {
            if(row.values.LineageChangeType === "Recode")
              return (
                <CTooltip
                  content="Site Recode"
                  placement="top"
                >
                  <div className="btn-icon btn-hover" onClick={() => openModal(row.original)}>
                    <i className="fa-solid fa-repeat"/>
                  </div>
                </CTooltip>
              )
            else if(row.values.LineageChangeType === "Split")
              return (
                <CTooltip
                  content="Site Split"
                  placement="top"
                >
                  <div className="btn-icon btn-hover" onClick={() => openModal(row.original)}>
                    <CImage src={split} className="ico--md "></CImage>
                  </div>
                </CTooltip>
              )
            else if(row.values.LineageChangeType === "Merge")
              return (
                <CTooltip
                  content="Site Merge"
                  placement="top"
                >
                  <div className="btn-icon btn-hover" onClick={() => openModal(row.original)}>
                    <CImage src={merge} className="ico--md "></CImage>
                  </div>
                </CTooltip>
              )
            else
              return (null);
          }
        },
        {
          Header: () => null,          
          accessor: 'Justification',          
          Cell: ({row}) => (<>
            {row.values.JustificationRequired ? 
            row.canExpand ? <> {row.values.JustificationRequired && !row.values.JustificationProvided ? 
              <CTooltip
                content="Justification Required"
                placement="top"
              > 
                <div className="btn-icon btn-hover">
                  <CImage src={justificationrequired} className="ico--md "></CImage>
                </div>
              </CTooltip>
            : null } </> : null : null } 
            
            {row.values.JustificationProvided ?
              row.canExpand ? <> {row.values.JustificationRequired && row.values.JustificationProvided ?
                <CTooltip
                  content="Justification Provided"
                  placement="top"
                >
                  <div className="btn-icon btn-hover">
                    <CImage src={justificationprovided} className="ico--md "></CImage>
                  </div>
                </CTooltip>
              : null } </> : null : null }
            </>)
        },
        {
          Header: () => null,
          accessor: 'Edition',
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
          accessor: "JustificationRequired",                            
        },
        {
          Header: () => null,
          accessor: "JustificationProvided",         
        },
        {
          Header: () => null,
          accessor: "EditedDate",
        },
        {
          Header: () => null,
          accessor: "EditedBy",
        },
        {
          Header: () => null, 
          id: 'dropdownsiteChanges',
          cellWidth: '48px',
          Cell: ({ row }) => {
              const toggleMark = row.values.JustificationRequired ? "Unmark" : "Mark";
              return row.canExpand ? (
                <DropdownSiteChanges actions={getContextActions(row, toggleMark)} toggleMark = {toggleMark}/>          
              ) : null
          }
        },
      ],
      []
    )

    let getContextActions = (row, toggleMark)=>{
      switch(props.status){
        case 'pending':
          return {
            review: ()=>openModal(row.original),
            accept: ()=>props.updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", ()=>acceptChanges(row.original, true), "Cancel", ()=>{}),
            reject: ()=>props.updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", ()=>rejectChanges(row.original, true), "Cancel", ()=>{}),
            mark: ()=>props.updateModalValues(`${toggleMark} Changes`, `This will ${toggleMark.toLowerCase()} all the site changes`, "Continue", ()=>switchMarkChanges(row.original), "Cancel", ()=>{}),            
          }
        case 'accepted':
          return {
            review: ()=>openModal(row.original),
            backPending: ()=>props.updateModalValues("Back to Pending", "This will set the changes back to Pending", "Continue", ()=>setBackToPending(row.original, true), "Cancel", ()=>{}),
            edition: ()=>openModal(row.original, 3),
          }
        case 'rejected':
          return {
            review: ()=>openModal(row.original),
            backPending: ()=>props.updateModalValues("Back to Pending", "This will set the changes back to Pending", "Continue", ()=>setBackToPending(row.original, true), "Cancel", ()=>{}),
          }
        default:
          return {}
      }
    }

    let getSiteCodes= ()=>{
      let url = ConfigData.SITECODES_GET;
      url += 'country='+props.country;
      url += '&status='+props.status;
      url += '&level='+props.level;
      url += '&onlyedited='+props.onlyEdited;
      return dl.fetch(url)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          props.setSitecodes(props.status,data.Data);
          setSitecodes(data.Data);
        }
      });
    }
  
    let loadData= ()=>{
      if(props.getRefresh()||(!isLoading && changesData!=="nodata" && Object.keys(changesData).length===0)){
        let promises=[];
        setIsLoading(true);
        
        if(props.getRefresh()||(levelCountry==={})||(levelCountry.level!==props.level)||(levelCountry.country!==props.country)){
          props.setRefresh(props.status,false);  //For the referred status, data is updated
          promises.push(getSiteCodes());
          setLevelCountry({level:props.level,country:props.country});
        }

        let url = ConfigData.SITECHANGES_GET;
        url += 'country='+ props.country;
        url += '&status='+props.status;
        url += '&level='+props.level;
        url += '&page='+(currentPage+1);
        url += '&limit='+currentSize;
        url += '&onlyedited='+props.onlyEdited;
        promises.push(
          dl.fetch(url)
          .then(response => response.json())
          .then(data => {
            if(data?.Success) {
              if(Object.keys(data.Data).length===0)
                setChangesData("nodata");
              else
                setChangesData(data.Data);
            }
          })
        )
        Promise.all(promises).then(v=>setIsLoading(false));
      }
    }
    
    if(!props.country) {
      if(changesData !== "nodata") {
        setChangesData("nodata");
        setSitecodes([]);
        props.setSitecodes({});
        setIsLoading(false);
      }
      //return(<></>);
    } else {
      loadData();
    }

    if(isLoading)
      return (<div className="loading-container"><em>Loading...</em></div>)
    else
      if(changesData==="nodata")
        return (<div className="nodata-container"><em>No Data</em></div>)
      else{
        if(Array.isArray(changesData)){
          const data = getSite();
          if(data.SiteCode){
            showModal(data);
          }
        }
        
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
            status={props.status}
            isTabChanged={props.isTabChanged}
            setIsTabChanged={props.setIsTabChanged}
          />
          {props.showModal && showModal(props.showModal)}
          <ModalChanges
            visible = {modalVisible}
            close = {closeModal}
            accept={()=>acceptChanges(modalItem)}
            reject={()=>rejectChanges(modalItem)}
            backToPending={(version) => setBackToPendingWithVersion(version)}
            mark={()=>switchMarkChanges(modalItem)}
            status={props.status}
            level={props.level}
            item={modalItem.SiteCode}
            version={modalItem.Version}
            country={props.country}
            updateModalValues = {props.updateModalValues}
            justificationRequired={modalItem.JustificationRequired}
            justificationProvided={modalItem.JustificationProvided}
            activeKey={modalItem.ActiveKey}
          />
        </>
        )
      }
  
  }
  
export default TableRSPag
