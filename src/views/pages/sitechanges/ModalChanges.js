import ConfigData from '../../../config.json';
import React, { Component } from 'react';
import Select from 'react-select';
import {
  CButton,
  CCol,
  CRow,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
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
  CFormCheck,
  CImage,
  CPagination,
  CPaginationItem,
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

import TextareaAutosize from 'react-textarea-autosize';

import { ConfirmationModal } from './components/ConfirmationModal';
import justificationRequiredImg from './../../../assets/images/exclamation.svg'
import justificationProvidedImg from './../../../assets/images/file-text.svg'

import MapViewer from './components/MapViewer'

import { DataLoader } from '../../../components/DataLoader';
export class ModalChanges extends Component {
  constructor(props) {
    super(props);
    this.dl = new (DataLoader);

    this.isLoadingFields = false;
    this.isLoadingData = false;
    this.isLoadingComments = false;
    this.isLoadingDocuments = false;

    this.errorLoadingFields = false;
    this.errorLoadingComments = false;
    this.errorLoadingDocuments = false;

    this.changingStatus = false;

    this.state = {
      activeKey: 1,
      loading: true,
      data: {},
      levels: [this.props.level ? this.props.level : "Critical"],
      bookmark: "",
      bookmarks: [],
      bookmarkUpdate: false,
      comments: [],
      documents: [],
      showDetail: "",
      newComment: false,
      newDocument: false,
      justificationRequired: false,
      justificationProvided: false,
      updateOnClose: false,
      selectedFile: "",
      isSelected: false,
      notValidComment: "",
      notValidDocument: "",
      errorLoading: false,
      fields: {},
      informedFields: [],
      notValidField: [],
      fieldChanged: false,
      regions: [],
      types: [],
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
      bookmark: "",
      showDetail: "",
      data: {},
      loading: true,
      comments: [],
      documents: [],
      newComment: false,
      newDocument: false,
      isSelected: false,
      selectedFile: "",
      fieldChanged: false,
      fields: {},
      siteTypeValue: "",
      siteRegionValue: "",
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

  showErrorMessage(target, message) {
    if (target === "comment") {
      this.setState({ notValidComment: message });
      setTimeout(() => {
        this.setState({ notValidComment: "" });
      }, 5000);
    }
    else if (target === "document") {
      this.setState({ notValidDocument: message });
      setTimeout(() => {
        this.setState({ notValidDocument: "" });
      }, 5000);
    }
    else if (target === "fields") {
      this.setState({ notValidField: message });
      setTimeout(() => {
        this.setState({ notValidField: "" });
      }, 5000);
    }
  }

  addNewComment() {
    this.setState({ newComment: true })
  }

  updateComment(target) {
    let input = target.closest(".comment--item").querySelector("textarea");
    let id = parseInt(input.id);
    if (target.firstChild.classList.contains("fa-pencil")) {
      input.disabled = false;
      input.readOnly = false;
      input.focus();
      target.firstChild.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
      if (!input.value.trim()) {
        this.showErrorMessage("comment", "Add comment");
      }
      else {
        this.saveComment(id, input, input.value, target);
      }
    }
  }

  addComment(target) {
    let input = target.closest(".comment--item").querySelector("textarea");
    let comment = input.value;
    let currentDate = new Date().toISOString();
    if (!comment.trim()) {
      this.showErrorMessage("comment", "Add a comment");
    }
    else {
      let body = {
        "SiteCode": this.state.data.SiteCode,
        "Version": this.state.data.Version,
        "Comments": comment,
        "Date": currentDate,
      }

      this.sendRequest(ConfigData.ADD_COMMENT, "POST", body)
        .then(response => response.json())
        .then((data) => {
          if (data?.Success) {
            let commentId = Math.max(...data.Data.map(e => e.Id));
            let cmts = this.state.comments === "noData" ? [] : this.state.comments;
            cmts.push({
              Comments: comment,
              SiteCode: this.state.data.SiteCode,
              Version: this.state.data.Version,
              Id: commentId,
              Date: currentDate,
              Owner: data.Data.find(a => a.Id === commentId).Owner,
            })
            this.setState({ comments: cmts, newComment: false })
          }
        });
      this.loadComments();
    }
  }

  saveComment(id, input, comment, target) {
    let body = this.state.comments.find(a => a.Id === id);
    body.Comments = comment;
    this.sendRequest(ConfigData.UPDATE_COMMENT,"PUT",body)
      .then((data) => {
        if(data?.ok) {
          let reader = data.body.getReader();
          let txt = "";
          let readData = (data) => {
            if(data.done)
              return JSON.parse(txt);
            else{
              txt += new TextDecoder().decode(data.value);
              return reader.read().then(readData);
            }
          }

          reader.read().then(readData).then((data) => {
            this.setState({ comments: data.Data })
          });

          input.disabled = true;
          input.readOnly = true;
          target.firstChild.classList.replace("fa-floppy-disk", "fa-pencil");
        } else { this.showErrorMessage("comment", "Error saving comment") }
      })
    this.loadComments();
  }

  deleteCommentMessage(target) {
    if (!target && this.state.newComment && document.querySelector(".comment--item.new textarea")?.value.trim() === "") {
      this.deleteComment();
    }
    else {
      this.props.updateModalValues("Delete Comment", "Are you sure you want to delete this comment?", "Continue", () => this.deleteComment(target), "Cancel", () => { })
    }
  }

  deleteComment(target) {
    if (target) {
      let input = target.closest(".comment--item").querySelector("textarea");
      let id = input.getAttribute("id");
      let body = id;
      this.sendRequest(ConfigData.DELETE_COMMENT, "DELETE", body)
        .then((data) => {
          if (data?.ok) {
            let cmts = this.state.comments.filter(e => e.Id !== parseInt(id));
            this.setState({ comments: cmts.length > 0 ? cmts : "noData" });
          } else { this.showErrorMessage("comment", "Error deleting comment") }
        });
    }
    else {
      this.setState({ newComment: false });
    }
  }

  addNewDocument() {
    this.setState({ newDocument: true })
  }

  deleteDocumentMessage(target) {
    if (!target && this.state.newDocument && !this.state.isSelected) {
      this.deleteDocument();
    }
    else {
      this.props.updateModalValues("Delete Document", "Are you sure you want to delete this document?", "Continue", () => this.deleteDocument(target), "Cancel", () => { })
    }
  }

  deleteDocument(target) {
    if (target) {
      let doc = target.closest(".document--item");
      let id = doc.getAttribute("doc_id");
      this.sendRequest(ConfigData.DELETE_ATTACHED_FILE + "?justificationId=" + id, "DELETE", "")
        .then((data) => {
          if (data?.ok) {
            let docs = this.state.documents.filter(e => e.Id !== parseInt(id));
            this.setState({ documents: docs.length > 0 ? docs : "noData" });
          } else { this.showErrorMessage("document", "Error deleting document") }
        });
    }
    else {
      this.setState({ newDocument: false, isSelected: false, selectedFile: "", notValidDocument: "" });
    }
  }

  changeHandler(e) {
    let formats = ConfigData.ACCEPTED_DOCUMENT_FORMATS;
    let file = e.currentTarget.closest("input").value;
    let extension = file.substring(file.lastIndexOf('.'), file.length) || file;
    if (formats.includes(extension)) {
      this.setState({ selectedFile: e.target.files[0], isSelected: true });
    }
    else {
      e.currentTarget.closest("#uploadBtn").value = "";
      this.showErrorMessage("document", "File not valid, use a valid format: " + ConfigData.ACCEPTED_DOCUMENT_FORMATS);
    }
  }

  uploadFile(data) {
    let siteCode = this.state.data.SiteCode;
    let version = this.state.data.Version;
    return this.dl.xmlHttpRequest(ConfigData.UPLOAD_ATTACHED_FILE + '?sitecode=' + siteCode + '&version=' + version, data);
  }

  handleSubmission() {
    if (this.state.selectedFile) {
      this.setState({ notValidDocument: "" });
      let formData = new FormData();
      formData.append("Files", this.state.selectedFile, this.state.selectedFile.name);

      return this.uploadFile(formData)
        .then(data => {
          if (data?.Success) {
            let docs = this.state.documents === "noData" ? [] : this.state.documents;
            let newDocs = data.Data.filter(({ Id: id1 }) => !docs.some(({ Id: id2 }) => id2 === id1));
            for (let i in newDocs) {
              let document = newDocs[i];
              let documentId = document.Id;
              let path = document.Path;
              docs.push({
                Id: documentId,
                SiteCode: this.state.data.SiteCode,
                Version: this.state.data.Version,
                Path: path,
                Username: document.Username,
                ImportDate: document.ImportDate
              })
            }
            this.setState({ documents: docs, newDocument: false, isSelected: false, selectedFile: "" })
          }
          else {
            this.showErrorMessage("document", "File upload failed - " + data.Message);
          }
        });
    }
    else {
      this.showErrorMessage("document", "Add a file");
    }
  }

  handleJustRequired() {
    let body = [{
      "SiteCode": this.state.data.SiteCode,
      "VersionId": this.state.data.Version,
      "Justification": !this.state.justificationRequired,
    }];
    this.sendRequest(ConfigData.MARK_AS_JUSTIFICATION_REQUIRED, "POST", body)
      .then((data) => {
        if (data?.ok) {
          if (this.state.justificationRequired)
            this.setState({ justificationRequired: !this.state.justificationRequired, justificationProvided: false })
          else
            this.setState({ justificationRequired: !this.state.justificationRequired })
          this.state.updateOnClose = true;
          return data;
        }
        else {
          this.showErrorMessage("Justification Required", "Update failed");
          return data;
        }
      });
  }

  handleJustProvided() {
    let body = [{
      "SiteCode": this.state.data.SiteCode,
      "VersionId": this.state.data.Version,
      "Justification": !this.state.justificationProvided,
    }];
    this.sendRequest(ConfigData.PROVIDE_JUSTIFICATION, "POST", body)
      .then((data) => {
        if (data?.ok) {
          this.setState({ justificationProvided: !this.state.justificationProvided })
          this.state.updateOnClose = true;
        }
        else {
          this.showErrorMessage("Justification Provided", "Update failed");
          return data;
        }
      });
  }

  renderValuesTable(changes) {
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
                  <span className="me-3"> {title}</span>
                </div>
                <CButton color="link" className="btn-link--dark text-nowrap" onClick={() => this.toggleDetail(changes[i][j].ChangeCategory + title)}>
                  {(this.state.showDetail === changes[i][j].ChangeCategory + title) ? "Hide detail" : "View detail"}
                </CButton>
              </div>
              <CCollapse visible={this.state.showDetail === changes[i][j].ChangeCategory + title}>
                <CCard>
                  {this.state.showDetail && this.renderValuesTable(changes[i][j].ChangedCodesDetail)}
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
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
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

  renderComments() {
    let cmts = [];
    this.state.comments !== "noData" && this.sortComments();
    cmts.push(
      this.state.newComment &&
      <div className="comment--item new" key={"cmtItem_new"}>
        <div className="comment--text">
          <TextareaAutosize
            minRows={3}
            placeholder="Add a comment"
            className="comment--input"
          ></TextareaAutosize>
        </div>
        <div>
          <CButton color="link" className="btn-icon" onClick={(e) => this.addComment(e.currentTarget)}>
            <i className="fa-solid fa-floppy-disk"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteCommentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (this.state.comments !== "noData") {
      for (let i in this.state.comments) {
        cmts.push(
          this.createCommentElement(
            this.state.comments[i].Id
            , this.state.comments[i].Comments
            , this.state.comments[i].Date
            , this.state.comments[i].Owner
            , this.state.comments[i].Edited
            , this.state.comments[i].EditedDate
            , this.state.comments[i].Editedby)
        )
      }
    }
    return (
      <div id="changes_comments">
        {cmts}
        {this.state.comments === "noData" && !this.state.newComment &&
          <em>No comments</em>
        }
      </div>
    )
  }

  createCommentElement(id, comment, date, owner, edited, editeddate, editedby) {
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
        <div className="comment--icons">
          <CButton color="link" className="btn-icon" onClick={(e) => this.updateComment(e.currentTarget)} key={"cmtUpdate_" + id}>
            <i className="fa-solid fa-pencil"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={(e) => this.deleteCommentMessage(e.currentTarget)} key={"cmtDelete_" + id}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
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

  renderDocuments() {
    let docs = [];
    this.state.documents !== "noData" && this.sortDocuments();
    docs.push(
      this.state.newDocument &&
      <div className="document--item new" key={"docItem_new"}>
        <div className="input-file">
          <label htmlFor="uploadBtn">
            Select file
          </label>
          <input id="uploadBtn" type="file" name="Files" onChange={(e) => this.changeHandler(e)} accept={ConfigData.ACCEPTED_DOCUMENT_FORMATS} />
          {this.state.isSelected ? (
            <input id="uploadFile" placeholder={this.state.selectedFile.name} disabled="disabled" />
          ) : (<input id="uploadFile" placeholder="No file selected" disabled="disabled" />)}
        </div>
        <div className="document--icons">
          <CButton color="link" className="btn-icon" onClick={() => this.handleSubmission()}>
            <i className="fa-solid fa-floppy-disk"></i>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={() => this.deleteDocumentMessage()}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
    if (this.state.documents !== "noData") {
      for (let i in this.state.documents) {
        docs.push(
          this.createDocumentElement(
            this.state.documents[i].Id
            , this.state.documents[i].Path
            , this.state.documents[i].ImportDate
            , this.state.documents[i].Username)
        )
      }
    }
    return (
      <div id="changes_documents">
        {docs}
        {this.state.documents === "noData" && !this.state.newDocument &&
          <em>No documents</em>
        }
      </div>
    )
  }

  createDocumentElement(id, path, date, user) {
    return (
      <div className="document--item" key={"docItem_" + id} id={"docItem_" + id} doc_id={id}>
        <div className="my-auto document--text">
          <CImage src={justificationProvidedImg} className="ico--md me-3"></CImage>
          <span>{path.replace(/^.*[\\\/]/, '')}</span>
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
          <CButton color="link" className="btn-link--dark">
            <a href={path} target="_blank">View</a>
          </CButton>
          <CButton color="link" className="btn-icon" onClick={(e) => this.deleteDocumentMessage(e.currentTarget)}>
            <i className="fa-regular fa-trash-can"></i>
          </CButton>
        </div>
      </div>
    )
  }

  renderAttachments() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 4}>
        <CRow className="py-3">
          <CCol className="mb-3" xs={12} lg={6}>
            {this.errorLoadingDocuments ?
              <CAlert color="danger">Error loading documents</CAlert>
              :
              <CCard className="document--list">
                {this.state.notValidDocument &&
                  <CAlert color="danger">
                    {this.state.notValidDocument}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Attached documents</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => this.addNewDocument()}>Add Document</CButton>
                </div>
                {this.renderDocuments()}
              </CCard>
            }
          </CCol>
          <CCol className="mb-3" xs={12} lg={6}>
            {this.errorLoadingComments ?
              <CAlert color="danger">Error loading comments</CAlert>
              :
              <CCard className="comment--list">
                {this.state.notValidComment &&
                  <CAlert color="danger">
                    {this.state.notValidComment}
                  </CAlert>
                }
                <div className="d-flex justify-content-between align-items-center pb-2">
                  <b>Comments</b>
                  <CButton color="link" className="btn-link--dark" onClick={() => this.addNewComment()}>Add Comment</CButton>
                </div>
                {this.renderComments()}
              </CCard>
            }
          </CCol>
          <CCol className="d-flex">
            <div className="checkbox">
              <input type="checkbox" className="input-checkbox" id="modal_justification_req"
                onClick={() => this.props.updateModalValues("Changes", `This will ${this.state.justificationRequired ? "unmark" : "mark"} change as justification required`, "Continue", () => this.handleJustRequired(), "Cancel", () => { })}
                checked={this.state.justificationRequired}
                readOnly
              />
              <label htmlFor="modal_justification_req" className="input-label">Justification required</label>
            </div>
            <div className="checkbox" disabled={(this.state.justificationRequired ? false : true)}>
              <input type="checkbox" className="input-checkbox" id="modal_justification_prov"
                onClick={() => this.props.updateModalValues("Changes", `This will ${this.state.justificationProvided ? "unmark" : "mark"} change as justification provided`, "Continue", () => this.handleJustProvided(), "Cancel", () => { })}
                checked={this.state.justificationProvided}
                readOnly
              />
              <label htmlFor="modal_justification_prov" className="input-label" disabled={(this.state.justificationRequired ? false : true)}>Justification provided</label>
            </div>
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

  renderFields() {
    return (
      <CTabPane role="tabpanel" aria-labelledby="profile-tab" visible={this.state.activeKey === 3}>
        {this.state.data.Status === "Pending" ?
          <CRow className="p-3">
            <CCol>
              <p className="text-center mt-5">Accept or reject site changes before editing the site</p>
            </CCol>
          </CRow>
          :
          <CForm id="siteedition_form">
            <CRow className="p-3">
              {(this.state.notValidField.length > 0) &&
                <CAlert color="danger">
                  {this.state.notValidField}
                </CAlert>
              }
              {this.errorLoadingFields ?
                <>
                  <CAlert color="danger">Error loading fields data</CAlert>
                </>
                : this.createFieldElement()
              }
            </CRow>
          </CForm>
        }
      </CTabPane>
    )
  }

  createFieldElement() {
    let fields = [];
    let data = this.state.fields;
    data = JSON.parse(JSON.stringify(data, ["SiteCode", "SiteName", "SiteType", "BioRegion", "Area", "Length", "CentreY", "CentreX"]));
    for (let i in Object.keys(data)) {
      let field = Object.keys(data)[i]
      let id = "field_" + field;
      let value = data[field];
      let options;
      let label;
      let placeholder;
      let name = field;
      let original = this.state.fields["Original" + field];
      switch (field) {
        case "SiteCode":
          label = "Site Code";
          placeholder = "Site code";
          break;
        case "SiteName":
          label = "Site Name";
          placeholder = "Site name";
          break;
        case "SiteType":
          label = "Site Type";
          placeholder = "Select site type";
          options = this.state.types.map(x => x = { label: x.Classification, value: x.Code });
          value = options.find(y => y.value === value);
          this.siteTypeDefault = value;
          if (this.state.siteTypeValue === "") {
            this.setState({ siteTypeValue: value });
          }
          original = original && this.state.types.find(y => y.Code === original).Classification;
          break;
        case "BioRegion":
          label = "Biogeographycal Region";
          placeholder = "Select a region";
          options = this.state.regions.map(x => x = { label: x.RefBioGeoName, value: x.Code });
          value = value.map(x => options.find(y => y.value === x));
          this.siteRegionDefault = value;
          if (this.state.siteRegionValue === "") {
            this.setState({ siteRegionValue: value });
          }
          original = original && original.map(x => this.state.regions.find(y => y.Code === x).RefBioGeoName).join(", ");
          break;
        case "Area":
          label = "Area";
          placeholder = "Site area";
          break;
        case "Length":
          label = "Length";
          placeholder = "Site length";
          break;
        case "CentreY":
          label = "Latitude";
          placeholder = "Site centre location latitude";
          break;
        case "CentreX":
          label = "Longitude";
          placeholder = "Site centre location longitude";
          break;
      }
      fields.push(
        <CCol xs={12} md={12} lg={6} key={"fd_" + field} className="mb-4">
          {field === "SiteCode" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                disabled={true}
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "SiteName" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "SiteType" &&
            <>
              <label>{label}</label>
              <Select
                id={id}
                name={name}
                className="multi-select"
                classNamePrefix="multi-select"
                placeholder={placeholder}
                value={this.state.siteTypeValue}
                options={options}
                onChange={(e) => this.onChangeField(e, name)}
              />
            </>
          }
          {field === "BioRegion" &&
            <>
              <label>{label}</label>
              <Select
                id={id}
                name={name}
                className="multi-select"
                classNamePrefix="multi-select"
                placeholder={placeholder}
                value={this.state.siteRegionValue}
                options={options}
                isMulti={true}
                closeMenuOnSelect={false}
                onChange={(e) => this.onChangeField(e, name)}
              />
            </>
          }
          {field === "Area" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "Length" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "CentreX" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {field === "CentreY" &&
            <>
              <label>{label}</label>
              <CFormInput
                id={id}
                name={name}
                type="number"
                defaultValue={value}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => this.onChangeField(e)}
              />
            </>
          }
          {original?.toString() &&
            <div className="original-field">
              <i className="fa-solid fa-pen-to-square"></i><span>{original}</span>
            </div>
          }
        </CCol>
      )
    }
    return fields;
  }

  fieldValidator() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    let data = JSON.parse(JSON.stringify(body, this.state.informedFields));
    // TODO discuss how to comunicate to the user null fields
    this.state.notValidField = [];
    for (let i in Object.keys(data)) {
      let field = Object.keys(data)[i]
      let value = data[field];
      if (!value)
        this.state.notValidField.push(field);
    }
    this.state.notValidField.forEach((e) => {
      let field = document.getElementById("field_" + e)
      field.querySelector(".multi-select__control") ?
        field.querySelector(".multi-select__control").classList.add('invalidField')
        : field.classList.add('invalidField')
    });
    this.state.notValidField.length > 0 && this.showErrorMessage("fields", "Empty fields are not allowed");
    return this.state.notValidField.length == 0;
  }

  onChangeField(e, field) {
    if (field === "SiteType") {
      this.setState({ siteTypeValue: e })
    }
    else if (field === "BioRegion") {
      this.setState({ siteRegionValue: e })
    }
    if (e.target)
      e.target.classList.contains('invalidField') ?
        e.target.classList.remove('invalidField')
        : {}
    this.checkForChanges(e);
  }

  checkUnsavedChanges() {
    return this.state.loading === false && ((this.state.newComment && document.querySelector(".comment--item.new textarea")?.value.trim() !== "") || (this.state.newDocument && this.state.isSelected) || (this.state.comments !== "noData" && document.querySelectorAll(".comment--item:not(.new) textarea[disabled]").length !== this.state.comments.length));
  }

  warningUnsavedChanges(activeKey) {
    if (this.checkUnsavedChanges() && this.state.activeKey === 4) {
      this.props.updateModalValues("Documents & Comments", "There are unsaved changes. Do you want to continue?",
        "Continue", () => this.cleanUnsavedChanges(activeKey),
        "Cancel", () => { });
    }
    else if (this.state.fieldChanged && this.state.activeKey === 3) {
      this.props.updateModalValues("Edit Fields", "There are unsaved changes. Do you want to continue?",
        "Continue", () => this.cleanFields(activeKey),
        "Cancel", () => { });
    }
    else {
      this.cleanUnsavedChanges(activeKey);
    }
  }

  messageBeforeClose(action, keepOpen) {
    this.props.updateModalValues(this.state.data.SiteCode, "There are unsaved changes. Do you want to continue?", "Continue", action, "Cancel", () => { }, keepOpen);
  }

  cleanFields(activeKey) {
    let fields = this.getBody();
    delete fields.Version;
    for (let i in fields) {
      document.getElementsByName(i)[0].value = this.state.fields[i];
    }
    if (activeKey) {
      this.setActiveKey(activeKey);
    }
    this.setState({ siteTypeValue: this.siteTypeDefault, siteRegionValue: this.siteRegionDefault, fieldChanged: false });
  }

  cleanUnsavedChanges(activeKey) {
    this.cleanDocumentsAndComments();
    if (activeKey) {
      this.setActiveKey(activeKey);
      document.querySelectorAll(".comment--item").forEach((i) => {
        let input = i.querySelector("textarea");
        if (!input.disabled) {
          input.value = input.defaultValue;
          input.disabled = true;
          i.querySelector("i.fa-floppy-disk").classList.replace("fa-floppy-disk", "fa-pencil");
        }
      });
    }
  }

  cleanDocumentsAndComments() {
    this.deleteDocument();
    this.deleteComment();
  }

  checkForChanges(e) {
    let body = this.getBody();
    let errorMargin = 0.00000001;
    if (this.state.fields.SiteName != body.SiteName
      || this.state.fields.Area != body.Area
      || this.state.fields.Length != body.Length
      || (Math.abs(this.state.fields.CentreX - body.CentreX) > errorMargin)
      || (Math.abs(this.state.fields.CentreY - body.CentreY) > errorMargin)
      || (Array.isArray(e) && this.state.fields.BioRegion.sort().toString() !== e.map(b => b.value).sort().toString())
      || e.value ? this.state.fields.SiteType !== e.value : false
    ) {
      this.setState({ fieldChanged: true });
      return true;
    } else {
      this.setState({ fieldChanged: false });
      return false;
    }
  }

  getBody() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    body.BioRegion = Array.from(document.getElementsByName("BioRegion")).map(el => el.value).sort().toString();
    body.Area = body.Area == "" ? null : body.Area;
    body.Length = body.Length == "" ? null : body.Length;
    body.CentreX = body.CentreX == "" ? null : body.CentreX;
    body.CentreY = body.CentreY == "" ? null : body.CentreY;
    body.Version = this.props.version;
    body.SiteCode = this.props.item;

    return body;
  }

  saveChangesModal() {
    let body = this.getBody();
    console.log(body)
    if (this.fieldValidator()) {
      this.props.updateModalValues("Save changes", "This will save the site changes", "Continue", () => this.saveChanges(body), "Cancel", () => { });
    }
  }

  saveChanges(body) {
    body.JustificationProvided = this.state.justificationProvided;
    body.JustificationRequired = this.state.justificationRequired;
    this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
      .then((data) => {
        if(data?.ok) {
          body = {
            ...body,
            BioRegion: body.BioRegion.split(",").map(Number),
          }
          let newFields = Object.keys(this.state.fields).filter(a => !body.hasOwnProperty(a));
          for (let i in newFields) {
            let field = newFields[i];
            let value = this.state.fields[field];
            let ref = field.replace('Original', '');
            if (field === "OriginalBioRegion") {
              if (!value && JSON.stringify(body[ref]) !== JSON.stringify(this.state.fields[ref])) {
                value = this.state.fields[ref];
              }
              else if (value && JSON.stringify(body[ref]) === JSON.stringify(value)) {
                value = null;
              }
            }
            else {
              if (!value?.toString() && body[ref] !== this.state.fields[ref]) {
                value = this.state.fields[ref];
              }
              else if (value?.toString() && body[ref] === value) {
                value = null;
              }
            }
            body[field] = value;
          }
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
              {data.SiteCode} - {data.Name}
              {data.Status !== "Pending" &&
                <>
                  <span className="mx-2"></span>
                  <span className={"badge status--" + data.Status.toLowerCase()}>{data.Status}</span>
                </>
              }
            </CModalTitle>
            <CCloseButton onClick={() => this.closeModal()} />
          </CModalHeader>
          <CModalBody>
            <CAlert color="primary" className="d-flex align-items-center" visible={this.state.justificationProvided || this.state.justificationRequired}>
              {this.state.justificationRequired && !this.state.justificationProvided &&
                <>
                  <CImage src={justificationRequiredImg} className="ico--md me-3"></CImage>
                  Justification required
                </>
              }
              {this.state.justificationProvided &&
                <>
                  <CImage src={justificationProvidedImg} className="ico--md me-3"></CImage>
                  Justification provided
                </>
              }
            </CAlert>
            <CNav variant="tabs" role="tablist">
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={this.state.activeKey === 1}
                  onClick={() => this.warningUnsavedChanges(1)}
                >
                  Change Information
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={this.state.activeKey === 2}
                  onClick={() => this.warningUnsavedChanges(2)}
                >
                  Geometry
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={this.state.activeKey === 3}
                  onClick={() => this.warningUnsavedChanges(3)}
                >
                  Edit Fields
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  href="javascript:void(0);"
                  active={this.state.activeKey === 4}
                  onClick={() => this.warningUnsavedChanges(4)}
                >
                  Documents & Comments
                </CNavLink>
              </CNavItem>
              <CButton color="link" className="ms-auto" onClick={() => this.copyLink()}>
                {this.state.showCopyTooltip ?
                  <CTooltip
                    content="Link copied"
                    trigger="focus"
                    visible={true}
                  >
                    <span><i className="far fa-copy me-2"></i>Share site</span>
                  </CTooltip>
                  :
                  <><i className="far fa-copy me-2"></i>Share site</>
                }
              </CButton>
            </CNav>
            <CTabContent>
              {this.renderChanges()}
              {this.renderAttachments()}
              {this.renderGeometry()}
              {this.renderFields()}
            </CTabContent>
          </CModalBody>
          <CModalFooter>
            <div className="d-flex w-100 justify-content-between">
              {data.Status === 'Pending' && <CButton disabled={this.changingStatus} color="secondary" onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.rejectChangesModal(true), true) : this.rejectChangesModal()}>Reject Changes</CButton>}
              {data.Status === 'Pending' && <CButton disabled={this.changingStatus} color="primary" onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.acceptChangesModal(true), true) : this.acceptChangesModal()}>Accept Changes</CButton>}
              {data.Status !== 'Pending' && this.state.activeKey !== 3 && <CButton disabled={this.changingStatus} color="primary" className="ms-auto" onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.backToPendingModal(true), true) : this.backToPendingModal()}>Back to Pending</CButton>}
              {data.Status !== 'Pending' && this.state.activeKey === 3 &&
                <>
                  <CButton color="secondary" disabled={this.state.updatingData} onClick={() => this.closeModal()}>Cancel</CButton>
                  <CButton color="primary" disabled={this.state.updatingData || !this.state.fieldChanged} onClick={() => this.checkUnsavedChanges() ? this.messageBeforeClose(() => this.saveChangesModal(true), true) : this.saveChangesModal()}>
                    {this.state.updatingData && <CSpinner size="sm" />}
                    {this.state.updatingData ? " Saving" : "Save"}
                  </CButton>
                </>
              }
            </div>
          </CModalFooter>
        </>
    )
  }

  copyLink() {
    let link = window.location.origin + "/#/sharesite?sitecode=" + this.props.item + "&version=" + this.props.version;
    navigator.clipboard.writeText(link);
    this.setState({ showCopyTooltip: true });
    setTimeout(() => {
      this.setState({ showCopyTooltip: false });
    }, 3000);
  }

  renderData() {
    if (!this.isLoadingData) {
      this.loadData();
    }
    if (!this.isLoadingComments) {
      this.loadComments();
    }
    if (!this.isLoadingDocuments) {
      this.loadDocuments();
    }
    if (!this.isLoadingFields) {
      this.loadFields();
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
    if (this.state.activeKey === 4 && this.checkUnsavedChanges()) {
      this.props.updateModalValues("Documents & Comments", "There are unsaved changes. Do you want to continue?",
        "Continue", () => this.close(),
        "Cancel", () => { });
    }
    else if (this.state.activeKey === 3 && this.state.fieldChanged) {
      this.props.updateModalValues("Edit Fields", "There are unsaved changes. Do you want to continue?",
        "Continue", () => this.close(),
        "Cancel", () => { });
    } else {
      this.close();
    }
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
      this.dl.fetch(ConfigData.SITECHANGES_DETAIL + `siteCode=${this.props.item}&version=${this.props.version}`)
        .then(response => {
          if (response.status === 200)
            return response.json();
          else
            return this.setState({ errorLoading: true, loading: false });
        })
        .then(data => {
          if (!data.Success)
            this.setState({ errorLoading: true, loading: false });
          else (data.Data.SiteCode === this.props.item && Object.keys(this.state.data).length === 0)
          this.setState({ data: data.Data, loading: false, justificationRequired: data.Data?.JustificationRequired, justificationProvided: data.Data?.JustificationProvided, activeKey: this.props.activeKey ? this.props.activeKey : this.state.activeKey })
        });
    }
  }

  loadComments() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isLoadingComments = true;
      this.dl.fetch(ConfigData.GET_SITE_COMMENTS + `siteCode=${this.props.item}&version=${this.props.version}`)
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
            if (data.Data[0]?.SiteCode === this.props.item && (this.state.comments.length === 0 || this.state.comments === "noData"))
              this.setState({ comments: data.Data });
          }
          else {
            this.setState({ comments: "noData" });
          }
        });
    }
  }

  loadDocuments() {
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)) {
      this.isLoadingDocuments = true;
      this.dl.fetch(ConfigData.GET_ATTACHED_FILES + `siteCode=${this.props.item}&version=${this.props.version}`)
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
            if (data.Data[0]?.SiteCode === this.props.item && (this.state.documents.length === 0 || this.state.documents === "noData"))
              this.setState({ documents: data.Data });
          }
          else {
            this.setState({ documents: "noData" });
          }
        });
    }
  }

  loadFields() {
    if (this.isVisible() && (this.state.fields?.SiteCode !== this.props.item)) {
      this.isLoadingFields = true;
      this.dl.fetch(ConfigData.SITEDETAIL_GET + "?siteCode=" + this.props.item)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            this.errorLoadingFields = true;
          }
        })
        .then(data => {
          if (!data.Success) {
            this.errorLoadingFields = true;
          } else (data.Data.SiteCode === this.props.item && Object.keys(this.state.data).length === 0); {
            let informed = [];
            let a = JSON.parse(JSON.stringify(data.Data, ["SiteName", "BioRegion", "Area", "Length", "CentreY", "CentreX"]));
            Object.keys(a).forEach(key => {
              if (a[key]?.toString() != '' && a[key]?.toString() != undefined)
                informed.push(key);
            })
            this.setState({ fields: data.Data, informedFields: informed });
          }
        });
    }
    if (this.isVisible() && this.state.regions.length === 0) {
      this.isLoadingFields = true;
      this.dl.fetch(ConfigData.BIOREGIONS_GET)
        .then(response => {
          if (response.status === 200)
            return response.json();
          else {
            this.errorLoadingFields = true;
          }
        })
        .then(data => {
          if (!data.Success)
            this.errorLoadingFields = true;
          else
            this.setState({ regions: data.Data });
        });
    }

    if (this.isVisible() && this.state.types.length === 0) {
      this.isLoadingFields = true;
      this.dl.fetch(ConfigData.SITETYPES_GET)
        .then(response => {
          if (response.status === 200)
            return response.json();
          else {
            this.errorLoadingFields = true;
          }
        })
        .then(data => {
          if (!data.Success)
            this.errorLoadingFields = true;
          else
            this.setState({ types: data.Data });
        });
    }
  }

  resetLoading() {
    this.isLoadingComments = false;
    this.isLoadingDocuments = false;
    this.isLoadingData = false;
    this.isLoadingFields = false;
  }

  acceptChangesModal(clean) {
    this.changingStatus = true;
    if (clean) {
      this.cleanUnsavedChanges();
    }
    this.resetLoading();
    this.props.updateModalValues("Accept Changes", "This will accept all the site changes", "Continue", () => this.acceptChanges(), "Cancel", () => { this.changingStatus = false });
  }

  acceptChanges() {
    this.props.accept()
      .then((data) => {
        if (data?.ok) {
          this.changingStatus = false;
          this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
        }
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
        if (data?.ok) {
          this.changingStatus = false;
          this.setState({ data: {}, fields: {}, loading: true, siteTypeValue: "", siteRegionValue: "" });
        }
      });
  }

  backToPendingModal(clean) {
    this.changingStatus = true;
    if (clean) {
      this.cleanUnsavedChanges();
    }
    this.resetLoading();
    this.props.updateModalValues("Back to Pending", "This will set the changes back to Pending", "Continue", () => this.setBackToPending(), "Cancel", () => { this.changingStatus = false });
  }

  setBackToPending() {
    this.props.backToPending()
      .then((data) => {
        if (data?.ok) {
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
