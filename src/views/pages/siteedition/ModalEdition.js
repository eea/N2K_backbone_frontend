import ConfigData from '../../../config.json';
import React, { Component, useState } from 'react';
import {
  CButton,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTabContent,
  CTabPane,
  CAlert,
  CForm,
  CFormInput,
  CFormSelect
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';

export class ModalEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1, 
      loading: true, 
      data: {}, 
      notValidField: "",
      modalValues : {
        visibility: false,
        close: () => {
          this.setState({
            modalValues: {
              visibility: false
            }
          });
        }
      }
    };
  }

  updateModalValues(title, text, primaryButtonText, primaryButtonFunction, secondaryButtonText, secondaryButtonFunction) {
    this.setState({
      modalValues : {
        visibility: true,
        title: title,
        text: text,
        primaryButton: (
          primaryButtonText && primaryButtonFunction ? {
            text: primaryButtonText,
            function: () => primaryButtonFunction(),
          }
          : ''
        ),
        secondaryButton: (
          secondaryButtonText && secondaryButtonFunction ? {
            text: secondaryButtonText,
            function: () => secondaryButtonFunction(),
          }
          : ''
        ),
      }
    });
  }

  close(refresh){
    this.props.close(refresh);
  }

  isVisible(){
    return this.props.visible;
  }

  showErrorMessage(target, message) {
    this.setState({notValidField: message});
    setTimeout(() => {
      this.setState({notValidField: ""});
    }, 5000);
  }

  renderFields(data){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CForm>
          <CRow className="p-3">
            {this.state.notValidField &&
              <CAlert color="danger">
                {this.state.notValidField}
              </CAlert>
            }
            {this.createFieldElement()}
          </CRow>
        </CForm>
      </CTabPane>
    )
  }

  createFieldElement(){
    let fields = [];
    //let data = this.state.data;
    let data = {"SiteCode":"DE1011401","Name":"SPA Östliche Deutsche Bucht","Type":"Habitat Directive Sites", "BioReg":"Atlantic","Area":"31.4","Length":"12","CentreX":"00.0","CentreY":"00.0"};
    for(let i in Object.keys(data)){
      let field = Object.keys(data)[i]
      let value = data[field];
      let disabled = false;
      let type = "text";
      let options = [];
      let label;
      let placeholder;
      switch (field) {
        case "SiteCode":
          label = "Site Code";
          placeholder = "Site code";
          disabled = true;
          break;
        case "Name":
          label = "Site Name";
          placeholder = "Site name";
          break;
        case "Type":
          label = "Site Type";
          placeholder = "Select site type";
          options = [
            "Habitats Directive Sites",
            "Habitats Directive Sites"
          ]
          type = "select"
          break;
        case "BioReg":
          label = "Biogeographycal region";
          placeholder = "Select a region";
          options = [
            "Alpine",
            "Atlantic",
            "Black Sea",
            "Boreal",
            "Continental",
            "Macaronesian",
            "Mediterranean",
            "Pannonian",
            "Steppic"
          ]
          type = "select"
          break;
        case "Area":
          label = "Area";
          placeholder = "Site area";
          type = "number"
          break;
        case "Length":
          label = "Length";
          placeholder = "Site length";
          type = "number"
          break;
        case "CentreX":
          label = "Centre X";
          placeholder = "Site centre location longitude";
          type = "number"
          break;
        case "CentreY":
          label = "Centre Y";
          placeholder = "Site centre location latitude";
          type = "number"
          break;
      }
      fields.push(
        <CCol xs={12} md={12} lg={6} key={"fd_"+field} className="mb-4">
          <label>{label}</label>
          {type === "select" &&
            <CFormSelect
              id={"field_"+field}
              defaultValue={value}
              placeholder={placeholder}
            >
              {options.map((element, index) => <option key={index}>{element}</option>) }
            </CFormSelect>
          }
          {type === "text" &&
            <CFormInput
              id={"field_"+i}
              type="text"
              defaultValue={value}
              placeholder={placeholder}
              autoComplete="off"
              disabled={disabled}
            />
          }
          {type === "number" &&
            <CFormInput
              id={"field_"+i}
              type="number"
              defaultValue={value}
              placeholder={placeholder}
              autoComplete="off"
            />
          }
        </CCol>
      )
    }
    return fields;
  }

  renderModal() {
    let data = this.state.data;
    return(
      <>
        <CModalHeader>
          <CModalTitle>{data.SiteCode} - {data.Name}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CNav variant="tabs" role="tablist">
          <CNavItem>
              <CNavLink
                href="javascript:void(0);"
                active={this.state.activeKey === 1}
                onClick={() => this.setActiveKey(1)}
              >
                Edit fields
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            {this.renderFields(data)}
          </CTabContent>
        </CModalBody>
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            <CButton color="secondary" onClick={()=>this.updateModalValues("Cancel changes", "This will cancel the site changes", "Continue", ()=>this.cancelChanges(), "Cancel", ()=>{})}>Cancel</CButton>
            <CButton color="primary" onClick={()=>this.updateModalValues("Save changes", "This will save the site changes", "Continue", ()=>this.saveChanges(), "Cancel", ()=>{})}>Save</CButton>
          </div>
        </CModalFooter>
      </>
    )
  }

  renderData(){
    this.loadData();

    let contents = this.state.loading
      ? <div className="loading-container"><em>Loading...</em></div>
      : this.renderModal();

    return (
      <>
        {contents}
      </>
    )
  }

  render() {
    return(
      <>
        <CModal scrollable size="xl" visible={this.isVisible()} onClose={this.close.bind(this)}>
          {this.renderData()}
        </CModal>
        <ConfirmationModal modalValues={this.state.modalValues}/>
      </>
    )
  }

  loadData(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      fetch(ConfigData.SITECHANGES_DETAIL+`siteCode=${this.props.item}&version=${this.props.version}`) //add correct URL
      .then(response => response.json())
      .then(data =>
        this.setState({data: data.Data, loading: false})
      );
    }
  }

  saveChanges(){
    fetch(ConfigData.SITECHANGES_DETAIL+`siteCode=${this.props.item}&version=${this.props.version}`) //add correct URL
    .then((data) => {
      if(data?.ok)
        this.close(true);
    });
  }

  cancelChanges(){
    this.close(true);
  }

  sendRequest(url,method,body,path){
    const options = {
      method: method,
      headers: {
      'Content-Type': path? 'multipart/form-data' :'application/json',
      },
      body: JSON.stringify(body),
    };
    return fetch(url, options)
  }
}
