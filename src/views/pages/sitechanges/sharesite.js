import React, { Component, useState } from 'react';
import { AppFooter, AppHeader } from './../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  CButton,
  CCol,
  CRow,
  CContainer,
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
  CTabContent,
  CTabPane,
  CTooltip,
  CCollapse,
  CCard,
  CAlert,
} from '@coreui/react'

import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';
import TextareaAutosize from 'react-textarea-autosize';
import justificationRequiredImg from './../../../assets/images/exclamation.svg'
import documentImg from './../../../assets/images/file-text.svg'
import MapViewer from '../../../components/MapViewer'

const defaultParams = () => {
  const searchParams = new URLSearchParams(window.location.href.split('?')[1]);
  const paramSitecode = searchParams.get('sitecode');
  const paramVersion = !searchParams.get('version') ? null : +searchParams.get('version');
  let params = (paramSitecode) || paramVersion ? {paramSitecode, paramVersion} : {paramSitecode: null, paramVersion: null};
  return params;
}  

class ModalChanges extends Component {
  constructor(props) {
    super(props);
    this.dl = new(DataLoader);

    this.errorLoadingComments = false;
    this.errorLoadingDocuments = false;

    this.state = {
      activeKey: 1,
      loading: true,
      sitecode: defaultParams().paramSitecode,
      version: defaultParams().paramVersion,
      data: {}, 
      levels:[this.props.level ? this.props.level : "Critical"],
      bookmark: "",
      bookmarks: [],
      bookmarkUpdate: false,
      comments:[],
      documents:[],
      showDetail: [],
      justificationRequired: false,
      errorLoading: false
    }
  }

  toggleDetail(key) {
    if (this.state.showDetail.includes(key)) {
      this.setState({ showDetail: this.state.showDetail.filter((a) => a !== key) });
    } else {
      this.setState({ showDetail: [...this.state.showDetail, key] });
    }
  }

  filteredValuesTable(changes) {
    let informedFields = [];
    changes.map(c => {
      for (let key in c) {
        if (key === "Fields")
          informedFields.push(key)
        else
          if (c[key] != null)
            informedFields.push(key)
      }
    })
    let filteredChanges = changes.map(c => {
      for (let key in c) {
        if (!informedFields.includes(key))
          delete c[key]
      }
      return c
    })
    return filteredChanges;
  }

  checkTableUnits(type, field) {
    if (type.toLowerCase().includes("area") || type.toLowerCase().includes("length")) {
      let unit = type.toLowerCase().includes("area") ? " (ha)" : " (km)"
      field = (field === "Reference" || field === "Submission") ? field + unit : field;
    }
    if (type.toLowerCase().includes("population")) {
      const populationFields = ["reference", "submission"]
      field = populationFields.includes(field.toLowerCase()) ? field + " (pop)" : field;
    }
    return field;
  }

