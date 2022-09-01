import { useState, useEffect } from 'react';
import ConfigData from '../../../config.json';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const SiteGraph = () => {
    const [changesCountriesData, setChangesCountriesData] = useState([]);
    const [isChangesLoading, setIsChangesLoading] = useState(true);
    const [sitesPendingData, setSitesPendingData] = useState([]);
    const [sitesAcceptedData, setSitesAcceptedData] = useState([]);
    const [sitesRejectedData, setSitesRejectedData] = useState([]);
    const [isSitesLoading, setIsSitesLoading] = useState(true);

    useEffect(() => {
        if (isChangesLoading)
            fetch(ConfigData.GET_SITE_COUNT)
                .then(response => response.json())
                .then(data => {
                    setIsChangesLoading(false);
                    setChangesCountriesData(data.Data);
                });
        if (isSitesLoading) {
            fetch(ConfigData.GET_SITE_LEVEL + '?status=Pending')
                .then(response => response.json())
                .then(data => {
                    setSitesPendingData(data.Data);
                });
            fetch(ConfigData.GET_SITE_LEVEL + '?status=Accepted')
                .then(response => response.json())
                .then(data => {
                    setSitesAcceptedData(data.Data);
                });
            fetch(ConfigData.GET_SITE_LEVEL + '?status=Rejected')
                .then(response => response.json())
                .then(data => {
                    setSitesRejectedData(data.Data);
                });
            setIsSitesLoading(false);
        }
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
        { name: 'Pending', index: 1, data: chngPending, color: '#033166' },
        { name: 'Accepted', index: 2, data: chngAccepted, color: '#22a4fb' },
        { name: 'Rejected', index: 3, data: chngRejected, color: '#e3f2fd' }
    ];

    countryList = changesCountriesData.map((e) => e.Country);
    
    const getSites = (data) => {
        return data.map((c) => ({
            name: c.Country,
            code: c.Code,
            num: c.ModifiedSites,
            level: c.Level
        }))
    }
    
    function findData(data, country) {
        return getSites(data).filter((c) => c.name == country);
    }

    function sumTotal(total, current) {
        return total + current;
    }
    
    function sumSites(data) {
        return data.map((d) => d.num).reduce(sumTotal, 0);
    }

    function getNumSites(country, desiredStatus) {
        let siteData = [];
        switch(desiredStatus) {
            case "Pending": siteData = findData(sitesPendingData, country); break;
            case "Accepted": siteData = findData(sitesAcceptedData, country); break;
            case "Rejected": siteData = findData(sitesRejectedData, country); break;
        }
        if(siteData[0]) return sumSites(siteData);
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
                stacking: 'percent'
            }
        },
        accessibility: {
            enabled: false
        },
        series: seriesData
    }

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    );
}

export default SiteGraph;
