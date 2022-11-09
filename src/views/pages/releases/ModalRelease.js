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
      uncompletedData: [],
      completedData: [],
      completingEnvelope: {
        state: false,
        id: null,
      },
      canCreateRelease: false,
      message: null,
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
      uncompletedData: [],
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
          <div className="release-group-title">Pending changes {this.state.pendingData !== "nodata" && "(" + this.state.pendingData.length + ")"}</div>
          {this.state.pendingData === "nodata" ? 
            "There are no pending changes." : this.renderPendingCards()
          }
        </div>
        <div className="release-group">
          <div className="release-group-title">Uncompleted countries {this.state.uncompletedData !== "nodata" && "(" + this.state.uncompletedData.length + ")"}</div>
          {this.state.uncompletedData === "nodata" ? 
            "There are no uncompleted countries." : this.renderUncompletedCards()
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
    for(let i in this.state.pendingData){
      let card = this.state.pendingData[i];
      cards.push(
        <CCol key={card.Code + "Card"} xs={12} md={12} lg={6} xl={4}>
          <a className="country-card-link" href={"/#/sitechanges?country=" + card.Code}>
            <CCard className="country-card">
                <div className="country-card-header">
                    <div className="country-card-left">
                        <span className={"card-img--flag cif-" + card.Code.toLowerCase()}></span>
                        <span className="country-card-title">{card.Country}</span>
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

  renderUncompletedCards(){
    let cards = [];
    for(let i in this.state.uncompletedData){
      let card = this.state.uncompletedData[i];
      cards.push(
        <CCol key={card.Country + "Card"} xs={12} md={12} lg={6} xl={4}>
          <CCard className="country-card">
              <div className="country-card-header">
                  <div className="country-card-left">
                      <span className={"card-img--flag cif-" + card.Country.toLowerCase()}></span>
                      <span className="country-card-title">{card.Name}</span>
                  </div>
                  <CButton color="primary" disabled={this.state.completingEnvelope.state} onClick={()=>this.props.updateModalValues("Complete envelope", "This will complete the envelope", "Continue", ()=>this.completeEnvelope(card.Country, card.Version), "Cancel", ()=>{})}>
                    {this.state.completingEnvelope.id === card.Country ? <><CSpinner size="sm"/> Completing Envelope</> : "Complete Envelope"}
                  </CButton>
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
                {card.ChangesAccepted > 0 && <span className="badge badge--accepted"><b>{card.ChangesAccepted}</b> Accepted</span>}
                {card.ChangesAccepted > 0 && <span className="badge badge--rejected"><b>{card.ChangesRejected}</b> Rejected</span>}
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
          <div className="release-group">
            <CForm id="release_form">
              <CRow>
                <CAlert className="mx-3" color="primary" dismissible visible={this.state.message} onClose={() => this.setState({message: null})}>{this.state.message}</CAlert>
                <CCol xs={12}>
                  <label className="mb-3">Union List Name</label>
                  <CFormInput
                    className="mb-2"
                    name="Name"
                    type="text"
                    maxLength={254}
                    placeholder="Union List Name"
                    autoComplete="off"
                    disabled={this.state.canCreateRelease}
                  />
                  <div className="checkbox" disabled={(this.state.canCreateRelease)}>
                    <input type="checkbox" className="input-checkbox" id="modal_check_final" name="Final"/>
                    <label htmlFor="modal_check_final" className="input-label">Mark as final</label>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </div>
          <hr className="mt-4"/>
          {this.renderCards()}
        </CModalBody>
        <CModalFooter>
          <div className="d-flex w-100 justify-content-between">
            <CButton color="secondary" disabled= {this.state.updatingData} onClick={()=>this.close()}>Cancel</CButton>
            <CButton color="primary" disabled= {this.state.updatingData || this.state.canCreateRelease} onClick={()=>this.props.updateModalValues("Create Release", "This will create the release.Note: Release creation will launch a process and you will be notified by email when the release is complete.", "Continue", ()=>this.createRelease(), "Cancel", ()=>{})}>
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
        <CModal scrollable size="xl" visible={this.isVisible()} onClose={()=>this.close()}>
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
        if(data.Data.length === 0) {
          this.setState({pendingData: "nodata"});
        }
        else {
          this.setState({pendingData: data.Data});
        }
      }));
      promises.push(this.dl.fetch(ConfigData.HARVESTING_GET_STATUS+"?status=Harvested")
      .then(response => response.json())
      .then(data => {
        if(data.Data.filter(a=>a.ChangesPending === 0).length === 0) {
          this.setState({uncompletedData: "nodata"});
        }
        else {
          this.setState({uncompletedData: data.Data.filter(a=>a.ChangesPending === 0)});
        }
      }));
      promises.push(this.dl.fetch(ConfigData.HARVESTING_GET_STATUS+"?status=Closed")
      .then(response => response.json())
      .then(data => {
        if(data.Data.length === 0) {
          this.setState({completedData: "nodata"});
        }
        else {
          this.setState({completedData: data.Data});
        }
      }));
      Promise.all(promises).then(d => this.setState({loading: false, canCreateRelease: !(this.state.pendingData === "nodata" && this.state.uncompletedData === "nodata" && this.state.completedData !== "nodata")}));
    }
  }

  showMessage(text) {
    this.setState({message: text});
    setTimeout(() => {
      this.setState({message: null});
    }, 4000);
  };

  createRelease(){
    let body = Object.fromEntries(new FormData(document.getElementById("release_form")));
    body.Final = body.Final ? true : false;
    if(!body.Name) {
      this.showMessage("Add valid Union List Name");
    }
    else {
      this.setState({updatingData: true});
      this.sendRequest(ConfigData.UNIONLIST_CREATE,"POST",body)
      .then(response => response.json())
      .then(data => {
        if(data.Success) {
          this.close(true);
          this.setState({updatingData: false});
        }
        else {
          //errors.push(data.Message);
          console.log("Error: " + data.Message);
        }
      })
    }
  }

  completeEnvelope(country, version) {
    this.setState({completingEnvelope: {state: true, id: country}});
    this.sendRequest(ConfigData.HARVESTING_CHANGE_STATUS+"?country="+country+"&version="+version+"&toStatus=Closed","POST","")
    .then(response => response.json())
    .then(data => {
      if(data.Success) {
        this.setState({pendingData: [], uncompletedData: [], completedData: [],completingEnvelope: {state: false, id: null}});
      }
      else {
        console.log("Error: " + data.Message);
      }
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
