import React from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded  } from 'react-table'

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
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => gotoPage(pageIndex+1)} disabled={!canNextPage}>
            {pageIndex+1}
          </button>{' '}
          <button onClick={() => previousPage() -1 } disabled={!canNextPage}>
            {pageIndex+2}
          </button>{' '}
          <button onClick={() => nextPage()-1} disabled={!canNextPage}>
            {pageIndex+3}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}          
        </div>
      </>
    )
  }
  
  function TableEnvelops() {
    const columns = React.useMemo(
      () => [
        {
          id: 'expander', // Make sure it has an ID
        },
        {
            Header: ' ',
            columns: [
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
                    Header: ' ',
                    accessor: 'action',
                },
            ],
        },
      ],
      []
    ) 
  
    const data = React.useMemo(
        () => [
          {
            key: 1,
            envelopeId: '25654',
            country: 'Spain',
            submissionDate: '02/07/2021',
            action: '...'
          },
          {
            key: 2,
            envelopeId: '25655',
            country: 'Spain',
            submissionDate: '02/07/2021',
            action: '...'
          },
          {
            key: 3,
            envelopeId: '25656',
            country: 'Spain',
            submissionDate: '02/07/2021',
            action: '...'
          },
          {
            key: 4,
            envelopeId: '25657',
            country: 'Spain',
            submissionDate: '02/07/2021',
            action: '...'
          },
          {
            key: 5,
            envelopeId: '25658',
            country: 'Spain',
            submissionDate: '02/07/2021',
            action: '...'
          },
          {
            key: 6,
            envelopeId: '25659',
            country: 'Spain',
            submissionDate: '02/07/2021',
            action: '...'
          },
        ],
        []
    )

  
    return (
        <Table columns={columns} data={data} />
    )
  }
  
  export default TableEnvelops