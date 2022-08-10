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
            ["esri/Map", "esri/views/MapView", "esri/widgets/Zoom", "esri/layers/GeoJSONLayer", "esri/widgets/LayerList"],
            { css: true }
          ).then(([Map, MapView, Zoom, _GeoJSONLayer, LayerList]) => {
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

            let layerList = new LayerList({view: this.view});
            this.view.ui.add(layerList,{position: "top-right"});

            this.getGeometry(this.props.siteCode,'0');
        });

    }

    getGeometry(code,version){
        let url1=
        `https://maps-corda.eea.europa.eu/arcgis/rest/services/N2KBackbone/N2KBackboneReference/MapServer/0/query?where=SiteCode%3D%27${code}%27+AND+Version%3D%27${version}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson`;
        let url2=
        `https://n2kbackboneback-dev.azurewebsites.net/api/SiteDetails/GetSiteGeometry/siteCode=${code}&version=${version}`;

        fetch(url1)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const blob = new Blob([JSON.stringify(data)], {
                type: "application/json"
            });
            let         url = URL.createObjectURL(blob);

            const renderer = {
                type : "simple",
                symbol : {
                    type : "simple-fill",
                    color : "green", 
                    outline : { 
                        color : "white",
                        width : 0.7
                    }
                }};

            let geojsonRef = new GeoJSONLayer({
                url,
                renderer: renderer
            });
            geojsonRef.title = "Reference geometry";
            this.map.add(geojsonRef);
        });

        fetch(url2)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //Reported Geometry
            let reportedGeo = JSON.parse(data.Data.ReportedGeom);
            console.log(reportedGeo);
            const blobRep = new Blob([JSON.stringify(reportedGeo)], {
            //const blob = new Blob([JSON.stringify(data)], {
                type: "application/json"
            });
            let url = URL.createObjectURL(blobRep);
            let geojsonRep = new GeoJSONLayer({
                url
            });
            geojsonRep.title = "Reported geometry";
            this.map.add(geojsonRep);
            geojsonRep.when(a=>this.view.extent = geojsonRep.fullExtent);
            /*
            //Reference Geometry
            let referenceGeo = JSON.parse(data.Data.ReferenceGeom);
            console.log(referenceGeo);
            const blobRef = new Blob([JSON.stringify(referenceGeo)], {
                type: "application/json"
            });
            url = URL.createObjectURL(blobRef);
            let geojsonRef = new GeoJSONLayer({
                url
            });
            geojsonRef.title = "Reference geometry";
            this.map.add(geojsonRef);
            */
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
