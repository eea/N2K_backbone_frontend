import ConfigData from '../../../config.json';
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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCloseButton,
  CTabContent,
  CTabPane,
  CAlert,
  CForm,
  CFormInput,
  CFormSelect,
  CSpinner,
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import MapViewer from './components/MapViewer'

import { DataLoader } from '../../../components/DataLoader';
export class ModalLineage extends Component {
  constructor(props) {
    super(props);
    this.dl = new (DataLoader);

    this.isLoadingData = false;
    this.isLoadingPredecessorData = false;
    this.isLoadingReferenceData = false;

    this.changingStatus = false;

    this.versionChanged = false;
    this.currentVersion = props.version;
    
    this.typeList = ["Creation","Deletion","Split","Merge","Recode"];

    this.state = {
      activeKey: 1,
      loading: true,
      data: {},
      type: this.props.type,
      status: this.props.status,
      predecessorData: {},
      predecessors: this.props.reference,
      newPredecessor: false,
      referenceSites: [],
      updateOnClose: false,
      errorLoading: false,
      generalError: "",
      updatingData: false,
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

  componentDidMount() {
    window.addEventListener('beforeunload', (e) => this.handleLeavePage(e));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', (e) => this.handleLeavePage(e));
  }

  handleLeavePage(e) {
    if (this.isVisible() && this.checkUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  setActiveKey(val) {
    this.setState({ activeKey: val })
  }

  close() {
    this.setActiveKey(1);
    this.setState({
      data: {},
      type: "",
      predecessorData: {},
      predecessors: [],
      newPredecessor: false,
      loading: true,
    });
    this.resetLoading();
    this.props.close();
  }

  isVisible() {
    return this.props.visible;
  }

  toggleDetail(key) {
    if (this.state.showDetail === key) {
      this.setState({ showDetail: "" });
    } else {
      this.setState({ showDetail: key });
    }
  }

  renderValuesTable(changes) {
    if(!Array.isArray(changes))
      changes = [changes]
    if(changes.length === 0)
      return;
    let heads = Object.keys(changes[0]);
    let titles = heads.map(k => { return (<CTableHeaderCell scope="col" key={k}> {k} </CTableHeaderCell>) });
    let rows = []; 
    for(let i in changes)
      rows.push(
        <CTableRow key={"row_info"}>
          {Object.entries(changes[i]).map(([k,v]) => {
            if(k == "SiteType")
              return (<CTableDataCell key={k + "_" + v}> {["SPA","SCI","SPA/SCI"][['A','B','C'].indexOf(v)]} </CTableDataCell>) 
            else
              return (<CTableDataCell key={k + "_" + v}> {v} </CTableDataCell>) 
            })
          }
        </CTableRow>
      )
    return (
      <CTable>
        <CTableHead>
          <CTableRow>
            {titles}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rows}
        </CTableBody>
      </CTable>
    )
  }
  
  addPredecessor() {
    const getNewSite = () => {
      return document.querySelector(".add-predecessor").value;
    }
    if(this.state.referenceSites.length !== this.state.predecessors?.split(',').length)
      return (
        <div>
          <CCol>
            <CFormSelect className={"add-predecessor"}>
              {this.state.referenceSites?.filter(r => !this.state.predecessors?.split(',').includes(r)).map(s => <option value={s}>{s}</option>)}
            </CFormSelect>
          </CCol>
          <CCol>
            <CButton color="link" className="btn-icon"
              onClick={() => this.setState({ predecessors: this.state.predecessors + ',' + getNewSite(), newPredecessor: false })}>
              <i className="fa-solid fa-floppy-disk"></i>
            </CButton>
            <CButton color="link" className="btn-icon"
              onClick={() => this.setState({ newPredecessor: false })}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </CCol>
        </div>
      );
    else
      return (
        <div>
          <em>No data</em>
        </div>
      )
  }
  
  setSelectedPredecessors(options) {
    this.setState(() => ({ predecessors: Object.values(options).map(s => s.value).join(',') }));
  }
  
  predecessorList() {
    let predecessors = this.state.predecessors?.split(',');
    return predecessors?.map((s) => 
      <div key={s}>
        <CCol>
          <CFormSelect className="option-select" defaultValue={s} disabled={this.state.status === "Consolidated"}
            onChange={() => this.setSelectedPredecessors(document.querySelectorAll(".option-select"))}>
            <option className="predecessor-option color--primary" value={s}>{s}</option>
            {this.state.referenceSites?.filter(r => !this.state.predecessors?.split(',').includes(r)).map(t => <option className="predecessor-option" value={t}>{t}</option>)}
          </CFormSelect>
        </CCol>
        <CCol
          hidden={this.state.type === "Creation" && predecessors?.length <= 1
            || this.state.type === "Merge" && predecessors?.length <= 2
            || this.state.type === "Split" && predecessors?.length <= 1
            || this.state.type === "Recode"
            || this.state.type === "Deletion"
          }>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteSite(s)}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </CCol>
      </div>
    );
  }
  
  deleteSite(e) {
    let newList = this.state.predecessors?.split(',').filter(s => s !== e).join();
    this.setState({ predecessors: newList })
  }
  
  lineageEditor() {
    return(
      <>
      <CRow className="p-3">
        <CCol key={"changes_editor_label_sitecode"} className="mb-4">
          <b>SiteCode</b>
        </CCol>
        <CCol key={"changes_editor_label_type"} className="mb-4">
          <b>Type</b>
        </CCol>
        <CCol key={"changes_editor_label_predecessor"} className="mb-4">
          <b>Predecessor</b>
        </CCol>
      </CRow>

      <CRow>
        <CCol key={"changes_editor_label_sitecode"}>
          <CFormInput type="text" disabled={this.state.type !== "Recode" || this.state.status === "Consolidated"} value={this.state.data.SiteCode} />
        </CCol>
        <CCol key={"changes_editor_label_type"}>
          <CFormSelect defaultValue={this.typeList.indexOf(this.state.type)} disabled={this.state.status === "Consolidated"}
            onChange={(e) => this.setState({ type: this.typeList[Number(e.target.value)] })} >
            <option value="0">Creation</option>
            <option value="1">Deletion</option>
            <option value="2">Split</option>
            <option value="3">Merge</option>
            <option value="4">Recode</option>
          </CFormSelect>
        </CCol>
        <CCol key={"changes_editor_label_predecessor"}>
          {this.predecessorList()}
          {this.state.newPredecessor &&
              this.addPredecessor()
          }
          <CButton color="link" className="ms-auto" 
            hidden={this.state.type === "Deletion"
              || this.state.type === "Creation"
              || this.state.status === "Consolidated"}
            onClick={() => this.setState({ newPredecessor: true })}>
            Add site
          </CButton>
        </CCol>
      </CRow>
      </>
    )
  }

  renderChanges() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        {this.lineageEditor()}
        {this.state.type !== "Deletion" &&
          <CRow className="p-3">
            <CCol key={"changes_tabular"} className="mb-4">
              <b>Tabular Changes</b>
              {this.renderValuesTable(this.state.data)}
            </CCol>
          </CRow>
        }
        {this.state.type !== "Creation" && this.state.predecessorData.length >= 1 &&
          <CRow className="p-3">
            <CCol key={"changes_predecessors"} className="mb-4">
              <b>Predecessors</b>
              {this.renderValuesTable(this.state.predecessorData)}
            </CCol>
          </CRow>
        }
        {this.state.predecessorData.length == 0 &&
          <CRow className="p-3">
            <CCol className="mb-4">
              <em>No predecessor data</em>
            </CCol>
          </CRow>
        }
      </CTabPane>
    )
  }

