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
  CTooltip,
  CButton,
} from '@coreui/react'
import { ModalLineage } from './ModalLineage';
import {DataLoader} from '../../../components/DataLoader';

let testData = [
  {SiteCode:"AT2173000", SiteName:"Althofener Moor", Type:"Creation", Reference:"", Reported:"AT2173000"},
  {SiteCode:"AT2111000", SiteName:"Völkermarkter Stausee", Type:"Deletion", Reference:"AT2111000", Reported:""},
  {SiteCode:"AT1127119", SiteName:"Burgenländische Leithaauen", Type:"Split", Reference:"AT1127119", Reported:"AT2208000,AT2209000"},
  {SiteCode:"AT1119622", SiteName:"Auwiesen Zickenbachtal", Type:"Merge", Reference:"AT1119620,AT1119621", Reported:"AT1119622"},
  {SiteCode:"AT1102112", SiteName:"Zurndorfer Eichenwald und Hutweide", Type:"Recode", Reference:"AT1102112", Reported:"AT1102113"},
]
testData = Array(20).fill(testData).flat();


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

  function DropdownLineage(props) {
    return (
      <CDropdown>
        <CDropdownToggle className="btn-more" caret={false} size="sm">
          <i className="fa-solid fa-ellipsis"></i>
        </CDropdownToggle>
        <CDropdownMenu>
          {props.actions.consolidate && <CDropdownItem role={'button'} onClick={() => props.actions.consolidate()}>Consolidate changes</CDropdownItem>}
          {props.actions.reject && <CDropdownItem role={'button'} onClick={() => props.actions.reject()}>Reject changes</CDropdownItem>}
          {props.actions.backProposed && <CDropdownItem role={'button'} onClick={() => props.actions.backProposed()}>Back to Proposed</CDropdownItem>}
        </CDropdownMenu>
      </CDropdown>
    )
  }

  function Table({ columns, data, siteCodes, currentPage, currentSize, loadPage, status, updateModalValues, isTabChanged, setIsTabChanged }) {

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
      state: { pageIndex },
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
    )  
  
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

    let loadPage = (page,size) =>{
      setCurrentPage(page);
      setCurrentSize(size);
      forceRefreshData();
    }

    let showModal = (data) => {
      if ((Object.keys(modalItem).length === 0) &&
      (data.status === props.status)
      ) {
        openModal(data);
      }
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

    let setBackToProposed = (change, refresh)=>{
      return props.setBackToProposed({"ChangeId":change.id}, refresh)
      .then(data => {
        if(data?.ok){
          if(refresh) {
            forceRefreshData();
          }
        }
        return data;
      });
    }

    let consolidateChanges = (change, refresh)=>{
      return props.consolidate(change, refresh)
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
      return props.reject({"ChangeId":change.id}, refresh)
      .then(data => {
        if(data?.ok){
          if(refresh) {
            forceRefreshData();
          }
        }
        return data;
      });
    }

    const customFilter = (rows, columnIds, filterValue) => {
      let result = filterValue.length === 0 ? rows : rows.filter((row) => row.original.SiteCode.toLowerCase().includes(filterValue.toLowerCase()) || row.original.SiteName.toLowerCase().includes(filterValue.toLowerCase()))
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
                  content={row.original.SiteName}
                  placement="top"
                >
                  <div>
                    {row.values.SiteCode + " - " + row.original.SiteName}
                  </div>
                </CTooltip>
              ) : null
            )
          },
          filter: customFilter,
        },
        {
          Header: 'Type',
          accessor: 'Type',
          Cell: ({ row }) => {
            return (
              <span className={"badge badge--lineage " + row.values.Type.toLowerCase()}>
                {row.values.Type}
              </span>
            )
          },
        },
        {
          Header: 'Reference',
          accessor: 'Reference',
          Cell: ({ row }) => {
            let tags = [];
            if(row.original.Type === "Merge"){
              let values = row.original.Reference?.split(",");
              for(let i in values) {
                tags.push(<span className={"badge badge--lineage "+row.original.Type.toLowerCase()} key={"ref_"+i}>{values[i]}</span>);
              }
            }
            else if(!row.original.Reference){
              tags = "-"
            }
            else {
              tags =
                <span className={"badge badge--lineage basic"}>
                  {row.values.Reference}
                </span>
            }
            return tags;
          },
        },
        {
          Header: 'Reported',
          accessor: 'Reported',
          Cell: ({ row }) => {
            let tags = [];
            if(row.original.Type === "Split" || row.original.Type === "Recode"){
              let values = row.original.Reported?.split(",");
              for(let i in values) {
                tags.push(<span className={"badge me-1 mb-1 mt-1 badge--lineage "+row.original.Type.toLowerCase()} key={"rep_"+i}>{values[i]}</span>);
              }
            }
            else if(!row.original.Reported){
              tags = "-"
            }
            else {
              tags =
                <span className={"badge badge--lineage basic"}>
                  {row.values.Reported}
                </span>
            }
            return tags;
          },
        },
        {
          Header: () => null, 
          id: 'reviewLineage',
          Cell: ({ row }) => {
            return (
              <CButton color="link" onClick={()=>openModal(row.original)}>
                Review
              </CButton>
            )
          },
          canFilter: false
        },
        {
          Header: () => null, 
          id: 'dropdownLineage',
          cellWidth: "48px",
          Cell: ({ row }) => (
            <DropdownLineage actions={getContextActions(row)}/>
          )
        },
      ],
      []
    )
    
    let getContextActions = (row)=>{
      switch(props.status){
        case 'proposed':
          return {
            consolidate: ()=>props.updateModalValues("Consolidate Changes", "This will consolidate lineage changes", "Continue", ()=>consolidateChanges(row.original, true), "Cancel", ()=>{}),
            reject: ()=>props.updateModalValues("Reject Changes", "This will reject lineage changes", "Continue", ()=>rejectChanges(row.original, true), "Cancel", ()=>{}),
          }
        case 'consolidated':
          return {
            backProposed: ()=>props.updateModalValues("Back to Proposed", "This will set the lineage changes back to Proposed", "Continue", ()=>setBackToProposed(row.original, true), "Cancel", ()=>{}),
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
      return dl.fetch(url)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length!==0) {
            data.Data = testData;
          }
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
        let url = ConfigData.LINEAGE_GET_CHANGES;
        url += 'country=' + props.country;
        url += '&status=' + props.status;
        url += '&page=' + (currentPage+1);
        url += '&limit=' + currentSize;
        url += '&creation=' + props.typeFilter.includes("creation");
        url += '&deletion=' + props.typeFilter.includes("deletion");
        url += '&split=' + props.typeFilter.includes("split");
        url += '&merge=' + props.typeFilter.includes("merge");
        url += '&recode=' + props.typeFilter.includes("recode");
        promises.push(
          dl.fetch(url)
          .then(response => response.json())
          .then(data => {
            if(data?.Success) {
              if(Object.keys(data.Data).length===0)
                setChangesData("nodata");
              else {
                data.Data = testData;
                setChangesData(data.Data);
              }
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
        return (
        <>
          <Table 
            columns={columns} 
            data={changesData} 
            siteCodes={siteCodes} 
            currentPage={currentPage}
            currentSize={currentSize} 
            loadPage = {loadPage}
            status={props.status}
            isTabChanged={props.isTabChanged}
            setIsTabChanged={props.setIsTabChanged}
          />
          {props.showModal && showModal(props.showModal)}
          <ModalLineage
            visible = {modalVisible}
            close = {closeModal}
            consolidate={()=>consolidateChanges(modalItem)}
            reject={()=>rejectChanges(modalItem)}
            backToProposed={() => setBackToProposed(modalItem)}
            status={props.status}
            level={props.level}
            item={modalItem.SiteCode}
            version={modalItem.Version}
            updateModalValues = {props.updateModalValues}
            activeKey={modalItem.ActiveKey}
          />
        </>
        )
      }
  
  }

export default TableManagement
