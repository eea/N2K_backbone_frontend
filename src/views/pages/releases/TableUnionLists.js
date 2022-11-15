import React, {useState, useEffect} from 'react'
import { useTable, usePagination, useFilters,useGlobalFilter, useRowSelect, useAsyncDebounce, useSortBy, useExpanded } from 'react-table'
import {matchSorter} from 'match-sorter'
import ConfigData from '../../../config.json';

  function DefaultColumnFilter({
    column: { filterValue, setFilter },
  }) {
  
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

  function getRowColor(change) {
    if(change === "ADDED")
      return ConfigData.Colors.Green;
    else if(change === "DELETED")
      return ConfigData.Colors.Red;
    else
      return;
  }

  function getCellColor(cell) {
    if(cell.row.original.Changes !== "ADDED" && cell.row.original.Changes !== "DELETED" && cell.value?.Change !== undefined && cell.value?.Change !== null) {
      let value = cell.value.Change;
      if(value === "AREA_INCREASED" || value === "LENGTH_INCREASED") {
        return ConfigData.Colors.Green;
      }
      else if(value === "AREA_DECREASED" || value === "LENGTH_DECREASED") {
        return ConfigData.Colors.Red;
      }
      else if(value.includes("SITENAME") || value.includes("PRIORITY") || value.includes("AREA") || value.includes("LENGTH") || value.includes("LATITUDE") || value.includes("LONGITUDE")) {
        return ConfigData.Colors.Red;
      }
    }
  }
  
  fuzzyTextFilterFn.autoRemove = val => !val

  function Table({ columns, data, size, colors }) {
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
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
        initialState: {pageSize: size},
        manualPagination:true,
        colors
        
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      useExpanded,
      usePagination,
      useRowSelect,
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
                    {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} style={{backgroundColor: colors && getRowColor(row.original.Changes)}}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()} style={{backgroundColor: getCellColor(cell)}} key={cell.column.id + "_" + cell.row.id}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }
  
  function TableUnionLists(props) {
    const columns = React.useMemo(
      () => [
        {
          Header: 'Biogeographical Region',
          accessor: 'BioRegion',
        },
        {
          Header: 'Site Code',
          accessor: 'Sitecode',
        },
        {
          Header: 'Site Name',
          accessor: 'SiteName',
          Cell: ({ row, cell }) => {
            return cell.value?.Target === undefined ? cell.value : cell.value?.Target;
          }
        },
        {
          Header: 'Priority',
          accessor: 'Priority',
          Cell: ({ row, cell }) => {
            return cell.value?.Target === undefined ? cell.value : cell.value?.Target;
          }
        },
        {
          Header: 'Area',
          accessor: 'Area',
          Cell: ({ row, cell }) => {
            return cell.value?.Target === undefined ? cell.value : cell.value?.Target;
          }
        },
        {
          Header: 'Length',
          accessor: 'Length',
          Cell: ({ row, cell }) => {
            return cell.value?.Target === undefined ? cell.value : cell.value?.Target;
          }
        },
        {
          Header: 'Latitude',
          accessor: 'Latitude',
          Cell: ({ row, cell }) => {
            return cell.value?.Target === undefined ? cell.value : cell.value?.Target;
          }
        },
        {
          Header: 'Longitude',
          accessor: 'Longitude',
          Cell: ({ row, cell }) => {
            return cell.value?.Target === undefined ? cell.value : cell.value?.Target;
          }
        },
      ],
      []
    )
    if(props.data==="nodata")
      return (<div className="nodata-container"><em>No Data</em></div>)
    else
      return (
        <>
          <Table
            columns={columns}
            data={props.data}
            pageSize={props.data.length}
            colors={props.colors}
          />
        </>
      )
  }

export default TableUnionLists