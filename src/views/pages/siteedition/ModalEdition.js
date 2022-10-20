import ConfigData from '../../../config.json';
import React, { Component, useState } from 'react';
import Select from 'react-select';
import {
  CButton,
  CSpinner,
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
import {DataLoader} from '../../../components/DataLoader';

export class ModalEdition extends Component {
  constructor(props) {
    super(props);
    this.dl = new(DataLoader);
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
      },
      updatingData: false
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
    this.state.data = {};
  }

  isVisible(){
    return this.props.visible;
  }

  showErrorMessage(message) {
    this.setState({notValidField: message});
    setTimeout(() => {
      this.setState({notValidField: ""});
    }, 5000);
  }

  renderFields(){
    return(
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={this.state.activeKey === 1}>
        <CForm id="siteedition_form">
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
    let data = this.state.data;
    data = JSON.parse(JSON.stringify( data, ["SiteCode","SiteName","SiteType","BioRegion","Area","Length","CentreX","CentreY"]));
    for(let i in Object.keys(data)){
      let field = Object.keys(data)[i]
      let id = "field_" + field;
      let value = data[field];
      let options;
      let label;
      let placeholder;
      let name = field;
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
          options = this.props.types.map(x => x = {label:x.Classification, value:x.Code});
          value = options.find(y => y.value === value);
          break;
        case "BioRegion":
          label = "Biogeographycal region";
          placeholder = "Select a region";
          options = this.props.regions.map(x => x = {label:x.RefBioGeoName, value:x.Code});
          value = value.map(x => options.find(y => y.value === x));
          break;
        case "Area":
          label = "Area";
          placeholder = "Site area";
          break;
        case "Length":
          label = "Length";
          placeholder = "Site length";
          break;
        case "CentreX":
          label = "Centre X";
          placeholder = "Site centre location longitude";
          break;
        case "CentreY":
          label = "Centre Y";
          placeholder = "Site centre location latitude";
          break;
      }
      fields.push(
        <CCol xs={12} md={12} lg={6} key={"fd_"+field} className="mb-4">
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
                defaultValue={value}
                options={options}
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
                defaultValue={value}
                options={options}
                isMulti={true}
                closeMenuOnSelect={false}
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
              />
            </>
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
          <CModalTitle>{data.SiteCode} - {data.SiteName}</CModalTitle>
        </CModalHeader>
        <CModalBody >
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
            {this.renderFields()}
          </CTabContent>
        </CModalBody>
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            <CButton color="secondary" disabled= {this.state.updatingData} onClick={()=>this.cancelChanges()}>Cancel</CButton>
            <CButton color="primary" disabled= {this.state.updatingData} onClick={()=>this.updateModalValues("Save changes", "This will save the site changes", "Continue", ()=>this.saveChanges(), "Cancel", ()=>{})}>
              {this.state.updatingData && <CSpinner size="sm"/>}
              {this.state.updatingData? " Saving":"Save"}
            </CButton>
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
      this.dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+this.props.item)
      .then(response => response.json())
      .then(data =>
        this.setState({data: data.Data, loading: false})
      );
    }
  }

  saveChanges(){
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    body.BioRegion = Array.from(document.getElementsByName("BioRegion")).map(el => el.value).toString();
    body.Area = +body.Area;
    body.Length = +body.Length;
    body.CentreX = +body.CentreX;
    body.CentreY = +body.CentreY;
    body.Version = this.props.version;
    body.SiteCode = this.props.item;
    if(Object.values(body).some(val => val === null || val === "")){
      this.showErrorMessage("Empty fields are not allowed");
    }
    else {
      this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
      .then((data)=> {
        if(data?.ok){
          this.setState({updatingData:false});
          this.close();
        }
        else {
          this.showErrorMessage("Something went wrong");
        }
      });
      this.setState({updatingData:true});
    }
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
    return this.dl.fetch(url, options)
  }
}
