import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded  } from 'react-table'
import PostEnvelops from './PostEnvelops';
import DropdownHarvesting from './components/DropdownHarvesting';

import {matchSorter} from 'match-sorter'

import ConfigData from '../../../config.json';

import { FetchData } from '../sitechanges/FetchData'
import { CPagination, CPaginationItem, CAlert } from '@coreui/react'
import { isFunction } from 'eslint-plugin-react/lib/util/ast';
//import { is } from 'core-js/core/object';
import { ConfirmationModal } from './components/ConfirmationModal';

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
      pageSize,
      gotoPage,
      nextPage,
      previousPage, 
      state: { pageIndex},
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
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
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
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} key={cell.key} >{cell.render('Cell')}</td>
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
  
  function TableEnvelops() {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [envelopsData, setEnvelopsData] = useState({});    
    const [alertVisible, setAlertVisible] = useState(false);

    useEffect(() => {
      fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Pending')
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
          accessor: 'Id',
        },
        {
          Header: 'Country',
          accessor: 'Country',
        },
        {
          Header: 'Submission date',
          accessor: 'SubmissionDate',
          Cell: ({ cell }) => (
            formatDate(cell.value)
          )
        },
        {
        Header: () => null, 
        id: 'dropdownEnvelops',
        Cell: ({ row }) => (
          <DropdownHarvesting versionId={row.values.Id} countryCode={row.values.Country} modalProps={modalProps}/>
          )
        },
      ],
      []
    )

    let modalProps = {
      showAlert() {
        setAlertVisible(true);
      },
      showModal(accept, reject) {
        updateModalValues("Harvest Envelops","This will harvest this envelop?","Continue", accept, "Cancel", reject);//()=>setVisible(true)
      }
    }

    const [modalValues, setModalValues] = useState({
      visibility: false,
      close: () => {
        setModalValues((prevState) => ({
          ...prevState,
          visibility: false
        }));
      }
    });

    function updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction) {
      setModalValues({
        visibility: true,
        title: title,
        text: text,
        primaryButton: (
          primaryButtonText && primaryButtonFunction ? {
            text: primaryButtonText,
            function: () => primaryButtonFunction(),
          }
          : ''
        ),
        secondaryButton: (
          secondaryButtonText && secondaryButtonFunction ? {
            text: secondaryButtonText,
            function: () => secondaryButtonFunction(),
          }
          : ''
        ),
      });
    }

    let load_data= ()=>{
      if(!isLoading && Object.keys(envelopsData).length===0){
        setIsLoading(true);
        fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Pending')
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

    load_data();

    if(isLoading){
      return (<p><em>Loading...</em></p>)
    }      
    else if (isLoading === 'nodata'){
      return (<p><em>No data</em></p>)
    }
    else {
      return (
        <>
          <Table columns={columns} data={envelopsData}/>
          <ConfirmationModal modalValues={modalValues}/>
          <CAlert color="primary" dismissible visible={alertVisible} onClose={() => setAlertVisible(false)}>Envelope successfully harvested</CAlert>
        </>
      )
    }
  }

  export default TableEnvelops