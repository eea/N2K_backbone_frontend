import React from 'react';
import { loadModules } from "esri-loader";
import {DataLoader} from '../../../../components/DataLoader';

var GeoJSONLayer;

class MapViewer extends React.Component {

    constructor(props) {
        super(props);
        this.dl = new(DataLoader);
        this.mapDiv = this.props.container?this.props.container:"mapDiv";
        this.map=null;
    }

    componentDidMount(){
        loadModules(
            ["esri/Map", "esri/views/MapView", "esri/widgets/Zoom", "esri/layers/GeoJSONLayer", "esri/widgets/LayerList", "esri/layers/FeatureLayer",
            "esri/layers/MapImageLayer"],
            { css: true }
          ).then(([Map, MapView, Zoom, _GeoJSONLayer, LayerList, FeatureLayer, MapImageLayer]) => {
            GeoJSONLayer = _GeoJSONLayer;

            //let mapRel = new MapImageLayer({ url: "https://trial.discomap.eea.europa.eu/arcgis/rest/services/N2kBackbone/Map/MapServer", visible: false });

            let lastRelease = new FeatureLayer({
                url: "https://trial.discomap.eea.europa.eu/arcgis/rest/services/N2kBackbone/Map/MapServer/1",
                id: 1,
                popupEnabled: true,
                title: "Last Release",
                opacity: 0.5,
              });

            let reportedSpatial = new FeatureLayer({
                url: "https://trial.discomap.eea.europa.eu/arcgis/rest/services/N2kBackbone/Map/MapServer/0",
                id: 0,
                popupEnabled: true,
                title: "Reported Geometries",
                opacity: 0.5,
            });

            /*reportedSpatial.featureEffect = new FeatureEffect({
                filter: new FeatureFilter({
                  where: "SiteCode = '" + this.props.siteCode + "'"
                }),
                excludedEffect: "grayscale(100%) opacity(30%)"
              });*/

            this.map = new Map({
              basemap: "topo",
              layers: [lastRelease,reportedSpatial]
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

            this.view.popup.visibleElements={closeButton:false};
            this.view.popup.dockOptions={buttonEnabled: false};
            this.view.popup.defaultPopupTemplateEnabled = true;
            this.view.popup.autoOpenEnabled = true;

            this.getReportedGeometry(reportedSpatial,this.props.siteCode);

        });        

    }

    getReportedGeometry(layer,code){
        let query = layer.createQuery();
        query.where = "SiteCode = '" + code + "'";
        layer.queryFeatures(query)
        .then(
            res =>{
                for(let i in res.features){
                    let feat = res.features[i];
                    this.view.extent = feat.geometry.extent;
                    let polylineSymbol = {
                                             type: "simple-line",  // autocasts as SimpleLineSymbol()
                                             color: [226, 119, 40],
                                             width: 2
                                         };
                    feat.symbol = polylineSymbol;                                         
                    this.view.graphics.add(feat);
                }
            }
        );

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
