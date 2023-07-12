import React, { Component } from 'react';
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CAlert
} from '@coreui/react'

export class ConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.close = this.props.modalValues.close;
  }

  primaryFunction() {
    this.props.modalValues.primaryButton.function();
    if(!this.props.modalValues.keepOpen){
      this.close();
    }
  }

  secondaryFunction() {
    this.props.modalValues.secondaryButton.function();
    this.close();
  }

  closeFunction() {
    this.close();
  }

  render() {
    let modal = this.props.modalValues;
    return (
      <CModal alignment="center" visible={modal.visibility} backdrop="static" onClose={()=>this.closeFunction()} className="modal--confirmation">
        <CModalHeader onClose={()=>this.closeFunction()}>
          <CModalTitle>{modal.title}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {modal.message?.text && <CAlert color={modal.message.type} dismissible={modal.message.canClose} onClose={() =>modal.closeMessage}>{modal.message.text}</CAlert>}
          {modal.text}
        </CModalBody>
        <CModalFooter className={modal.secondaryButton ? "justify-content-between" : "justify-content-end"}>
          {modal.secondaryButton &&
            <CButton color="secondary" onClick={() => this.secondaryFunction()}>
              {modal.secondaryButton.text}
            </CButton>
          }
          {modal.primaryButton &&
            <CButton color="primary" onClick={() => this.primaryFunction()}>
              {modal.primaryButton.text}
            </CButton>
          }
        </CModalFooter>
      </CModal>
    )
  }
}
