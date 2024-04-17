import UtilsData from '../../../data/utils.json';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { CAlert } from '@coreui/react';

const SiteGraph = (props) => {
    let seriesData = [];
    let countryList = [];

    let chngPending = [], chngAccepted = [], chngRejected = [];
    let data = props.changesCountriesData;
    for (let i in data) {
        chngAccepted.push(data[i].NumAccepted);
        chngPending.push(data[i].NumPending);
        chngRejected.push(data[i].NumRejected);
    }
    seriesData = [
        { name: 'Pending', index: 1, data: chngPending, color: UtilsData.COLORS.Grey },
        { name: 'Accepted', index: 2, data: chngAccepted, color: UtilsData.COLORS.Green },
        { name: 'Rejected', index: 3, data: chngRejected, color: UtilsData.COLORS.Red }
    ];

    countryList = props.changesCountriesData.map((e) => e.Country);
    
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
            case "Pending": siteData = findData(props.sitesPendingData, country); break;
            case "Accepted": siteData = findData(props.sitesAcceptedData, country); break;
            case "Rejected": siteData = findData(props.sitesRejectedData, country); break;
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
            text: 'Changes Status'
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

    if(props.isLoading)
        return (
            <em className="loading-container">Loading...</em>
        )
    else if(props.errorsLoading)
        return (
            <div><CAlert color="danger m-0">Error loading graph data</CAlert></div>
        )
    else
        return (
            <>
                {props.changesCountriesData.length === 0 ?
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
