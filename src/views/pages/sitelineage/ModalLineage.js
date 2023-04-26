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

    this.changingStatus = false;

    this.versionChanged = false;
    this.currentVersion = props.version;

    this.state = {
      activeKey: 1,
      loading: true,
      data: {},
      levels: [this.props.level ? this.props.level : "Critical"],
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
      levels: [this.props.level ? this.props.level : "Critical"],
      data: {},
      loading: true,
    });
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

  filteredValuesTable(changes) {
    let informedFields = [];
    changes.map(c => {
      for(let key in c) {
        if(key === "Fields")
          informedFields.push(key)
        else
          if(c[key] != null)
            informedFields.push(key)
      }
    })
    let filteredChanges = changes.map(c => {
      for(let key in c) {
        if(!informedFields.includes(key))
          delete c[key]
      }
      return c
    })
    return filteredChanges;
  }

  renderValuesTable(changes) {
    changes = this.filteredValuesTable(changes);
    let heads = Object.keys(changes[0]).filter(v => v !== "ChangeId" && v !== "Fields");
    let fields = Object.keys(changes[0]["Fields"]);
    let titles = heads.concat(fields).map(v => { return (<CTableHeaderCell scope="col" key={v}> {v} </CTableHeaderCell>) });
    let rows = [];
    for (let i in changes) {
      let values = heads.map(v => changes[i][v]).concat(fields.map(v => changes[i]["Fields"][v]));
      rows.push(
        <CTableRow key={"row_" + i}>
          {values.map((v, j) => { return (<CTableDataCell key={v + "_" + j}> {v} </CTableDataCell>) })}
        </CTableRow>
      )
    }
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

  renderChanges() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CRow className="p-3">
          <CCol xs="auto">
            a
          </CCol>
        </CRow>
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
          {!this.state.errorLoading &&
            <CRow >
              <MapViewer siteCode={this.props.item} version={this.props.version} />
            </CRow>
          }
        </CTabPane>
    )
  }

  getBody() {
    let data = [
      {
        "ChangeId": 0,
        "Type": "",
        "Predecessors": [],
        "Successors": []
      }
    ]

    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    return body;
  }

  saveChangesModal() {
    let body = this.getBody();
    if (this.fieldValidator()) {
      this.props.updateModalValues("Save changes", "This will save the site changes", "Continue", () => this.saveChanges(body), "Cancel", () => { });
    }
  }

  saveChanges(body) {
    this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
      .then((data) => {
        if(data?.ok) {
          this.setState({ fields: body, fieldChanged: false, updatingData: false });
        }
        else {
          this.showErrorMessage("fields", "Something went wrong");
        }
      });
    this.setState({ updatingData: true });
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
            { this.props.errorMessage !== "" &&
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
              {data.Status === 'Proposed' && <CButton disabled={this.changingStatus} color="secondary" onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.rejectChangesModal(true), true) : this.rejectChangesModal()}>Reject Changes</CButton>}
              {data.Status === 'Proposed' && <CButton disabled={this.changingStatus} color="primary" onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.consolidateChangesModal(true), true) : this.consolidateChangesModal()}>Consolidate Changes</CButton>}
              {data.Status !== 'Proposed' && this.state.activeKey !== 3 && <CButton disabled={this.changingStatus} color="primary" className="ms-auto" onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.backToProposedModal(true), true) : this.backToProposedModal()}>Back to Proposed</CButton>}
            </div>
          </CModalFooter>
        </>
    )
  }

  renderData() {
    if (!this.isLoadingData) {
      this.loadData();
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
      this.dl.fetch(ConfigData.LINEAGE_GET_CHANGES + "?siteCode=" + this.props.item)
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
          if(this.isSiteDeleted())
            this.setState({ fields: "noData" })
          this.setState({ data: data.Data, loading: false, activeKey: this.props.activeKey ? this.props.activeKey : this.state.activeKey })
      });
    }
  }

  resetLoading() {
    this.isLoadingData = false;
  }

  consolidateChangesModal(clean) {
    this.changingStatus = true;
    if (clean) {
      this.cleanUnsavedChanges();
    }
    this.resetLoading();
    this.props.updateModalValues("Consolidate Changes", "This will consolidate all the site changes", "Continue", () => this.consolidateChanges(), "Cancel", () => { this.changingStatus = false });
  }

  consolidateChanges() {
    this.props.consolidate()
      .then((data) => {
        if (data?.Success) {
          this.changingStatus = false;
          this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
        } else { this.showErrorMessage("general", "Error consolidating changes") }
      });
  }

  rejectChangesModal(clean) {
    this.changingStatus = true;
    if (clean) {
      this.cleanUnsavedChanges();
    }
    this.resetLoading();
    this.props.updateModalValues("Reject Changes", "This will reject all the site changes", "Continue", () => this.rejectChanges(), "Cancel", () => { this.changingStatus = false });
  }

  rejectChanges() {
    this.props.reject()
      .then(data => {
        if (data?.Success) {
          this.changingStatus = false;
          this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
        } else { this.showErrorMessage("general", "Error rejecting changes") }
      });
  }

  backToProposedModal(clean) {
    this.changingStatus = true;
    if (clean) {
      this.cleanUnsavedChanges();
    }
    this.resetLoading();
    this.props.updateModalValues("Back to Proposed", "This will set the changes back to Proposed", "Continue", () => this.setBackToProposed(), "Cancel", () => { this.changingStatus = false });
  }

  getCurrentVersion() {
    return this.dl.fetch(ConfigData.SITEDETAIL_GET + "?siteCode=" + this.props.item)
      .then(response => response.json())
      .then(data => {
        if(data?.Success)
          return data.Data.Version;
      })
  }

  isSiteDeleted() {
    return this.state.data.Critical?.SiteInfo.ChangesByCategory
        .map(c => c.ChangeType === "Site Deleted")
        .reduce((result, next) => result || next, false);
  }

  setBackToProposed() {
    let controlResult = (data) => {
      if (data?.Success) {
        this.changingStatus = false;
        this.versionChanged = true;
        this.currentVersion = data.Data[0].VersionId;
        this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
      } else { this.showErrorMessage("general", "Error setting changes back to proposed") }
    }

    if(this.state.data.Status === "Consolidated" && !this.isSiteDeleted())
      this.getCurrentVersion()
        .then(version => { 
          this.props.backToProposed(version)
          .then((data) => {
            controlResult(data);
          })
        });
    else
      this.props.backToProposed(this.props.version)
        .then((data) => {
          controlResult(data);
        })
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
