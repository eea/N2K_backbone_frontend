import { CAlert, CRow, CCol, CCard } from '@coreui/react';
import '@coreui/icons/css/flag.min.css';

const PendingCards = (props) => {

  const getPendingCountries = () => {
    return props.countriesPendingData.map((c) => ({
      name: c.Country,
      code: c.Code,
      pendingInfo: c.NumInfo,
      pendingWarning: c.NumWarning,
      pendingCritical: c.NumCritical,
      numSitesInfo: getNumSites(c.Code, "Info"),
      numSitesWarning: getNumSites(c.Code, "Warning"),
      numSitesCritical: getNumSites(c.Code, "Critical"),
    }))
  }

  const getPendingSites = () => {
    return props.sitesPendingData.map((c) => ({
      name: c.Country,
      code: c.Code,
      num: c.ModifiedSites,
      level: c.Level
    }))
  }

  function sumTotal(total, current) {
    return total + current;
  }

  function findData(data, countryCode, desiredLevel) {
    return data.filter((c) => c.code == countryCode && c.level == desiredLevel);
  }

  let pendingSites = getPendingSites();
  let pendingCountries = getPendingCountries();

  function getNumSites(countryCode, desiredLevel) {
    let siteData = findData(pendingSites, countryCode, desiredLevel);
    if (siteData[0]) return siteData[0].num;
    return 0;
  }

  const totalPendingCountriesInfo = pendingCountries.map((c) => c.pendingInfo).reduce(sumTotal, 0);
  const totalPendingCountriesWarning = pendingCountries.map((c) => c.pendingWarning).reduce(sumTotal, 0);
  const totalPendingCountriesCritical = pendingCountries.map((c) => c.pendingCritical).reduce(sumTotal, 0);

  const cards = () => {
    let result = []

    pendingCountries.map((country) => {
      result.push(
        <CCol key={country.name + "Card"} xs={12} md={6} lg={4} xl={3}>
          <a className="country-card-link" href={"/#/sitechanges/changes?country=" + country.code}>
            <CCard className="country-card">
              <div className="country-card-header">
                <div className="country-card-left">
                  <span className={"card-img--flag cif-" + country.code.toLowerCase()}></span>
                  <span className="country-card-title">{country.name}</span>
                </div>
                <div className="country-card-right">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="country-card-body">
                <div>
                  <span className="badge--type">Pending changes: </span>
                </div>
                <span className="badge color--critical"><b> {country.pendingCritical}</b> Critical</span>
                <span className="badge color--warning"><b>  {country.pendingWarning}</b> Warning</span>
                <span className="badge color--info"><b>     {country.pendingInfo}</b> Info</span>
                <div>
                  <span className="badge--type">Affected sites: </span>
                </div>
                <span className="badge color--critical"><b> {country.numSitesCritical}</b> Critical</span>
                <span className="badge color--warning"><b>  {country.numSitesWarning}</b> Warning</span>
                <span className="badge color--info"><b>     {country.numSitesInfo}</b> Info</span>
              </div>
            </CCard>
          </a>
        </CCol>
      )
    });
    return result;
  }
  return (
    <>
      <div className="dashboard-title">
        <h1 className="h1-main me-2">Countries</h1>
        {!props.isLoading && !props.errorsLoading && props.countriesPendingData.length > 0 &&
          <>
            <span className="badge badge--all active me-4"><b>{props.countriesPendingData.length}</b></span>
            <div>
              <span className="badge badge--critical me-2"><b>{totalPendingCountriesCritical}</b> Critical</span>
              <span className="badge badge--warning me-2"><b>{totalPendingCountriesWarning}</b> Warning</span>
              <span className="badge badge--info me-2"><b>{totalPendingCountriesInfo}</b> Info</span>
            </div>
          </>
        }
      </div>
      <div className={"container-card-dashboard" + (!props.isLoading && !props.errorsLoading && props.countriesPendingData.length !== 0 ? " noborder" : "") + " mb-5" }>
        <CRow className="grid">
          {props.isLoading ?
            
            <div className="bg-white rounded-2">
              <em className="loading-container">Loading...</em>
            </div>
            : props.errorsLoading ? <></> : (props.countriesPendingData.length === 0 ?
              <div className="bg-white rounded-2">
                <div className="nodata-container"><em>No Data</em></div>
              </div>
              : cards())
          }
          {props.errorsLoading &&
            <div>
              <CAlert color="danger m-0">Error loading countries data</CAlert>
            </div>
          }
        </CRow>
      </div>
    </>
  );
}

export default PendingCards;
