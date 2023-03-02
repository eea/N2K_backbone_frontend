import { useState, useEffect } from 'react';
import ConfigData from '../../../config.json';
import { CRow, CCol, CCard } from '@coreui/react';
import '@coreui/icons/css/flag.min.css';
import {DataLoader} from '../../../components/DataLoader';

const PendingCards = () => {
    const [pendingCountriesData, setPendingCountriesData] = useState([]);
    const [pendingSitesData, setPendindSitesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    let dl = new(DataLoader);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = (() => {
        let promises = [];
        setIsLoading(true);
        promises.push(dl.fetch(ConfigData.GET_PENDING_LEVEL)
            .then(response => response.json())
            .then(data => {
                if(data?.Success) {
                    data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
                    setPendingCountriesData(data.Data);
                }
            }));
        promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Pending')
            .then(response => response.json())
            .then(data => {
                if(data?.Success) {
                    setPendindSitesData(data.Data);
                }
            }));
        Promise.all(promises).then(d => setIsLoading(false));
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
        let result = []

        pendingCountries.map((country) => {
            result.push(
                <CCol key={country.name + "Card"} xs={12} md={6} lg={4} xl={3}>
                    <a className="country-card-link" href={"/#/sitechanges?country=" + country.code}>
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
                <h1 className="h1-main me-5">Countries</h1>
                {!isLoading && pendingCountriesData.length > 0 &&
                    <div>
                        <span className="badge badge--critical radio me-2"><b>{totalPendingCountriesCritical}</b> Critical</span>
                        <span className="badge badge--warning me-2"><b>{totalPendingCountriesWarning}</b> Warning</span>
                        <span className="badge badge--info me-2"><b>{totalPendingCountriesInfo}</b> Info</span>
                    </div>
                }
            </div>
            <div className="bg-white rounded-2 mb-5">
                <CRow className="grid">
                    {isLoading ?
                        <em className="loading-container">Loading...</em>
                        : pendingCountriesData.length === 0 ? <div className="nodata-container"><em>No Data</em></div>
                        : cards()
                    }
                </CRow>
            </div>
        </>
    );
}

export default PendingCards;
