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
  // function GlobalFilter({
  //   preGlobalFilteredRows,
  //   globalFilter,
  //   setGlobalFilter,
  // }) {
  //   const count = preGlobalFilteredRows.length
  //   const [value, setValue] = React.useState(globalFilter)
  //   const onChange = useAsyncDebounce(value => {
  //     setGlobalFilter(value || undefined)
  //   }, 200)
  
  //   return (
  //     <span>
  //       Search:{' '}
  //       <input
  //         value={value || ""}
  //         onChange={e => {
  //           setValue(e.target.value);
  //           onChange(e.target.value);
  //         }}
  //         placeholder={`${count} records...`}
  //         style={{
  //           fontSize: '1.1rem',
  //           border: '0',
  //         }}
  //       />
  //     </span>
  //   )
  // }
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
        <table {...getTableProps()}>
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
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <span>{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '25px' }}
            />
          </span>{' '}
          <button onClick={() => gotoPage(pageIndex+1)} disabled={!canNextPage}>
            {pageIndex+1}
          </button>{' '}
          <button onClick={() => previousPage() -1 } disabled={!canNextPage}>
            {pageIndex-2}
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
                  {row.isExpanded ? '👇' : '👉'}
                </span>
              ) : null,
          },
        {
            Header: ' ',
            columns: [
                {
                    Header: 'Sitecode',
                    accessor: 'sitecode',
                },
                {
                    Header: 'Level',
                    accessor: 'level',
                },
                {
                    Header: 'Change Category',
                    accessor: 'changeCategory',
                },
                {
                    Header: 'Change Type',
                    accessor: 'changeType',
                },
                {
                    Header: 'Country',
                    accessor: 'country',
                },
                {
                    Header: 'Tags',
                    accessor: 'tags',  
                },
                {
                    Header: 'Status',
                    accessor: 'status',
                },
            ],
        },
      ],
      []
    )
  
  //  const data = React.useMemo(() => makeData(5,5), []);
    const data = React.useMemo(
        () => [
          {
            sitecode: '25654',
            level: 'Medium',
            changeCategory: '' ,
            changeType: 'Sites added',
            country: 'Spain',
            tags: 'My tag',
            status: 'Icono',
            action: '...'
          },
          {
            sitecode: '13502',
            level: 'Medium',
            changeCategory: 'Site general info (UL)',
            changeType: 'Site priority',
            country: 'Spain',
            tags: 'My tag',
            status: 'Icono',
            action: '...'
          },
          {
            sitecode: '9788',
            level: 'Critical',
            changeCategory: 'Species and Habitats',
            changeType: 'Sites added',
            country: 'Spain',
            tags: 'My tag',
            status: 'Icono',
            action: '...'
          },
          {
            sitecode: '25654',
            level: 'Medium',
            changeCategory: '' ,
            changeType: 'Sites added',
            country: 'Spain',
            tags: 'My tag',
            status: 'Icono',
            action: '...'
          },
          {
            sitecode: '13502',
            level: 'Medium',
            changeCategory: 'Site general info (UL)',
            changeType: 'Site priority',
            country: 'Spain',
            tags: 'My tag',
            status: 'Icono',
            action: '...'
          },
          {
            sitecode: '9788',
            level: 'Critical',
            changeCategory: 'Species and Habitats',
            changeType: 'Sites added',
            country: 'Spain',
            tags: 'My tag',
            status: 'Icono',
            action: '...'
          },
        ],
        []
    )
  
    return (
        <Table columns={columns} data={data} />
    )
  }
  
  export default TableRSPag