  renderValuesTable(changes, type) {
    const colorizeValue = (num) => {
      if (Number(num) > 0)
        return ConfigData.Colors.Green
      if (Number(num) < 0)
        return ConfigData.Colors.Red
      if (Number(num) == 0)
        return ConfigData.Colors.White
    }
    changes = this.filteredValuesTable(changes);
    let heads = Object.keys(changes[0]).filter(v => v !== "ChangeId" && v !== "Fields");
    let fields = Object.keys(changes[0]["Fields"]);
    let titles = heads.concat(fields).map(v => { return (<CTableHeaderCell scope="col" key={v}> {this.checkTableUnits(type, v)} </CTableHeaderCell>) });
    let rows = [];
    for (let i in changes) {
      let values = heads.map(v => changes[i][v]).concat(fields.map(v => changes[i]["Fields"][v]));
      let pos = [fields.indexOf("Difference"), fields.indexOf("Percentage")]
      rows.push(
        <CTableRow key={"row_" + i}>
          {values.map((v, index) => {
            if (fields.includes("Difference") || fields.includes("Percentage"))
              return (<CTableDataCell key={v}
                style={{ backgroundColor: (pos.includes(index) ? colorizeValue(v) : "") }}>
                {v == 0 ? 0 : v} </CTableDataCell>)
            else
              return (<CTableDataCell key={v}>{v} </CTableDataCell>)
          })}
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

  renderChangeList() {
    let levels = this.state.levels;
    let list = [];
    for (let l in levels) {
      let changes = this.state.data[levels[l]][this.state.bookmark];
      let level = levels[l];
      for (let i in changes) {
        if (!Array.isArray(changes[i])) break;
        for (let j in changes[i]) {
          let title = "";
          title += (title ? ' - ' : "") + (changes[i][j].ChangeType ? changes[i][j].ChangeType : "");
          title += changes[i].FieldName ? ' - ' + changes[i][j].FieldName : "";
          list.push(
            <div key={"change_" + levels[l] + "_" + j + "_" + title} className="collapse-container">
              <div className="d-flex gap-2 align-items-center justify-content-between" key={i + "_" + j}>
                <div>
                  <span className={"badge badge--" + level.toLocaleLowerCase() + " me-2"}>{level}</span>
                  <span className="me-3"> {title} {(changes[i][j].ChangeCategory === "Species" || changes[i][j].ChangeCategory === "Habitats") && " (" + changes[i][j].ChangedCodesDetail.length + ")"}</span>
                </div>
                <div>
                  <CButton color="link" className="btn-link--dark text-nowrap" onClick={() => this.toggleDetail(changes[i][j].ChangeCategory + title)}>
                    {(this.state.showDetail.includes(changes[i][j].ChangeCategory + title)) ? "Hide detail" : "View detail"}
                  </CButton>
                </div>
              </div>
              <CCollapse visible={this.state.showDetail.includes(changes[i][j].ChangeCategory + title)}>
                <CCard>
                  {this.state.showDetail && this.renderValuesTable(changes[i][j].ChangedCodesDetail, changes[i][j].ChangeType)}
                </CCard>
              </CCollapse>
            </div>
          );
        }
      }
    }
    return (
      <>
        {list}
      </>
    )
  }

  setBookmark(val) {
    this.setState({ bookmark: val, bookmarkUpdate: false });
  }

  bookmarkIsEmpty(bookmark) {
    let isEmpty = true;
    for (let i in bookmark) {
      isEmpty = Array.isArray(bookmark[i]) ? isEmpty && (bookmark[i].length === 0) : isEmpty;
    }
    return isEmpty;
  }

  renderBookmarks() {
    let bookmarks = [];
    let levels = this.state.levels;
    for (let l in levels) {
      for (let i in this.state.data[levels[l]]) {
        if (!this.bookmarkIsEmpty(this.state.data[levels[l]][i])) {
          if (!bookmarks.includes(i)) {
            if (i == "SiteInfo")
              bookmarks = [i].concat(bookmarks);
            else
              bookmarks.push(i);
          }
        }
      }
      if ((!this.state.bookmark && bookmarks.length > 0) || this.state.bookmarkUpdate) {
        const priorityBookmarks = ["SiteInfo", "Habitats", "Sites"];
        const getBookmark = (bookmarkOptions) => {
          let result = bookmarkOptions.filter(op => bookmarks.includes(op));
          if (result.length >= 1)
            return result[0];
          return bookmarks[0];
        }
        this.setBookmark(getBookmark(priorityBookmarks));
      }
    }

    return (
      <CSidebarNav className="pe-4">
        {bookmarks.includes("SiteInfo") &&
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark === "SiteInfo" ? " active" : "")} onClick={() => this.setBookmark("SiteInfo")}>
              <i className="fa-solid fa-bookmark"></i>
              Site info
            </a>
          </li>
        }
        {bookmarks.includes("Habitats") &&
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark === "Habitats" ? " active" : "")} onClick={() => this.setBookmark("Habitats")}>
              <i className="fa-solid fa-bookmark"></i>
              Habitats
            </a>
          </li>
        }
        {bookmarks.includes("Species") &&
          <li className="nav-item mb-1">
            <a className={"nav-link" + (this.state.bookmark === "Species" ? " active" : "")} onClick={() => this.setBookmark("Species")}>
              <i className="fa-solid fa-bookmark"></i>
              Species
            </a>
          </li>
        }
      </CSidebarNav>
    )
  }

  setLevel(level) {
    let levels = this.state.levels;
    if (levels.includes(level)) {
      levels = levels.filter(e => e !== level);
    } else {
      levels.push(level);
    }
    this.setState({ levels: levels, bookmark: "", bookmarkUpdate: true });
  }

  renderChanges() {
    return (
      <CTabPane className="tab-changes" role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CRow className="p-3">
          <CCol xs="auto">
            <CSidebarNav className="pe-5">
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_critical" onClick={(e) => this.setLevel("Critical")} checked={this.state.levels.includes("Critical")} readOnly />
                  <label htmlFor="modal_check_critical" className="input-label badge color--critical">Critical</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_warning" onClick={(e) => this.setLevel("Warning")} checked={this.state.levels.includes("Warning")} readOnly />
                  <label htmlFor="modal_check_warning" className="input-label badge color--warning">Warning</label>
                </div>
              </li>
              <li className="nav-item">
                <div className="checkbox">
                  <input type="checkbox" className="input-checkbox" id="modal_check_info" onClick={(e) => this.setLevel("Info")} checked={this.state.levels.includes("Info")} readOnly />
                  <label htmlFor="modal_check_info" className="input-label badge color--info">Info</label>
                </div>
              </li>
            </CSidebarNav>
          </CCol>
          <CCol>
            <CRow>
              <CCol xs="auto">
                {this.renderBookmarks()}
              </CCol>
              <CCol>
                {this.renderChangeList()}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CTabPane>
    )
  }

  sortComments() {
    this.state.comments.sort(
      (a, b) => b.Date && a.Date ?
        b.Date.localeCompare(a.Date)
        : {}
    );
  }

  renderComments(target) {
    let cmts = [];
    let filteredComments = [];
    if (this.state.comments !== "noData") {
      this.sortComments();
      if (target == "country") {
        filteredComments = this.state.comments?.filter(c => c.Release)
      } else {
        filteredComments = this.state.comments?.filter(c => !c.Release)
      }
    }
    if (this.state.comments !== "noData") {
      filteredComments.forEach(c => {
        cmts.push(
          this.createCommentElement(c.Id, c.Comments, c.Date, c.Owner, c.Edited, c.EditedDate, c.EditedBy, target)
        )
      })
    }
    return (
      <div className="attachments--group" id={"changes_comments_" + target}>
        {cmts}
        {filteredComments.length == 0 &&
          <em>No comments</em>
        }
      </div>
    )
  }

  createCommentElement(id, comment, date, owner, edited, editeddate, editedby, level) {
    return (
      <div className="comment--item" key={"cmtItem_" + id} id={"cmtItem_" + id}>
        <div className="comment--text">
          <TextareaAutosize
            id={id}
            disabled
            defaultValue={comment}
            className="comment--input" />
          <label className="comment--date" htmlFor={id}>
            {date && owner &&
              "Commented on " + date.slice(0, 10).split('-').reverse().join('/') + " by " + owner + "."
            }
            {((edited >= 1) && (editeddate && editeddate !== undefined) && (editedby && editedby !== undefined)) &&
              " Last edited on " + editeddate.slice(0, 10).split('-').reverse().join('/') + " by " + editedby + "."
            }
          </label>
        </div>
      </div>
    )
  }

  sortDocuments() {
    this.state.documents.sort(
      (a, b) => b.ImportDate && a.ImportDate ?
        b.ImportDate.localeCompare(a.ImportDate)
        : {}
    );
  }

  renderDocuments(target) {
    let docs = [];
    let filteredDocuments = [];
    if (this.state.documents !== "noData") {
      this.sortDocuments();
      if (target == "country")
        filteredDocuments = this.state.documents?.filter(d => d.Release)
      else
        filteredDocuments = this.state.documents?.filter(d => !d.Release)
    }
    if (this.state.documents !== "noData") {
      filteredDocuments.forEach(d => {
        // original name may be null until the backend part it's finished
        const name = d.OriginalName ?? d.Path;
        docs.push(
          this.createDocumentElement(d.Id, name, d.Path, d.ImportDate, d.Username, target)
        )
      })
    }
    return (
      <div className="attachments--group" id={"changes_documents_" + target}>
        {docs}
        {filteredDocuments.length == 0 &&
          <em>No documents</em>
        }
      </div>
    )
  }

  createDocumentElement(id, name, path, date, user, level) {
    return (
      <div className="document--item" key={"docItem_" + id} id={"docItem_" + id} doc_id={id}>
        <div className="my-auto document--text">
          <CImage src={documentImg} className="ico--md me-3"></CImage>
          <span>{name?.replace(/^.*[\\\/]/, '')}</span>
        </div>
        <div className="document--icons">
          {(date || user) &&
            <CTooltip
              content={"Uploaded"
                + (date && " on " + date.slice(0, 10).split('-').reverse().join('/'))
                + (user && " by " + user)}>
              <div className="btn-icon btn-hover">
                <i className="fa-solid fa-circle-info"></i>
              </div>
            </CTooltip>
          }
          <CButton color="link" className="btn-link--dark" onClick={()=>{this.downloadAttachments(path, name)}}>
            View
          </CButton>
        </div>
      </div>
    )
  }

  renderAttachments() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 3}>
        <CRow className="py-3">
          <CCol className="mb-3" xs={12} lg={6}>
            <div className="attachments--title">
              <b>Attached documents</b>
            </div>
            {this.errorLoadingDocuments ?
              <CAlert color="danger">Error loading documents</CAlert>
              :
              <CCard className="document--list">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                </div>
                {this.renderDocuments("country")}
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Site Level</b>
                </div>
                {this.renderDocuments("site")}
              </CCard>
            }
          </CCol>
          <CCol className="mb-3" xs={12} lg={6}>
            <div className="attachments--title">
              <b>Comments</b>
            </div>
            {this.errorLoadingComments ?
              <CAlert color="danger">Error loading comments</CAlert>
              :
              <CCard className="comment--list">
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Country Level</b>
                </div>
                {this.renderComments("country")}
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Site Level</b>
                </div>
                {this.renderComments("site")}
              </CCard>
            }
          </CCol>
        </CRow>
      </CTabPane>
    )
  }

  downloadAttachments = (path, name) => {
    fetch(path).then((response) => response.blob())
    .then((blobresp) => {
      var blob = new Blob([blobresp], {type: "octet/stream"});
      var url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.download = name;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  renderGeometry() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 2}>
        {this.state.errorLoading ?
          <CAlert color="danger">Error loading data</CAlert>
          :
          <CRow >
            <MapViewer
              siteCode={this.state.sitecode}
              version={this.state.version}
              noGeometry={this.state.data?.Critical?.SiteInfo?.ChangesByCategory?.some(a => a.ChangeType === "No geometry reported")}
              lineageChangeType={this.state.data.lineageChangeType}
              latestRelease={ConfigData.LATEST_RELEASE}
              reportedSpatial={ConfigData.REPORTED_SPATIAL}
            />
          </CRow>
        }
      </CTabPane>
    )
  }

  renderContent() {
    let data = this.state.data;
    return (
      <>
        <div className="d-flex justify-content-between py-3">
          <div className="page-title">
            <h1 className="h1">
              {data.SiteCode} - {data.Name}
              <span className="ms-2 fw-normal">({data.Type})</span>
              {data.Status !== "Pending" &&
                <>
                  <span className="mx-2"></span>
                  <span className={"badge status--" +data.Status.toLowerCase()}>{data.Status}</span>
                </>
              }
            </h1>
          </div>
        </div>
        <CAlert color="primary" className="d-flex align-items-center" visible={this.state.justificationRequired}>
          {this.state.justificationRequired &&
            <>
              <CImage src={justificationRequiredImg} className="ico--md me-3"></CImage>
              Justification missing
            </>
          }
        </CAlert>
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink
              active={this.state.activeKey === 1}
              onClick={() => this.setState({activeKey: 1})}
            >
              Change Information
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={this.state.activeKey === 2}
              onClick={() => this.setState({activeKey: 2})}
            >
              Geometry
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={this.state.activeKey === 3}
              onClick={() => this.setState({activeKey: 3})}
            >
              Documents & Comments
            </CNavLink>
          </CNavItem>
          <div className="ms-auto">
            <CButton color="link" href={"/#/sdf?sitecode=" + data.ReferenceSiteCode} target="_blank"
              className={!data.ReferenceSiteCode
                || (this.props.lineageChangeType == "Deletion" && this.state.data.Status == "Accepted")
                || (this.props.lineageChangeType == "Creation" && this.state.data.Status != "Accepted")
              ? "disabled" : ""}>
              <i class="fas fa-arrow-up-right-from-square me-2"></i>
              SDF
            </CButton>
          </div>
        </CNav>
        <CTabContent>
          {this.renderChanges()}
          {this.renderAttachments()}
          {this.renderGeometry()}
        </CTabContent>
      </>
    )
  }

  renderData() {
    if(this.state.data !== "noData" && this.state.sitecode && this.state.version !== null && !this.state.errorLoading) {
      this.loadData();
      this.loadComments();
      this.loadDocuments();
    }

    let contents = (this.state.data === "noData" || (!this.state.sitecode || this.state.version === null))
      ? <div className="nodata-container"><em>No Data</em></div>
      : this.state.loading
        ? <div className="loading-container"><em>Loading...</em></div>
        : this.state.errorLoading ?
            <CRow className="p-4">
              <CAlert color="danger">Error loading data</CAlert>
            </CRow>
          : this.renderContent();

    return (
      <>
        {contents}
      </>
    )
  }

  render() {
    return(
      <div className="container--main min-vh-100">
        <AppHeader page="share"/>
        <div className="content--wrapper">
          <div className="main-content">
            <CContainer fluid>
              {this.renderData()}
            </CContainer>
          </div>
        </div>
      </div>
    )
  }

  loadData() {
    if (this.state.data.SiteCode !== this.state.sitecode) {
      this.dl.fetch(ConfigData.SITECHANGES_DETAIL + `siteCode=${this.state.sitecode}&version=${this.state.version}`)
        .then(response => {
          if (response.status === 200)
            return response.json();
          else
            return this.setState({ errorLoading: true });
      })
      .then(data => {
        if(data?.Success) {
          if(data.Data.SiteCode === this.state.sitecode && Object.keys(this.state.data).length === 0) {
            this.setState({data: data.Data, loading: false, justificationRequired: data.Data?.JustificationRequired, activeKey: this.props.activeKey ? this.props.activeKey : this.state.activeKey})
          }
          else if(Object.keys(this.state.data).length === 0) {
            this.setState({data: "noData", loading: false});
          }
        } else {
          this.setState({ loading: false, errorLoading: true });
        }
      });
    }
  }

  loadComments() {
    if (this.state.data.SiteCode !== this.state.sitecode) {
      this.isLoadingComments = true;
      this.dl.fetch(ConfigData.GET_SITE_COMMENTS + `siteCode=${this.state.sitecode}&version=${this.state.version}`)
      .then(response => {
        if (response.status === 200)
          return response.json();
        else {
          this.errorLoadingComments = true;
        }
      })
      .then(data => {
        if (!data.Success)
          this.errorLoadingComments = true;
        else if (data.Data.length > 0) {
          if (data.Data[0]?.SiteCode === this.state.sitecode && (this.state.comments.length === 0 || this.state.comments === "noData"))
            this.setState({ comments: data.Data });
        }
        else {
          this.setState({ comments: "noData" });
        }
      });
    }
  }

  loadDocuments() {
    if (this.state.data.SiteCode !== this.state.sitecode) {
      this.isLoadingDocuments = true;
      this.dl.fetch(ConfigData.GET_ATTACHED_FILES + `siteCode=${this.state.sitecode}&version=${this.state.version}`)
        .then(response => {
          if (response.status === 200)
            return response.json();
          else
            return this.errorLoadingDocuments = true;
        })
        .then(data => {
          if (!data.Success)
            this.errorLoadingDocuments = true;
          else if (data.Data.length > 0) {
            if (data.Data[0]?.SiteCode === this.state.sitecode && (this.state.documents.length === 0 || this.state.documents === "noData"))
              this.setState({ documents: data.Data });
          }
          else {
            this.setState({ documents: "noData" });
          }
        });
    }
  }
}
export default ModalChanges;