  renderGeometry() {
    return (
      this.state.errorLoading ?
        <>
          <div className="loading-container">
            <CAlert color="danger">Error loading data</CAlert>
          </div>
        </>
        :
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
          {this.state.errorLoading &&
            <CAlert color="danger">Error loading data</CAlert>
          }
          {/* {!this.state.errorLoading &&
            <CRow >
              <MapViewer siteCode={this.props.item} version={this.props.version} />
            </CRow>
          } */}
        </CTabPane>
    )
  }

  getBody() {
    let data = 
      {
        "ChangeId": this.props.item,
        "Type": this.state.type,
        "Predecessors": this.state.predecessors
      }

    return data;
  }

  renderModal() {
    let data = this.state.data;
    return (
      this.state.errorLoading ?
        <>
          <CModalHeader closeButton={false}>
            <CCloseButton onClick={() => this.closeModal()} />
          </CModalHeader>
          <CModalBody>
            <div className="loading-container">
              <CAlert color="danger">Error loading site data</CAlert>
            </div>
          </CModalBody>
        </>
        :
        <>
          <CModalHeader closeButton={false}>
            <CModalTitle>
              {data.SiteCode} - {data.SiteName}
              <span className="mx-2"></span>
              <span className="badge badge--fill default">Release date: 20/12/2021</span>
            </CModalTitle>
            <CCloseButton onClick={() => this.closeModal()} />
          </CModalHeader>
          <CModalBody>
            {this.props.errorMessage?.length !== 0 &&
              <CAlert color="danger">{this.props.errorMessage}</CAlert>
            }
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={this.state.activeKey === 1}
                  onClick={() => this.setActiveKey(1)}
                >
                  Lineage Changes
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={this.state.activeKey === 2}
                  onClick={() => this.setActiveKey(2)}
                >
                  Spatial Changes
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              {this.renderChanges()}
              {this.renderGeometry()}
            </CTabContent>
          </CModalBody>
          <CModalFooter>
            <div className="d-flex w-100 justify-content-between">
              {this.state.status === 'Proposed' && <CButton disabled={this.changingStatus} color="primary" onClick={() => this.consolidateChangesModal()}>Consolidate Changes</CButton>}
              {this.state.status === 'Consolidated' && <CButton disabled={this.changingStatus} color="primary" onClick={() => this.backToProposedModal()}>Back to Proposed</CButton>}
            </div>
          </CModalFooter>
        </>
    )
  }

