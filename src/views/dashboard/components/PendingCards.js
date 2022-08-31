import { useState, useEffect } from 'react';
import ConfigData from '../../../config.json';
import { CRow, CCol, CCard, CCardImage } from '@coreui/react';

const PendingCards = () => {
    const [pendingCountriesData, setPendingCountriesData] = useState([]);
    const [isPendingCountriesLoading, setIsPendingCountriesLoading] = useState(true);
    const [pendingSitesData, setPendindSitesData] = useState([]);
    const [isPendingSitesLoading, setIsPendingSitesLoading] = useState(true);

    useEffect(() => {
        if (isPendingCountriesLoading)
            fetch(ConfigData.GET_PENDING_LEVEL)
                .then(response => response.json())
                .then(data => {
                    setIsPendingCountriesLoading(false);
                    setPendingCountriesData(data.Data);
                });
        if (isPendingSitesLoading)
            fetch('https://localhost:7073/api/Countries/GetSiteLevel?status=Pending')
                .then(response => response.json())
                .then(data => {
                    setIsPendingSitesLoading(false);
                    setPendindSitesData(data.Data);
                })
    })

    const getPendingCountries = () => {
        return pendingCountriesData.map((c) => ({
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
        return pendingSitesData.map((c) => ({
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
        if(siteData[0]) return siteData[0].num;
        return 0;
    }
    
    const totalPendingCountriesInfo = pendingCountries.map((c) => c.pendingInfo).reduce(sumTotal, 0);
    const totalPendingCountriesWarning = pendingCountries.map((c) => c.pendingWarning).reduce(sumTotal, 0);
    const totalPendingCountriesCritical = pendingCountries.map((c) => c.pendingCritical).reduce(sumTotal, 0);

    const cards = () => {
        let countryPath;
        let result = []

        pendingCountries.map((country) => {
            countryPath = country.name.toLowerCase();
            if (countryPath.includes("czech")) {
                countryPath = countryPath.split(" ")[0];
            } else if (countryPath.includes("macedonia")) {
                countryPath = countryPath.split(" ")[1]
            }
            result.push(
                <CCol key={country.name + "Card"} xs={12} md={6} lg={4} xl={3}>
                    <a className="country-card-link" href={"/#/sitechanges?country=" + country.code}>
                        <CCard className="country-card">
                            <div className="country-card-left">
                                <CCardImage className="card-img--flag" src={require("../../../../src/assets/images/flags/" + countryPath + ".png")} width="32px" />
                            </div>
                            <div className="country-card-right">
                                <div className="country-card-header">
                                    <span className="country-card-title">{country.name}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                <div className="country-card-body">
                                    <span className="badge color--critical"><b> {country.pendingCritical}</b> Critical</span>
                                    <span className="badge color--warning"><b>  {country.pendingWarning}</b> Warning</span>
                                    <span className="badge color--info"><b>     {country.pendingInfo}</b> Info</span>
                                    <p/>
                                    <span className="badge color--critical"><b> {country.numSitesCritical}</b> Critical</span>
                                    <span className="badge color--warning"><b>  {country.numSitesWarning}</b> Warning</span>
                                    <span className="badge color--info"><b>     {country.numSitesInfo}</b> Info</span>
                                </div>
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
                <h1 className="h1-main me-5">Countries</h1>
                <div>
                    <span className="badge badge--critical radio me-2"><b>{totalPendingCountriesCritical}</b> Critical</span>
                    <span className="badge badge--warning me-2"><b>{totalPendingCountriesWarning}</b> Warning</span>
                    <span className="badge badge--info me-2"><b>{totalPendingCountriesInfo}</b> Info</span>
                </div>
            </div>
            <div className="bg-white rounded-2 mb-5">
                <CRow className="grid">
                    {cards()}
                </CRow>
            </div>
        </>
    );
}

export default PendingCards;
