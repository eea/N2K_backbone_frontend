import React, { useEffect, useState, useRef } from 'react'
import { AppFooter, AppHeader, AppSidebar } from '../../../components/index'
import '@fortawesome/fontawesome-free/css/all.min.css';

import {
  CButton,
  CCol,
  CContainer,
  CRow,
  CSpinner,
  CAlert
} from '@coreui/react'

import { ConfirmationModal } from './components/ConfirmationModal';
import ConfigData from '../../../config.json';
import UtilsData from '../../../data/utils.json';
import { DataLoader } from '../../../components/DataLoader';
import { dateTimeFormatter } from 'src/components/DateUtils';

const Sitechanges = () => {
  const [loadingExtractions, setLoadingExtractions] = useState(false);
  const [extraction, setExtraction] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  let dl = new (DataLoader);

  useEffect(() => {
    if(!showDescription) {
      if(document.querySelector(".page-description")?.scrollHeight < 6*16){
        setShowDescription("all");
      }
      else {
        setShowDescription("hide");
      }
    }
  });

  const showErrorMessage = (message) => {
    setErrorMessage("Something went wrong: " + message);
    setTimeout(() => { setErrorMessage('') }, UtilsData.MESSAGE_TIMEOUT);
  }

  const [modalValues, setModalValues] = useState({
    visibility: false,
    close: () => {
      setModalValues((prevState) => ({
        ...prevState,
        visibility: false
      }));
    }
  });

  let loadExtractions = () => {
    setLoadingExtractions(true);
    dl.fetch(ConfigData.EXTRACTION_GET)
      .then(response => response.json())
      .then(data => {
        if (data?.Success) {
          const dateArray = data.Data.split('_');
          const date = dateArray[0].split("-").reverse().join('-') + 'T' + dateArray[1].replaceAll('-', ':');
          setExtraction(dateTimeFormatter(date));
        }
      });
  }

  const generateExtraction = () => {
    setIsGenerating(true);
    dl.xmlHttpRequest(ConfigData.EXTRACTION_UPDATE)
      .then(data => {
        if (!data?.Success) {
          showErrorMessage(data.Message);
        }
        setExtraction(null);
        setLoadingExtractions(false);
        setIsGenerating(false);
      })
  }

  const downloadExtraction = () => {
    setIsDownloading(true);
    dl.fetch(ConfigData.EXTRACTION_DOWNLOAD)
      .then(data => {
        if (data?.ok) {
          const regExp = /filename="(?<filename>.*)"/;
          const filename = regExp.exec(data.headers.get('Content-Disposition'))?.groups?.filename ?? null;
          data.blob()
            .then(blobresp => {
              var blob = new Blob([blobresp], { type: "octet/stream" });
              var url = window.URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.download = filename;
              link.href = url;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            })
        } else {
          showErrorMessage("Downloading error");
        }
        setIsDownloading(false);
      })
  }

  useEffect(() => {
    if (!extraction)
      loadExtractions();
  }, [extraction])

  const page = UtilsData.SIDEBAR["sitechanges"].find(a => a.option === "extraction");

  return (
    <>
      <div className="container--main min-vh-100">
        <AppHeader page="sitechanges" />
        <div className="content--wrapper">
          <AppSidebar
            title="Site Changes"
            options={UtilsData.SIDEBAR["sitechanges"]}
            active={page.option}
          />
          <div className="main-content">
            <CContainer fluid>
              <div className="d-flex justify-content-between px-0 p-3">
                <div className="page-title">
                  <h1 className="h1">{page.name}</h1>
                </div>
                <div>
                  <ul className="btn--list">
                    <li>
                      <CButton className="ms-3" color="secondary" disabled={isDownloading || isGenerating} onClick={() => generateExtraction()}>
                        {isGenerating && <CSpinner size="sm" />}
                        {isGenerating ? " Generating Extraction" : "Generate New"}
                      </CButton>
                    </li>
                    <li>
                      <CButton className="ms-3" color="primary" disabled={!extraction || isDownloading || isGenerating} onClick={() => downloadExtraction()}>
                        {isDownloading && <CSpinner size="sm" />}
                        {isDownloading ? " Downloading Extraction" : "Download"}
                      </CButton>
                    </li>
                  </ul>
                </div>
              </div>
              {page.description &&
                <div className={"page-description " + showDescription}>
                  {page.description}
                  {showDescription !== "all" &&
                    <CButton color="link" className="btn-link--dark text-nowrap" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                      {showDescription === "show" ? "Hide description" : "Show description"}
                    </CButton>
                  }
                </div>
              }
              <div>
                <CAlert color="danger" visible={errorMessage.length > 0}>{errorMessage}</CAlert>
              </div>
              <CRow>
                <CCol className="mb-4">
                  <div className="select--left">
                    {extraction &&
                      <span>The lastest available extraction is: <b>{extraction}</b></span>
                    }
                    {!extraction &&
                      <span>There are no available extractions</span>
                    }
                  </div>
                </CCol>
              </CRow>
            </CContainer>
          </div>
        </div>
      </div>
      <ConfirmationModal modalValues={modalValues} />
    </>
  )
}

export default Sitechanges
