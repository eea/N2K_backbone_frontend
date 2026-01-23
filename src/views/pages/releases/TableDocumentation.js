import React, { useState, useEffect } from 'react'
import { useTable, usePagination, useFilters, useGlobalFilter, useRowSelect, useSortBy, useExpanded } from 'react-table'
import { matchSorter } from 'match-sorter'
import ConfigData from '../../../config.json';
import {
	CButton,
	CTooltip,
	CPagination,
	CPaginationItem,
} from '@coreui/react'
import { DataLoader } from '../../../components/DataLoader';

function DefaultColumnFilter({
	column: { filterValue, preFilteredRows, setFilter },
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

fuzzyTextFilterFn.autoRemove = val => !val

function Table({ columns, data, setSelected, modalProps, currentPage, currentSize, updateModalValues }) {
	const [pgCount, setPgCount] = useState(Math.ceil(data.length / currentSize));

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
		state: { pageIndex, pageSize, selectedRowIds },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			filterTypes,
			initialState: { pageSize: currentSize, pageIndex: currentPage },
			pageCount: pgCount,
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		useExpanded,
		usePagination,
		useRowSelect,
		hooks => {
			hooks.visibleColumns.push(columns => [
				...columns,
				{
					Header: () => null,
					id: 'siteEdited',
					Cell: ({ row }) => {
						return (
							row.values.EditedDate && row.values.EditedBy ? (
								<CTooltip
									content={"Edited"
										+ (row.values.EditedDate && " on " + row.values.EditedDate.slice(0, 10).split('-').reverse().join('/'))
										+ (row.values.EditedBy && " by " + row.values.EditedBy)}>
									<div className="btn-icon btn-hover">
										<i className="fa-solid fa-pen-to-square"></i>
									</div>
								</CTooltip>
							) : null
						)
					},
				},
				{
					Header: () => null,
					id: 'addDocs',
					Cell: ({ row }) => {
						return (
							<CButton color="link" onClick={() => modalProps.openModal(row.original)}>
								Manage documentation
							</CButton>
						)
					},
					canFilter: false
				},
			])
		}
	)
	if (setSelected) setSelected(Object.keys(selectedRowIds).filter(v => !v.includes(".")).map(v => { return { country: data[v].Country, version: data[v].Version } }))

	// Render the UI for your table
	return (
		<>
			<table className="table" {...getTableProps()}>
				<thead>
					{headerGroups.map(headerGroup => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map(column => (
								<th key={column.id} style={{ width: column.cellWidth }}>
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
									return <td {...cell.getCellProps()} key={cell.column.id + "_" + cell.row.id}>{cell.render('Cell')}</td>
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
						{pageIndex + 1} of {pageCount}
					</strong>{' '}
					({data.length === 1 ? data.length + " result" : data.length + " results"})
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
							setPgCount(Math.ceil(data.length / Number(e.target.value)));
							setPageSize(Number(e.target.value));
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

function TableDocumentation(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [currentSize, setCurrentSize] = useState(30);
	
	let dl = new (DataLoader);

	const customFilter = (rows, columnIds, filterValue) => {
		let result = filterValue.length === 0 ? rows : rows.filter((row) => row.original.SiteCode.toLowerCase().includes(filterValue.toLowerCase()) || row.original.Name.toLowerCase().includes(filterValue.toLowerCase()))
		return result;
	}

	const columns = React.useMemo(
		() => [
			{
				Header: 'Country',
				accessor: 'Country',
				className: "cell-country",
				Cell: ({ row }) => {
					return row.values.Country
				},
				filter: customFilter,
			},
			{
				Header: 'Documents',
				accessor: 'NumDocuments',
			},
			{
				Header: 'Comments',
				accessor: 'NumComments',
			},
		],
		[]
	)

  	const loadData = () => {
		if(props.refresh){
			props.setRefresh(false);
		} 
		setIsLoading(true);
		return dl.fetch(ConfigData.RELEASES_ATTACHMENTS_COUNT)
			.then(response => response.json())
			.then(data => {
				if (data?.Success) {
					setIsLoading(false);
					props.setDocumentationData(data.Data);
					if (data.Data.length == 0) {
						setData("noData")
					} else {
						data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
						setData(data.Data);
						setCurrentPage(0);
						setCurrentSize(30);
					}
				} else throw "Error loading data"
		})
  	}

  	useEffect(() => {
		loadData().catch(props.showError)
	}, [props.refresh])

	if (isLoading)
		return (<div className="loading-container"><em>Loading...</em></div>)
	else
		if (data === "noData")
			return (<div className="nodata-container"><em>No Data</em></div>)
		else
			return (
				<>
					<Table
						columns={columns}
						data={data}
						modalProps={props}
						updateModalValues={props.updateModalValues}
						currentPage={currentPage}
						currentSize={currentSize}
					/>
				</>
			)
}

export default TableDocumentation
