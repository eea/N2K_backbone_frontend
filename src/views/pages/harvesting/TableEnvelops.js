import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded  } from 'react-table'
import PostEnvelops from './PostEnvelops';
import DropdownHarvesting from './components/DropdownHarvesting';

import {matchSorter} from 'match-sorter'

import ConfigData from '../../../config.json';

import { FetchData } from '../sitechanges/FetchData'
import { isFunction } from 'eslint-plugin-react/lib/util/ast';
import { is } from 'core-js/core/object';

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
  
  function TableEnvelops() {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [envelopsData, setEnvelopsData] = useState({});    

    useEffect(() => {
      fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Pending')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      });
    }, [])

    const columns = React.useMemo(
      () => [        
        {
          Header: 'Envelope Id',
          accessor: 'envelopeId',
        },
        {
          Header: 'Country',
          accessor: 'country',
        },
        {
          Header: 'Submission date',
          accessor: 'submissionDate',
        },                
        {
        Header: () => null, 
        id: 'dropdownEnvelops',
        Cell: ({ row }) => (
          <DropdownHarvesting />  
          )
        },
      ],
      []
    ) 
  
    // const data = React.useMemo(
    //     () => [
    //       {
    //         key: 1,
    //         envelopeId: '25654',
    //         country: 'Spain',
    //         submissionDate: '02/07/2021',
            
    //       },
    //       {
    //         key: 2,
    //         envelopeId: '25655',
    //         country: 'Spain',
    //         submissionDate: '02/07/2021',
            
    //       },
    //       {
    //         key: 3,
    //         envelopeId: '25656',
    //         country: 'Spain',
    //         submissionDate: '02/07/2021',
            
    //       },
    //       {
    //         key: 4,
    //         envelopeId: '25657',
    //         country: 'Spain',
    //         submissionDate: '02/07/2021',
            
    //       },
    //       {
    //         key: 5,
    //         envelopeId: '25658',
    //         country: 'Spain',
    //         submissionDate: '02/07/2021',
            
    //       },
    //       {
    //         key: 6,
    //         envelopeId: '25659',
    //         country: 'Spain',
    //         submissionDate: '02/07/2021',
            
    //       },
    //     ],
    //     []
    // )

    let load_data= ()=>{
    console.log("pasa por aquí 1"+isLoading) ;
      if(!isLoading && Object.keys(envelopsData).length===0){
        console.log("pasa por aquí 2"+isLoading) ;
        
        setIsLoading(true);
        fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Pending')
        .then(response => response.json())
        .then(data => {
          console.log("pasa por aquí 3"+isLoading) ;
          console.log("pasa por aquí 3 "+data.length);
          console.log(data);
          setEnvelopsData(data.Data);
          if(Object.keys(envelopsData).length === 0){
            setIsLoading(false);
          }
          else {
            setIsLoading('nodata');
          }
          
        });
        console.log("pasa por aquí 4"+isLoading) ;
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
          <Table columns={columns} data={envelopsData} />            
        </>
        )
    }
      
    // return (
    //   <Table columns={columns} data={data} />
    // )
  }
  
  export default TableEnvelops