  renderData() {
    if (!this.isLoadingData) {
      this.loadData();
    }
    if (!this.isLoadingPredecessorData) {
      this.loadPredecessorData();
    }
    if (!this.isLoadingReferenceData) {
      this.loadReferenceData();
    }

    let contents = this.state.loading ?
      <div className="loading-container"><em>Loading...</em></div>
      : this.renderModal();

    return (
      <>
        {contents}
      </>
    )
  }

  closeModal() {
    this.close();
  }

  render() {
    return (
      <>
        <CModal scrollable size="xl" visible={this.isVisible()} backdrop="static" onClose={() => this.closeModal()}>
          {this.renderData()}
        </CModal>
        <ConfirmationModal modalValues={this.state.modalValues} />
      </>
    )
  }

  loadData() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isLoadingData = true;
      this.dl.fetch(ConfigData.LINEAGE_GET_CHANGES_DETAIL + "?ChangeId=" + this.props.item)
      .then(response => {
          if (response.status === 200)
            return response.json();
          else
            return this.setState({ errorLoading: true, loading: false });
      })
      .then(data => {
        if (!data.Success)
          this.setState({ errorLoading: true, loading: false });
        else
          this.setState({ data: data.Data, status: data.Data.Status, type: this.props.type, loading: false, activeKey: this.props.activeKey ? this.props.activeKey : this.state.activeKey })
      });
    }
  }
  
  loadPredecessorData() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isLoadingPredecessorData = true;
      this.dl.fetch(ConfigData.LINEAGE_GET_PREDECESSORS + "?ChangeId=" + this.props.item)
      .then(response => {
          if (response.status === 200)
            return response.json();
          else
            return this.setState({ errorLoading: true, loading: false });
      })
      .then(data => {
        if (!data.Success)
          this.errorLoadingPredecessor = true;
        else
          this.setState({ predecessors: data.Data.map(s => s.SiteCode).join(','), predecessorData: data.Data })
      });
    }
  }
  
  loadReferenceData() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isLoadingReferenceData = true;
      this.dl.fetch(ConfigData.LINEAGE_GET_REFERENCE_SITES+ "?country=" + this.props.country)
      .then(response => {
          if (response.status === 200)
            return response.json();
          else
            return this.setState({ errorLoading: true, loading: false });
      })
      .then(data => {
        if (!data.Success)
          this.errorLoadingReference = true;
        else
          this.setState({ referenceSites: data.Data })
      });
    }
  }

  resetLoading() {
    this.isLoadingData = false;
    this.isLoadingPredecessorData = false;
    this.isLoadingReferenceData = false;
  }

  consolidateChangesModal() {
    this.changingStatus = true;
    this.props.updateModalValues("Consolidate Changes", "This will consolidate all the site changes",
      "Continue", () => this.consolidateChanges(),
      "Cancel", () => { this.changingStatus = false })
    .then(this.resetLoading());
  }

  consolidateChanges() {
    this.props.consolidate(this.getBody(), true)
      .then((data) => {
        if (data?.Success) {
          this.changingStatus = false;
          this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
        }
      });
  }

  backToProposedModal() {
    this.changingStatus = true;
    this.props.updateModalValues("Back to Proposed", "This will set the changes back to Proposed",
      "Continue", () => this.setBackToProposed(),
      "Cancel", () => { this.changingStatus = false })
    .then(this.resetLoading());
  }

  setBackToProposed() {
      this.props.backToProposed()
      .then((data) => {
        if (data?.Success) {
          this.changingStatus = false;
          this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
        }
      });
  }

  sendRequest(url, method, body, path) {
    const options = {
      method: method,
      headers: {
        'Content-Type': path ? 'multipart/form-data' : 'application/json',
      },
      body: path ? body : JSON.stringify(body),
    };
    return this.dl.fetch(url, options)
  }
}
