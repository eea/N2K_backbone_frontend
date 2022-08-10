import React from 'react';
import { loadModules } from "esri-loader";

var GeoJSONLayer;

class MapViewer extends React.Component {

    constructor(props) {
        super(props);
        this.mapDiv = this.props.container?this.props.container:"mapDiv";
        this.map=null;
    }

    componentDidMount(){
        loadModules(
            ["esri/Map", "esri/views/MapView", "esri/widgets/Zoom", "esri/layers/GeoJSONLayer"],
            { css: true }
          ).then(([Map, MapView, Zoom, _GeoJSONLayer]) => {
            GeoJSONLayer = _GeoJSONLayer;
            this.map = new Map({
              basemap: "topo"
            });

            this.view = new MapView({
                container: this.mapDiv,
                map: this.map,
                center: [0,40],
                zoom: 5,
                ui: {
                    components: ["attribution"]
                }
            });

            this.setState({});
            this.zoom = new Zoom({
                view: this.view
            });
            this.view.ui.add(this.zoom, {
                position: "top-right"
            });

            this.getGeometry(this.props.siteCode,'0');
        });

    }

    getGeometry(code,version){
        let url=
        `https://maps-corda.eea.europa.eu/arcgis/rest/services/N2KBackbone/N2KBackboneReference/MapServer/0/query?where=SiteCode%3D%27${code}%27+AND+Version%3D%27${version}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([JSON.stringify(data)], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            let geojsonLayer = new GeoJSONLayer({
                url
            });
            this.map.add(geojsonLayer);
            geojsonLayer.when(a=>this.view.extent = geojsonLayer.fullExtent);
        });

    }

    render(){
        return(
            <>
                <div id={this.mapDiv} style={{ width: '100%', height: '600px' }} />
            </>
        );
    }

}

export default MapViewer;
