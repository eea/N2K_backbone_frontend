import React, { useState, useEffect } from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {matchSorter} from 'match-sorter'
import ConfigData from '../../../config.json';
import {
  CPagination,
  CPaginationItem,
  CTooltip,
  CButton,
} from '@coreui/react'
import { ModalLineage } from './ModalLineage';
import {DataLoader} from '../../../components/DataLoader';

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

  function Table({ columns, data, currentPage, currentSize, loadPage, status, updateModalValues, isTabChanged, setIsTabChanged }) {

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
    const [isLoaded, setIsLoaded] = useState(false);
    const [changesData, setChangesData] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    // TODO solve pagination issues
    const [currentSize, setCurrentSize] = useState(0);
    const [country, setCountry] = useState("");

    let dl = new(DataLoader);

    useEffect(() => {loadData()}, [country, props.typeFilter, props.getRefresh()])

    let getSite = () => {
      if(changesData.length > 0) {
        const site = changesData.filter(v => v.SiteCode === props.site)[0];
        if(site) {
          props.setSite("");
          return site;
        }
      }
      return {};
    }

    let forceRefreshData = ()=> {
      setIsLoaded(false);
      setChangesData({});
    };

    let loadPage = (page,size) =>{
      setCurrentPage(page);
      setCurrentSize(size);
      forceRefreshData();
    }

    let showModal = (data) => {
      if (Object.keys(modalItem).length === 0)
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
    
    let getRowData = (data) => {
      return {
        ChangeId: data.ChangeId,
        Predecessors: data.Reference,
        Type: data.Type
      }
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
            else if(!row.original.Reference || row.original.Reference === "-"){
              tags = "-";
            }
            else {
              tags =
                <span className={"badge badge--lineage basic"}>
                  {row.values.Reference}
                </span>
            }
            return <span className="lineage-cell">{tags}</span>;
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
                tags.push(<span className={"badge badge--lineage "+row.original.Type.toLowerCase()} key={"rep_"+i}>{values[i]}</span>);
              }
            }
            else if(!row.original.Reported || row.original.Reported === "-"){
              tags = "-";
            }
            else {
              tags =
                <span className={"badge badge--lineage basic"}>
                  {row.values.Reported}
                </span>
            }
            return <span className="lineage-cell">{tags}</span>;
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
      ],
      []
    )
    
    let loadData= ()=>{
      let passData = (data) => {
        props.setSitecodes({
          name: props.status,
          data: data ? data.map(x => (
            {"search":x.SiteCode+" - "+x.SiteName,
              "Name":x.SiteName,"SiteCode":x.SiteCode,
              "status":props.status,"Type":x.Type,...x}))
            : [],
          searchType: "contains"
        });
      }
      if(props.getRefresh()||(!isLoaded && changesData!=="nodata" && Object.keys(changesData).length===0)){
        let promises=[];
        
        if(props.getRefresh()||(country === {})||(country !== props.country)){
          props.setRefresh(props.status,false);  //For the referred status, data is updated
          setCountry(props.country);
          forceRefreshData();
        }
        let url = ConfigData.LINEAGE_GET_CHANGES;
        url += '?country=' + props.country;
        url += '&status=' + props.status;
        url += '&page=' + (currentPage+1);
        url += '&pageLimit=' + 0;
        url += '&creation=' + props.typeFilter.includes("Creation");
        url += '&deletion=' + props.typeFilter.includes("Deletion");
        url += '&split=' + props.typeFilter.includes("Split");
        url += '&merge=' + props.typeFilter.includes("Merge");
        url += '&recode=' + props.typeFilter.includes("Recode");
        promises.push(
          dl.fetch(url)
          .then(response => response.json())
          .then(data => {
            if(data?.Success) {
              if(Object.keys(data.Data).length===0) {
                setChangesData("nodata");
                setCurrentSize(0);
              } else {
                setChangesData(data.Data);
                setCurrentSize(data.Data.length);
                return data.Data;
              }
            }
          })
          .then(data => passData(data))
        )
        Promise.all(promises).then(v=>{setIsLoaded(true); props.setSitecodes(props.status, changesData == "nodata" ? {} : changesData)});
      }
    }
    
    if(!props.country) {
      if(changesData !== "nodata") {
        setChangesData("nodata");
        setIsLoaded(false);
      }
    }

    if(!isLoaded)
      return (<div className="loading-container"><em>Loading...</em></div>)
    else
      if(changesData==="nodata")
        return (<div className="nodata-container"><em>No Data</em></div>)
      else{
        if(Array.isArray(changesData)) {
          const data = getSite();
          if(data.SiteCode)
            showModal(data);
        }
        return (
        <>
          <Table 
            columns={columns} 
            data={changesData} 
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
            status={props.status}
            item={modalItem.ChangeId}
            code={modalItem.SiteCode}
            name={modalItem.SiteName}
            type={modalItem.Type}
            reference={modalItem.Reference}
            reported={modalItem.reported}
            country={props.country}
            errorMessage={props.errorMessage}
            updateModalValues = {props.updateModalValues}
            activeKey={modalItem.ActiveKey}
          />
        </>
        )
      }
  
  }

export default TableManagement
