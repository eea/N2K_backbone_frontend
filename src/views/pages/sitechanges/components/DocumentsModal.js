import React, { Component } from 'react';
import {
  CButton,  
} from '@coreui/react'

import justificationprovided from './../../../../assets/images/file-text.svg'

export class DocumentsModal extends Component {   
    addDocument() {
        this.setState({newDocument: true})
      }
    
      deleteDocument(e){
        // Delete document
      }
    
      uploadFile(e) {
        document.getElementById("uploadFile").value = e.currentTarget.value;
      } 

    render(){
        <CCol xs={12} lg={6}>
            <CCard className="document--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Attached documents</b>
                <CButton color="link" className="btn-link--dark" onClick={() => this.addDocument()}>Add document</CButton>
              </div>
              {this.state.newDocument &&
                <div className="document--item new">
                  <div className="input-file">
                    <label htmlFor="uploadBtn">
                      Select file
                    </label>
                    <input id="uploadBtn" type="file" onChange={(e) => this.uploadFile(e)}/>
                    <input id="uploadFile" placeholder="No file selected" disabled="disabled" />
                  </div>
                  <div>
                    <div className="btn-icon">
                      <i className="fa-solid fa-floppy-disk"></i>
                    </div>
                    <div className="btn-icon">
                      <i className="fa-regular fa-trash-can"></i>
                    </div>
                  </div>
                </div>
              }
              <div className="document--item">
                <div className="my-auto">
                  <CImage src={justificationprovided} className="ico--md me-3"></CImage>
                  <span>File name</span>
                </div>
                <div>
                  <CButton color="link" className="btn-link--dark">View</CButton>
                  <div className="btn-icon" onClick={() => this.deleteDocument()}>
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
              <div className="document--item">
                <div className="my-auto">
                  <CImage src={justificationprovided} className="ico--md me-3"></CImage>
                  <span>File name</span>
                </div>
                <div>
                  <CButton color="link" className="btn-link--dark">View</CButton>
                  <div className="btn-icon">
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
            </CCard>
            <CPagination aria-label="Pagination" className="pt-3">
              <CPaginationItem aria-label="Previous">
                  <i className="fa-solid fa-angle-left"></i>
              </CPaginationItem>
              <CPaginationItem>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem aria-label="Next">
                <i className="fa-solid fa-angle-right"></i>
              </CPaginationItem>
            </CPagination>
          </CCol> 
    }
}

export default DocumentsModal