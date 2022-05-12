import React from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded  } from 'react-table'

import SitechangesFile from '../../../data/siteChanges.json';

import ConfigData from '../../../config.json';

import {matchSorter} from 'match-sorter'

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
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      selectedFlatRows,
 
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
          {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
          
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </div>
      </>
    )
  }
  
  function TableRSPag() {
    const columns = React.useMemo(
      () => [
        {
            // Build our expander column
            id: 'expander', // Make sure it has an ID
            
            Cell: ({ row }) =>
              // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
              // to build the toggle for expanding a row
              row.canExpand ? (
                <span
                  {...row.getToggleRowExpandedProps({
                    style: {
                      // We can even use the row.depth property
                      // and paddingLeft to indicate the depth
                      // of the row
                      paddingLeft: `${row.depth * 2}rem`,
                    },
                  })}
                >
                  {row.isExpanded ? '➖' : '➕'}
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
          Header: 'Tags',
          accessor: 'Tags',  
        },
        {
          Header: 'Status',
          accessor: 'Status',
        },        
      ],
      []
    )

    function componentDidMount() {
      // Simple GET request using fetch      
      fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/get')
          .then(response => response.json())
          .then(data => this.setState({ totalReactPackages: data.total }));
    }
    
    const data = React.useMemo(Data => componentDidMount);
    //  const data = React.useMemo( Data => SitechangesFile);
  //  const data = React.useMemo(() => makeData(5,5), []);
    // const data = React.useMemo(
    //     () => [
    //       {
    //         sitecode: '25654',
    //         level: 'Medium',
    //         changeCategory: '' ,
    //         changeType: 'Sites added',
    //         country: 'Spain',
    //         tags: 'My tag',
    //         status: 'Icono',
    //         action: '...',
    //         subRows: [
    //             {
    //               sitecode: '',
    //               level: 'Critical',
    //               changeCategory: '' ,
    //               changeType: 'Sites added',
    //               country: 'Spain',
    //               tags: 'My tag',
    //               status: 'Icono',
    //               action: '...'
    //             },
    //             {
    //               sitecode: '',
    //               level: 'Medium',
    //               changeCategory: '' ,
    //               changeType: 'Sites added',
    //               country: 'Spain',
    //               tags: 'My tag',
    //               status: 'Icono',
    //               action: '...'
    //             },
    //             {
    //               sitecode: '',
    //               level: 'Warning',
    //               changeCategory: '' ,
    //               changeType: 'Sites added',
    //               country: 'Spain',
    //               tags: 'My tag',
    //               status: 'Icono',
    //               action: '...'
    //             }
    //           ]
    //       },          
    //       {
    //         sitecode: '13502',
    //         level: 'Medium',
    //         changeCategory: 'Site general info (UL)',
    //         changeType: 'Site priority',
    //         country: 'Spain',
    //         tags: 'My tag',
    //         status: 'Icono',
    //         action: '...'
    //       },
    //       {
    //         sitecode: '9788',
    //         level: 'Critical',
    //         changeCategory: 'Species and Habitats',
    //         changeType: 'Sites added',
    //         country: 'Spain',
    //         tags: 'My tag',
    //         status: 'Icono',
    //         action: '...'
    //       },
    //       {
    //         sitecode: '25654',
    //         level: 'Medium',
    //         changeCategory: '' ,
    //         changeType: 'Sites added',
    //         country: 'Spain',
    //         tags: 'My tag',
    //         status: 'Icono',
    //         action: '...'
    //       },
    //       {
    //         sitecode: '13502',
    //         level: 'Medium',
    //         changeCategory: 'Site general info (UL)',
    //         changeType: 'Site priority',
    //         country: 'Spain',
    //         tags: 'My tag',
    //         status: 'Icono',
    //         action: '...'
    //       },
    //       {
    //         sitecode: '9788',
    //         level: 'Critical',
    //         changeCategory: 'Species and Habitats',
    //         changeType: 'Sites added',
    //         country: 'Spain',
    //         tags: 'My tag',
    //         status: 'Icono',
    //         action: '...'
    //       },
    //     ],
    //     []
    // )

    const [loading, setLoading] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(0);
       

    return (
        <Table columns={columns} data={data.Data} loading={loading} />
    )
  }
  
  export default TableRSPag