import React, {useCallback, useEffect, useState} from 'react'

import {
    CButton,    
  } from '@coreui/react'

export class CommentsModal extends Component {    
    addComment() {
        this.setState({newComment: true})
    }
        
    updateComment(e){
        let input = e.currentTarget.closest(".comment--item").querySelector("input");
        if (e.currentTarget.firstChild.classList.contains("fa-pencil")) {
            input.disabled = false;
            input.focus();
            e.currentTarget.firstChild.classList.replace("fa-pencil", "fa-floppy-disk");
        } else {
            input.disabled = true;
            e.currentTarget.firstChild.classList.replace("fa-floppy-disk", "fa-pencil");
            // Update comment
        }
    }
            
    deleteComment(e){
        // Delete comment
    }
    
    render() {        
        <CCol xs={12} lg={6}>
            <CCard className="comment--list">
              <div className="d-flex justify-content-between align-items-center pb-2">
                <b>Comments</b>
                <CButton color="link" className="btn-link--dark" onClick={() => this.addComment()}>Add comment</CButton>
              </div>
              {this.state.newComment &&
                <div className="comment--item new">
                  <div className="comment--text">
                    <input type="text" placeholder="Add comment"/>
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
              <div className="comment--item">
                <div className="comment--text">
                  <input type="text" placeholder="Add comment" defaultValue="New to upload supporting emails" disabled/>
                </div>
                <div>
                  <div className="btn-icon" onClick={(e) => this.updateComment(e)}>
                    <i className="fa-solid fa-pencil"></i>
                  </div>
                  <div className="btn-icon" onClick={(e) => this.deleteComment(e)}>
                    <i className="fa-regular fa-trash-can"></i>
                  </div>
                </div>
              </div>
              <div className="comment--item">
                <div className="comment--text">
                  <input type="text" placeholder="Add comment" defaultValue="Spatial file needed to approve change" disabled/>
                </div>
                <div>
                  <div className="btn-icon" onClick={(e) => this.updateComment(e)}>
                    <i className="fa-solid fa-pencil"></i>
                  </div>
                  <div className="btn-icon" onClick={(e) => this.deleteComment(e)}>
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
  
export default CommentsModal
