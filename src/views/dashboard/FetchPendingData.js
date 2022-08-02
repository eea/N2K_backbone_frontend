import React, { useState, useEffect } from 'react';
import ConfigData from '../../config.json';
import { CRow, CCol, CCard, CCardImage } from '@coreui/react';

let pendingCountries = [];

const FetchPendingData = () => {
    const [pendingCountriesData, setPendingCountriesData] = useState([]);
    const [isPendingLoading, setIsPendingLoading] = useState(true);

    useEffect(() => {
        if (isPendingLoading)
            fetch(ConfigData.GET_PENDING_LEVEL)
                .then(response => response.json())
                .then(data => {
                    setIsPendingLoading(false);
                    setPendingCountriesData(data.Data);
                });
    })

    const getPending = () => {
        return pendingCountriesData.map((c) => ({
            name: c.Country,
            code: c.Code,
            pendingInfo: c.NumInfo,
            pendingWarning: c.NumWarning,
            pendingCritical: c.NumCritical
        }))
    }

    function sumTotal(total, current) {
        return total + current;
    }

    pendingCountries = getPending();

    const totalPendingInfo = pendingCountries.map((c) => c.pendingInfo).reduce(sumTotal, 0);
    const totalPendingWarning = pendingCountries.map((c) => c.pendingWarning).reduce(sumTotal, 0);
    const totalPendingCritical = pendingCountries.map((c) => c.pendingCritical).reduce(sumTotal, 0);

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
                                <CCardImage className="card-img--flag" src={require("./../../../src/assets/images/flags/" + countryPath + ".png")} width="32px" />
                            </div>
                            <div className="country-card-right">
                                <div className="country-card-header">
                                    <span className="country-card-title">{country.name}</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                                <div className="country-card-body">
                                    <span className="badge color--critical"><b>{country.pendingCritical}</b> Critical</span>
                                    <span className="badge color--warning"><b>{country.pendingWarning}</b> Warning</span>
                                    <span className="badge color--info"><b>{country.pendingInfo}</b> Info</span>
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
                    <span className="badge badge--critical radio me-2"><b>{totalPendingCritical}</b> Critical</span>
                    <span className="badge badge--warning me-2"><b>{totalPendingWarning}</b> Warning</span>
                    <span className="badge badge--info me-2"><b>{totalPendingInfo}</b> Info</span>
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

export default FetchPendingData;