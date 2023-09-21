import ConfigData from '../../../config.json';
import React, { Component, useState } from 'react';
import '@coreui/icons/css/flag.min.css';
import {
  CButton,
  CSpinner,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CCard,
  CForm,
  CFormInput,
  CAlert
} from '@coreui/react'

import {DataLoader} from '../../../components/DataLoader';

export class ModalRelease extends Component {
  constructor(props) {
    super(props);
    this.dl = new(DataLoader);
    this.state = {
      loading: false,
      pendingData: [],
      harvestedData: [],
      completedData: [],
      completingEnvelope: {
        state: false,
        id: null,
      },
      message: "",
      updatingData: false,
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
    };
  }

  close(refresh){
    this.props.close(refresh);
    this.setState({
      pendingData: [],
      harvestedData: [],
      completedData: [],
    });
  }

  isVisible(){
    return this.props.visible;
  }

  renderCards(){
    return (
      <>
        <div className="release-group">
          <div className="release-group-title">Pending changes {this.state.harvestedData !== "nodata" && "(" + this.state.harvestedData.length + ")"}</div>
          {this.state.harvestedData === "nodata" ? 
            "There are no pending changes." : this.renderPendingCards()
          }
        </div>
        <div className="release-group">
          <div className="release-group-title">Completed countries {this.state.completedData !== "nodata" && "("+this.state.completedData.length+")"}</div>
          {this.state.completedData === "nodata" ? 
            "There are no completed countries." : this.renderCompletedCards()
          }
        </div>
      </>
    )
  }

  renderPendingCards(){
    let cards = [];
    for(let i in this.state.harvestedData){
      let card = this.state.harvestedData[i];
      if (card.ChangesPending > 0) {
        let pending = this.state.pendingData.find(a => a.Code === card.Country);
        card.NumCritical = pending.NumCritical;
        card.NumWarning = pending.NumWarning;
        card.NumInfo = pending.NumInfo;
      }
      else {
        card.NumCritical = 0;
        card.NumWarning = 0;
        card.NumInfo = 0;
      }
      cards.push(
        <CCol key={card.Country + "Card"} xs={12} md={12} lg={6} xl={4}>
          <a className="country-card-link" href={"/#/sitechanges?country=" + card.Country}>
            <CCard className="country-card">
                <div className="country-card-header">
                    <div className="country-card-left">
                      <span className={"card-img--flag cif-" + card.Country.toLowerCase()}></span>
                      <span className="country-card-title">{card.Name}</span>
                    </div>
                    <div className="country-card-right">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
                <div className="country-card-body">
                  <span className="badge color--critical"><b>{card.NumCritical}</b> Critical</span>
                  <span className="badge color--warning"><b>{card.NumWarning}</b> Warning</span>
                  <span className="badge color--info"><b>{card.NumInfo}</b> Info</span>
                </div>
                <div className="country-card-body">
                  <CButton color="primary" disabled={this.state.completingEnvelope.state} onClick={(e)=>this.completeEnvelopeModal(e, card)}>
                    {this.state.completingEnvelope.id === card.Country ? <><CSpinner size="sm"/> Completing Envelope</> : "Complete Envelope"}
                  </CButton>
                </div>
            </CCard>
          </a>
        </CCol>
      );
    }
    return (
      <CRow className="grid">
        {cards}
      </CRow>
    )
  }

  renderCompletedCards(){
    let cards = [];
    for(let i in this.state.completedData){
      let card = this.state.completedData[i];
      cards.push(
        <CCol key={card.Country + "Card"} xs={12} md={12} lg={6} xl={4}>
          <CCard className="country-card">
              <div className="country-card-header">
                  <div className="country-card-left">
                      <span className={"card-img--flag cif-" + card.Country.toLowerCase()}></span>
                      <span className="country-card-title">{card.Name}</span>
                  </div>
              </div>
              <div className="country-card-body">
                <span className="badge status--pending"><b>{card.ChangesPending}</b> Pending</span>
                <span className="badge status--accepted"><b>{card.ChangesAccepted}</b> Accepted</span>
                <span className="badge status--rejected"><b>{card.ChangesRejected}</b> Rejected</span>
              </div>
          </CCard>
        </CCol>
      );
    }
    return (
      <CRow className="grid">
        {cards}
      </CRow>
    )
  }


