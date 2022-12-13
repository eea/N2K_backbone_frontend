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

import {DataLoader} from '../../../components/DataLoader';

export class ModalEdition extends Component {
  constructor(props) {
    super(props);
    this.dl = new(DataLoader);
    this.state = {
      loading: true, 
      data: {}, 
      notValidField: [],
      validated: true,
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

  close(refresh){
    this.state.notValidField = [];
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
      <CTabPane role="tabpanel" aria-labelledby="home-tab" visible={true}>
        <CForm
          id="siteedition_form">
          <CRow className="p-3">
            {(this.state.notValidField.length > 0) &&
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
  
  fieldValidator() {
    let body = Object.fromEntries(new FormData(document.querySelector("form")));
    let data = JSON.parse(JSON.stringify( body, ["SiteCode","SiteName","SiteType","BioRegion","Area","Length","CentreY","CentreX"]));
    this.state.notValidField = [];
    for(let i in Object.keys(data)){
      let field = Object.keys(data)[i]
      let value = data[field];
      if(!value)
        this.state.notValidField.push(field);
    }
    this.state.notValidField.forEach((e) => {
      let field = document.getElementById("field_" + e)
      field.querySelector(".multi-select__control") ?
        field.querySelector(".multi-select__control").classList.add('invalidField')
        : field.classList.add('invalidField')
    });
    return this.state.notValidField.length == 0
  }
  
  onChangeField(e) {
    e.target.classList.contains('invalidField') ?
      e.target.classList.remove('invalidField') 
    : {}    
  }

  createFieldElement(){
    let fields = [];
    let data = this.state.data;
    data = JSON.parse(JSON.stringify( data, ["SiteCode","SiteName","SiteType","BioRegion","Area","Length","CentreY","CentreX"]));
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
          label = "Biogeographycal Region";
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
                active={true}
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
            <CButton color="secondary" disabled= {this.state.updatingData} onClick={()=>this.close()}>Cancel</CButton>
            <CButton color="primary" disabled= {this.state.updatingData} onClick={()=>this.saveChanges()}>
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
        <CModal scrollable size="xl" visible={this.isVisible()} onClose={()=>this.close()}>
          {this.renderData()}
        </CModal>
      </>
    )
  }

  loadData(){
    if (this.isVisible() && (this.state.data.SiteCode !== this.props.item)){
      this.dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+this.props.item)
      .then(response => response.json())
      .then(data =>{
        if(data.Data.SiteCode === this.props.item && Object.keys(this.state.data).length === 0) {
          this.setState({data: data.Data, loading: false})
        }
      });
    }
  }

  saveChanges(){
    if(this.fieldValidator()) {
      let body = Object.fromEntries(new FormData(document.querySelector("form")));
      body.BioRegion = Array.from(document.getElementsByName("BioRegion")).map(el => el.value).toString();
      body.Area = +body.Area;
      body.Length = +body.Length;
      body.CentreX = +body.CentreX;
      body.CentreY = +body.CentreY;
      body.Version = this.props.version;
      body.SiteCode = this.props.item;

      let errorMargin = 0.00000001;

      if(this.state.data.Area != body.Area
          || this.state.data.BioRegion != body.BioRegion
          || this.state.data.Length != body.Length
          || (Math.abs(this.state.data.CentreX - body.CentreX) > errorMargin)
          || (Math.abs(this.state.data.CentreY - body.CentreY) > errorMargin)
      ) {
        
        this.props.updateModalValues("Save changes", "This will save the site changes", "Continue", () => {

          if(Object.values(body).some(val => val === null || val === "")){
            this.showErrorMessage("Empty fields are not allowed");
          } else {
            this.sendRequest(ConfigData.SITEDETAIL_SAVE, "POST", body)
            .then((data)=> {
              if(data?.ok){
                this.setState({updatingData:false});
                this.close(true);
              }
              else {
                this.showErrorMessage("Something went wrong");
              }
            });
            this.setState({updatingData:true});
          }
        }, "Cancel", () => {this.cancelChanges()});
      }
      else this.cancelChanges();
    }
  }

  cancelChanges(){
    this.close(true);
  }

  sendRequest(url,method,body,path){
    console.log(body)
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
