import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import React, { Component } from 'react';
import Select from 'react-select';
import {
  CButton,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CSidebarNav,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCloseButton,
  CTabContent,
  CTabPane,
  CTooltip,
  CCollapse,
  CCard,
  CAlert,
  CForm,
  CFormInput,
  CSpinner,
} from '@coreui/react'

import { DataLoader } from '../../../components/DataLoader';
export class ModalFilters extends Component {
  constructor(props) {
    super(props);
    this.dl = new (DataLoader);

    this.state = {
      filters: props.filters ? [...props.filters] : [],
      modalValues: {
        visibility: false,
        close: () => {
          this.setState({
            modalValues: {
              visibility: false
            }
          });
        }
      },
      siteTypeValue: "",
      siteRegionValue: "",
      showCopyTooltip: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.setState({
        filters: [...this.props.filters]
      });
    }
  }

  handleCheckboxChange = (event) => {
    const { name, value, checked, type } = event.target;

    this.setState((prevState) => {
      let newFilters = [...prevState.filters];

      if (checked) {
        newFilters.push(name);
      } else {
        newFilters = newFilters.filter(f => f !== name);
      }
      return { filters: newFilters };
    });
  };

  close() {
    this.props.closeModal(false);
  }

  isVisible() {
    return this.props.visible;
  }

  clearFilters() {
    this.setState({ filters: [] }, () => {
      this.props.setFilters([]);
      this.close();
    });
  }

  applyFilters() {
    this.props.setFilters(this.state.filters);
    this.close();
  }

  render() {
    return (
      <CModal className="modal-filters" scrollable size="xl" visible={this.isVisible()} onClose={() => this.close()}>
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Filters
          </CModalTitle>
          <CCloseButton onClick={() => this.close()} />
        </CModalHeader>
        <CModalBody>
          <div className="filters-group">
            <div className="filters-title">Change Type</div>
            {UtilsData.FILTERS.ChangeType.map(filter => (
              <div className="filter-item" key={filter.name}>
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id={"filter_check_" + filter.name} name={filter.name} checked={this.state.filters.includes(filter.name)} onChange={this.handleCheckboxChange}/>
                  <label htmlFor={"filter_check_" + filter.name} className="input-label">{filter.label}</label>
                </div>
              </div>
            ))}
          </div>
          <div className="filters-group">
            <div className="filters-title">Site Type</div>
            {UtilsData.FILTERS.SiteType.map(filter => (
              <div className="filter-item" key={filter.name}>
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id={"filter_check_" + filter.name} name={filter.name} checked={this.state.filters.includes(filter.name)} onChange={this.handleCheckboxChange}/>
                  <label htmlFor={"filter_check_" + filter.name} className="input-label">{filter.label}</label>
                </div>
              </div>
            ))}
          </div>
          <div className="filters-group">
            {UtilsData.FILTERS.General.map(filter => (
              <div className="filter-item" key={filter.name}>
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id={"filter_check_" + filter.name} name={filter.name} checked={this.state.filters.includes(filter.name)} onChange={this.handleCheckboxChange}/>
                  <label htmlFor={"filter_check_" + filter.name} className="input-label">{filter.label}</label>
                </div>
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter className="d-flex w-100 justify-content-between">
          <CButton color="secondary" onClick={() => this.clearFilters()}>Clear</CButton>
          <CButton color="primary" onClick={() => this.applyFilters()}>Apply</CButton>
        </CModalFooter>
      </CModal>
    )
  }
}
