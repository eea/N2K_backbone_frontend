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
import MapViewer from '../../../components/MapViewer'

import { DataLoader } from '../../../components/DataLoader';
import { dateFormatter } from 'src/components/DateUtils';
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
      previousType: null,
      type: null,
      status: this.props.status,
      predecessorData: {},
      previousPredecessors: null,
      predecessors: null,
      newPredecessor: false,
      referenceSites: [],
      releaseDate: "",
      updateOnClose: false,
      errorLoading: false,
      message: "",
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
      predecessorData: {},
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
    if(changes === "noData")
      return (
        <div className="nodata-container"><em>No Data</em></div>
      );
    if(!Array.isArray(changes))
      changes = [changes]
    if(changes.length === 0)
      return;
    let heads = Object.keys(changes[0]).filter(v => v !== "ReleaseDate").map(v => {
      if(v === "BioRegion")
        return "Biogeographical Region"
      if(v === "AreaSDF")
        return "Area SDF (ha)"
      if(v === "AreaGEO")
        return "Area Geometry (ha)"
      if(v === "Length")
        return v + " (km)"
      if(v === "Status")
        return "Lineage Status"
      else
        return v.replace(/([A-Z])/g, ' $1')
    });
    let titles = heads.map(k => { return (<CTableHeaderCell scope="col" key={k}> {k} </CTableHeaderCell>) });
    let rows = []; 
    for(let i in changes)
      rows.push(
        <CTableRow key={"row_"+i}>
          {Object.entries(changes[i]).map(([k,v]) => {
            if(k == "SiteType")
              return (<CTableDataCell key={k + "_" + v}> {UtilsData.SITE_TYPES[v]} </CTableDataCell>) 
            else if(k !== "ReleaseDate")
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
      return document.querySelector(".add-predecessor .multi-select__single-value")?.textContent.split('-')[0].trim();
    }
    if(this.state.referenceSites.length !== this.state.predecessors?.split(',').length) {
      let options = this.state.referenceSites?.filter(r => 
        !this.state.predecessors?.split(',')
        .includes(r.SiteCode))
        .map(v => ({ "value": v.SiteCode, "label": v.SiteCode + ' - ' + v.Name }));
      return (
        <div className="d-flex mb-2">
          <Select
            id="new-select"
            name="new-select"
            className="multi-select multi-select-predecessor add-predecessor w-100"
            classNamePrefix="multi-select"
            placeholder="Select a site"
            options={options}
            isMulti={false}
            closeMenuOnSelect={true}
            onChange={(e) => this.setState({ predecessors: this.state.predecessors ? (this.state.predecessors + ',' + e.value) : e.value, newPredecessor: false })}
          />
            <CButton color="link" className="btn-icon"
              disabled={this.state.predecessors === ""}
              onClick={() => {getNewSite()? this.deleteSite(getNewSite()):""; this.setState({ newPredecessor: false})}}
            >
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
        </div>
      );
    }
    else
      return (
        <div>
          <em>No data</em>
        </div>
      )
  }
  
  setSelectedPredecessors(options) {
    this.setState(() => ({
      predecessors: Object.values(options)
        .map(s => s.textContent.split('-')[0].trim()
        .replace("option ", ""))
        .join(',')
    }));
  }
  
  predecessorList() {
    let predecessors = this.state.predecessors?.split(',');
    let options = this.state.referenceSites?.filter(r => 
      !this.state.predecessors?.split(',')
      .includes(r.SiteCode))
      .map(v => ({ "value": v.SiteCode, "label": v.SiteCode + ' - ' + v.Name }));
    if(predecessors?.length > 0 && options.length > 0)
      return predecessors?.map((s) => 
        <div key={s} className="d-flex mb-2">
          <Select
            id={"select-" + s}
            name={"select-" + s}
            className="multi-select multi-select-option multi-select-predecessor w-100"
            classNamePrefix="multi-select"
            placeholder="Select a site"
            options={options}
            defaultValue={() => {
              let site = this.state.referenceSites?.find(v => v.SiteCode === s);
              if(site)
                return {"value": site.SiteCode, "label": site.SiteCode + ' - ' + site.Name}
            }}
            isMulti={false}
            closeMenuOnSelect={true}
            isDisabled={this.state.status === "Consolidated" || this.state.type === "Deletion"}
            onChange={() => this.setSelectedPredecessors(document.querySelectorAll(".multi-select-predecessor"))}
          />
          <div hidden={this.state.type === "Creation" || this.state.type === "Deletion"}>
            <CButton color="link" className="btn-icon"
              hidden={this.state.status === "Consolidated"}
              disabled={this.state.predecessors.split(",").length === 1}
              onClick={() => this.deleteSite(s)}>
              <i className="fa-regular fa-trash-can"></i>
            </CButton>
          </div>
        </div>
      );
  }
  
  deleteSite(e) {
    let newList = this.state.predecessors?.split(',').filter(s => s !== e).join();
    this.setState({ predecessors: newList })
  }
  
  lineageEditor() {
    let options = this.typeList.map((v, i) => ({
      "value": i,
      "label": v,
      "isDisabled": (this.state.previousType === "Creation" && v === "Deletion") || (this.state.previousType === "Deletion" && v === "Creation") || (v === "Deletion" && !this.state.referenceSites.some(a => a.SiteCode === this.state.data.SiteCode))
    }));
    return(
      <>
        <CRow className="p-3">
          <CCol key={"changes_editor_label_sitecode"}>
            <b>Site Code</b>
          </CCol>
          <CCol key={"changes_editor_label_type"}>
            <b>Type</b>
          </CCol>
          <CCol key={"changes_editor_label_predecessor"}>
            <b>Predecessors</b>
          </CCol>
        </CRow>

        <CRow className="px-3">
          <CCol key={"changes_editor_label_sitecode"}>
            <CFormInput type="text" disabled={this.state.type !== "Recode" || this.state.status === "Consolidated"} defaultValue={this.state.data.SiteCode ?? this.props.code} />
          </CCol>
          <CCol key={"changes_editor_label_type"}>
            <Select
              className="multi-select multi-select-option w-100"
              classNamePrefix="multi-select"
              placeholder="Select a change"
              options={options}
              defaultValue={options.find(a => a.label === this.state.type)}
              isMulti={false}
              closeMenuOnSelect={true}
              isDisabled={this.state.status === "Consolidated"}
              onChange={(e) => this.setState({ type: e.label, newPredecessor: e.label !== "Creation" && this.state.predecessors === "", predecessors: e.label === "Deletion" ? this.state.data.SiteCode : this.state.predecessors})}
            />
          </CCol>
          <CCol key={"changes_editor_label_predecessor"}>
            {(this.state.type == "" ? this.props.type : this.state.type) !== "Creation" ? (this.state.predecessors !== "" ? this.predecessorList() : "") : <em>No predecessors</em>}
            {(this.state.type == "" ? this.props.type : this.state.type) !== "Creation" && this.state.newPredecessor &&
              this.addPredecessor()
            }
            {(this.state.type == "" ? this.props.type : this.state.type) !== "Creation" &&
            <CButton color="link" className="ms-auto p-0" 
              hidden={this.state.type === "Deletion"
                || this.state.type === "Creation"
                || this.state.status === "Consolidated"
                || this.state.newPredecessor}
              onClick={() => this.setState({ newPredecessor: true })}>
              Add site
            </CButton>
            }
          </CCol>
        </CRow>
      </>
    )
  }

  renderChanges() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        {this.lineageEditor()}
        {this.state.previousType !== "Deletion" &&
          <CRow className="p-3">
            <CCol key={"changes_tabular"}>
              <b>Tabular Changes</b>
              {this.renderValuesTable(this.state.data)}
            </CCol>
          </CRow>
        }
        {this.state.previousType !== "Creation" && this.state.previousPredecessors?.length >= 1 &&
          <CRow className="p-3">
            <CCol key={"changes_predecessors"}>
              <b>Predecessors</b>
              {this.renderValuesTable(this.state.predecessorData)}
            </CCol>
          </CRow>
        }
        {this.state.previousPredecessors?.length == 0 &&
          <CRow className="p-3">
            <CCol>
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
          {!this.state.errorLoading &&
            <CRow >
              <MapViewer
                siteCode={this.props.code}
                version={this.props.version}
                lineageChangeType={this.props.type}
                mapReference={ConfigData.MAP_REFERENCE}
                mapSubmission={ConfigData.MAP_SUBMISSION}
              />
            </CRow>
          }
        </CTabPane>
    )
  }

  getBody() {
    return (
      {
        "ChangeId": this.props.change,
        "Type": this.state.type,
        "Predecessors": this.state.type === "Creation" ? "" : this.state.predecessors
      }
    )
  }

  checkChanges() {
    return (
      this.state.previousType == this.state.type
      && this.state.previousPredecessors == this.state.predecessors
    )
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
              {data.SiteCode ?? this.props.code} - {data.Name ??  this.props.name}
              <span className="ms-2 fw-normal">({UtilsData.SITE_TYPES[data.SiteType]})</span>
              <span className="mx-2"></span>
              <span className="badge badge--fill default">Release date: {this.state.releaseDate !== "" ? this.state.releaseDate : "--/--/----"}</span>
            </CModalTitle>
            <CCloseButton onClick={() => this.closeModal()} />
          </CModalHeader>
          <CModalBody>
            {this.props.errorMessage?.length !== 0 &&
              <CAlert color="danger">{this.props.errorMessage}</CAlert>
            }
            {this.state.message !== "" &&
              <CAlert color="danger">{this.state.message}</CAlert>
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
              <CButton color="link" className="ms-auto" href={"/#/sitechanges/changes?country=" + this.props.country + "&sitecode=" + this.state.data.SiteCode}>
                <span>Review site CHANGES</span>
              </CButton>
            </CNav>
            <CTabContent>
              {this.renderChanges()}
              {this.renderGeometry()}
            </CTabContent>
          </CModalBody>
          <CModalFooter>
            <div className="ms-auto">
              {this.state.status === 'Proposed' && <CButton disabled={this.checkChanges() || this.changingStatus} color="primary" onClick={() => this.saveChangesModal()}>
              {this.state.updatingData && <CSpinner size="sm"/>}
              {this.state.updatingData ? " Saving Changes":"Save Changes"}
                </CButton>
              }
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
    if(!this.checkChanges())
      this.props.updateModalValues("Lineage Edition", "There are unsaved changes, do you want to continue?",
        "Continue", () => this.close(),
        "Cancel", () => { })
    else
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
    if (this.isVisible()) {
      this.isLoadingData = true;
      this.dl.fetch(ConfigData.LINEAGE_GET_CHANGES_DETAIL + "?ChangeId=" + this.props.change)
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
          this.setState({ data: data.Data ?? "noData", status: data.Data?.Status ?? this.props.status
          , previousType: this.state.type ?? this.props.type, type: this.state.type ?? this.props.type, loading: false
          , activeKey: this.props.activeKey ?? this.state.activeKey })
      });
    }
  }
  
  loadPredecessorData() {
    if (this.isVisible()) {
      this.isLoadingPredecessorData = true;
      this.dl.fetch(ConfigData.LINEAGE_GET_PREDECESSORS + "?ChangeId=" + this.props.change)
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
          this.setState({
            predecessors: data.Data.map(s => s.SiteCode).join(','),
            predecessorData: data.Data,
            previousPredecessors: data.Data.map(s => s.SiteCode).join(','),
            releaseDate: data.Data.length ? dateFormatter(data.Data[0].ReleaseDate) : "",
            newPredecessor: data.Data.length ? false : true
          })
      });
    }
  }
  
  loadReferenceData() {
    if (this.isVisible()) {
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

  saveChangesModal() {
    if(this.state.type !== "Creation" && (this.state.newPredecessor || this.state.predecessors === "")) {
      this.setState({"message": "Predecessors cannot be empty"});
    }
    else {
      this.changingStatus = true;
      this.props.updateModalValues("Save Changes", "This will save all the lineage changes",
        "Continue", () => this.saveChanges(),
        "Cancel", () => { this.changingStatus = false })
    }
  }

  showMessage(text) {
    this.setState({message: text});
    setTimeout(() => {
      this.setState({message: null});
    }, UtilsData.MESSAGE_TIMEOUT);
  };

  saveChanges() {
    this.setState({updatingData: true});
    this.sendRequest(ConfigData.LINEAGE_SAVE_CHANGES, "POST", this.getBody())
    .then((data) => {
      if (data.ok) {
        this.changingStatus = false;
        this.resetLoading();
        this.setState({ data: {}, fields: {}, loading: true, previousPredecessors: this.state.predecessors, previousType: this.state.type });
      }
      else {
        this.setState({"Error": data.Message});
      }
      this.setState({updatingData: false});
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