  renderModal() {
    return(
      <>
        <CModalHeader>
          <CModalTitle>Release Creation</CModalTitle>
        </CModalHeader>
        <CModalBody >
          {this.state.message && <CAlert color="danger">{this.state.message}</CAlert>}
          <div className="release-group">
            <CForm id="release_form">
              <CRow>
                <CCol xs={12}>
                  <label className="mb-3">Release Name</label>
                  <CFormInput
                    className="mb-2"
                    name="Name"
                    type="text"
                    maxLength={254}
                    placeholder="Release Name"
                    autoComplete="off"
                  />
                  <div className="checkbox">
                    <input type="checkbox" className="input-checkbox" id="modal_check_final" name="Final"/>
                    <label htmlFor="modal_check_final" className="input-label">Mark as final</label>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </div>
          {this.renderCards()}
        </CModalBody>
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            <CButton color="secondary" disabled= {this.state.updatingData || this.state.completingEnvelope.state} onClick={()=>this.close()}>Cancel</CButton>
            <CButton color="primary" disabled= {this.state.updatingData || this.state.completingEnvelope.state} onClick={()=>this.checkReleaseName()}>
              {this.state.updatingData && <CSpinner size="sm"/>}
              {this.state.updatingData ? " Creating":"Create"}
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
        <CModal scrollable size="xl" visible={this.isVisible()} backdrop="static" onClose={()=>this.close()}>
          {this.isVisible() && this.renderData()}
        </CModal>
      </>
    )
  }

  loadData(){
    if (this.isVisible() && !this.state.loading && (this.state.pendingData.length === 0 && this.state.completedData.length === 0 && this.state.completedData.length === 0)){
      let promises = [];
      this.setState({loading: true});
      promises.push(this.dl.fetch(ConfigData.GET_PENDING_LEVEL)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          if(data.Data.length === 0) {
            this.setState({pendingData: "nodata"});
          }
          else {
            this.setState({pendingData: data.Data});
          }
        }
      }));
      promises.push(this.dl.fetch(ConfigData.HARVESTING_GET_STATUS+"?status=Harvested")
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          if(data.Data.length === 0) {
            this.setState({harvestedData: "nodata"});
          }
          else {
            data.Data.sort((a, b) => a.Name.localeCompare(b.Name));
            this.setState({harvestedData: data.Data});
          }
        }
      }));
      promises.push(this.dl.fetch(ConfigData.HARVESTING_CLOSED)
      .then(response => response.json())
      .then(data => {
        if(data?.Success) {
          if(data.Data.length === 0) {
            this.setState({completedData: "nodata"});
          }
          else {
            data.Data.sort((a, b) => a.Name.localeCompare(b.Name));
            this.setState({completedData: data.Data});
          }
        }
      }));
      Promise.all(promises).then(d => this.setState({loading: false}));
    }
  }

  checkReleaseName() {
    let body = Object.fromEntries(new FormData(document.getElementById("release_form")));
    if(!body.Name) {
      this.showMessage("Add a release name");
    }
    else {
      this.props.updateModalValues("Create Release", <><p>This will create the release.</p><p>Note: Release creation will launch a process and you will be notified by email when the release is complete.</p></>, "Continue", ()=>this.createRelease(), "Cancel", ()=>{})
    }
  };

  showMessage(text) {
    this.setState({message: text});
    setTimeout(() => {
      this.setState({message: null});
    }, ConfigData.MessageTimeout);
  };

  createRelease(){
    let body = Object.fromEntries(new FormData(document.getElementById("release_form")));
    body.Final = body.Final ? true : false;
    this.setState({updatingData: true});
    this.sendRequest(ConfigData.UNIONLIST_CREATE,"POST",body)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        this.close(true);
        this.setState({updatingData: false});
      } else { this.showMessage("Error: " + data.Message) }
    })
  }

  completeEnvelopeModal(e, card) {
    e.preventDefault();
    this.props.updateModalValues("Complete envelope", "This will complete the envelope", "Continue", ()=>this.completeEnvelope(card.Country, card.Version), "Cancel", ()=>{})
  }

  completeEnvelope(country, version) {
    this.setState({completingEnvelope: {state: true, id: country}});
    let rBody = {
      "countryVersion": [{ "CountryCode": country, "VersionId": version }],
      "toStatus": "Closed"
    }
    this.sendRequest(ConfigData.HARVESTING_CHANGE_STATUS,"POST",rBody)
    .then(response => response.json())
    .then(data => {
      if(data?.Success) {
        this.setState({pendingData: [], harvestedData: [], completedData: [],completingEnvelope: {state: false, id: null}});
      }
      else { this.showMessage("Error: " + data.Message) }
    })
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
