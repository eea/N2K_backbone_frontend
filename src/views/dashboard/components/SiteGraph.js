import { useState, useEffect } from 'react';
import ConfigData from '../../../config.json';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {DataLoader} from '../../../components/DataLoader';

const SiteGraph = () => {
    const [changesCountriesData, setChangesCountriesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sitesPendingData, setSitesPendingData] = useState([]);
    const [sitesAcceptedData, setSitesAcceptedData] = useState([]);
    const [sitesRejectedData, setSitesRejectedData] = useState([]);
    let dl = new(DataLoader);
    
    useEffect(() => {
        loadData();
    }, [])

    const loadData = (() => {
        let promises = [];
        setIsLoading(true);
        promises.push(dl.fetch(ConfigData.GET_SITE_COUNT)
            .then(response => response.json())
            .then(data => {
                data.Data.sort((a, b) => a.Country.localeCompare(b.Country));
                setChangesCountriesData(data.Data);
            }));
        promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Pending')
            .then(response => response.json())
            .then(data => {
                setSitesPendingData(data.Data);
            }));
        promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Accepted')
            .then(response => response.json())
            .then(data => {
                setSitesAcceptedData(data.Data);
            }));
        promises.push(dl.fetch(ConfigData.GET_SITE_LEVEL + '?status=Rejected')
            .then(response => response.json())
            .then(data => {
                setSitesRejectedData(data.Data);
            }));
        Promise.all(promises).then(d => setIsLoading(false));
    })
    
    let seriesData = [];
    let countryList = [];

    let chngPending = [], chngAccepted = [], chngRejected = [];
    let data = changesCountriesData;
    for (let i in data) {
        chngAccepted.push(data[i].NumAccepted);
        chngPending.push(data[i].NumPending);
        chngRejected.push(data[i].NumRejected);
    }
    seriesData = [
        { name: 'Pending', index: 1, data: chngPending, color: ConfigData.Colors.Grey },
        { name: 'Accepted', index: 2, data: chngAccepted, color: ConfigData.Colors.Green },
        { name: 'Rejected', index: 3, data: chngRejected, color: ConfigData.Colors.Red }
    ];

    countryList = changesCountriesData.map((e) => e.Country);
    
    const getSites = (data) => {
        return data.map((c) => ({
            name: c.Country,
            code: c.Code,
            numModified: c.ModifiedSites,
            numAffected: c.AffectedSites,
            level: c.Level
        }))
    }
    
    function findData(data, country) {
        return getSites(data).filter((c) => c.name == country);
    }

    function getNumSites(country, desiredStatus) {
        let siteData = [];
        switch(desiredStatus) {
            case "Pending": siteData = findData(sitesPendingData, country); break;
            case "Accepted": siteData = findData(sitesAcceptedData, country); break;
            case "Rejected": siteData = findData(sitesRejectedData, country); break;
        }
        if(siteData[0]) return siteData[0].numAffected;
        return 0;
    }

    const options = {
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Changes (Pending/Accepted/Rejected)'
        },
        xAxis: {
            categories: countryList
        },
        yAxis: {
            min: 0,
            reversedStacks: false,
            title: {
                text: ''
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ' changes: ' + '<b>' + this.y + '</b>' + '<br/>' +
                    'Affected sites: ' + '<b>' + getNumSites(this.x, this.series.name) + '</b>';
            }
        },
        plotOptions: {
            series: {
                stacking: 'percent',
                states: {
                    hover: {
                      enabled: false,
                    },
                },
            }
        },
        accessibility: {
            enabled: false
        },
        series: seriesData
    }

    if(isLoading)
        return (
            <em className="loading-container">Loading...</em>
        )
    else
        return (
            <>
                {changesCountriesData.length === 0 ?
                    <div className="nodata-container"><em>No Data</em></div> :
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                }
            </>
        );
}

export default SiteGraph;
