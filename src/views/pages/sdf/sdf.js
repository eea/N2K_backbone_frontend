import ConfigData from '../../../config.json';
import React, { useState } from 'react'
import { AppHeader } from '../../../components/index'
import {DataLoader} from '../../../components/DataLoader';
import {
  CRow,
  CCol,
  CButton,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react'

import MapViewer from '../../../components/MapViewer'

  const jsonData = {
   "SiteInfo": {
      "SiteName": "Urdaibaiko Itsasadarra / Ría de Urdaibai",
      "Country": "Spain",
      "Directive": "A",
      "SiteCode": "ES0000144",
      "Area": 3242,
      "Est": 2000,
      "MarineArea": 44.0,
      "Habitats": 16,
      "Species": 122
    },
    "SiteIdentification": {
      "Type": "A",
      "SiteCode": "ES0000144",
      "SiteName": "Urdaibaiko Itsasadarra / Ría de Urdaibai",
      "FirstCompletionDate": "2000-07",
      "UpdateDate": "2021-10",
      "Respondent": {
        "Name/Organisation": "Dirección de Patrimonio Natural y Cambio Climático. Gobierno Vasco",
        "Address": "Dirección",
        "Email": "biodiversidad@euskadi.eus"
      },
      "SiteDesignation": [
        {
          "DateSPA": "2000-11",
          "ReferenceSPA": "DECRETO 358/2013, de 4 de junio, por el que se designan Zonas Especiales de Conservación 4 lugares de importancia comunitaria del ámbito de Urdaibai y San Juan de Gaztelugatxe y se aprueban las medidas de conservación de dichas ZEC y de la ZEPA Ría de Urdaibai: http://www.lehendakaritza.ejgv.euskadi.eus/r48-bopv2/es/bopv2/datos/2013/12/1305570a.pdf"
        },
        {
          "ProposedSCI": "2004-05",
          "ConfirmedSCI": "2004-05",
          "DesignatedSCI": "2004-05",
          "ReferenceSPA": "http://www.likumi.lv/doc.php?id=22697"
        }
      ]
    },
    "SiteLocation": {
      "SiteCentre": {
        "Longitude": -2.694700,
        "Latitude": 43.388000
      },
      "Area": 3242.3100,
      "MarineArea": 44.00,
      "SiteLength": "",
      "Region": {
        "NUTS level 2 code": "ES21",
        "Region Name": "País Vasco"
      },
      "BiogeographicalRegions": [
        {"Atlantic":56.2},{"Marine Atlantic":43.98}
      ]
    },
    "EcologicalInformation": {
      "HabitatTypes": [
        {
          "Habitat Name": "Sandbanks which are slightly covered by sea water all the time",
          "Code": 1110,
          "PF": "",
          "NP": "",
          "Cover [ha]": "",
          "Cave": "",
          "Data Quality": "",
          "Representativity": "",
          "Relative Surface": "",
          "Conservation": "",
          "Global": "",
        },
        {
          "Habitat Name": "Sandbanks which are slightly covered by sea water all the time",
          "Code": 1110,
          "PF": "",
          "NP": "",
          "Cover [ha]": "",
          "Cave": "",
          "Data Quality": "",
          "Representativity": "",
          "Relative Surface": "",
          "Conservation": "",
          "Global": "",
        },
        {
          "Habitat Name": "Sandbanks which are slightly covered by sea water all the time",
          "Code": 1110,
          "PF": "",
          "NP": "",
          "Cover [ha]": "",
          "Cave": "",
          "Data Quality": "",
          "Representativity": "",
          "Relative Surface": "",
          "Conservation": "",
          "Global": "",
        },
        {
          "Habitat Name": "Sandbanks which are slightly covered by sea water all the time",
          "Code": 2110,
          "PF": "",
          "NP": "",
          "Cover [ha]": "",
          "Cave": "",
          "Data Quality": "",
          "Representativity": "",
          "Relative Surface": "",
          "Conservation": "",
          "Global": "",
        },
        {
          "Habitat Name": "Sandbanks which are slightly covered by sea water all the time",
          "Code": 4030,
          "PF": "",
          "NP": "",
          "Cover [ha]": "",
          "Cave": "",
          "Data Quality": "",
          "Representativity": "",
          "Relative Surface": "",
          "Conservation": "",
          "Global": "",
        },
        {
          "Habitat Name": "Sandbanks which are slightly covered by sea water all the time",
          "Code": 9260,
          "PF": "",
          "NP": "",
          "Cover [ha]": "",
          "Cave": "",
          "Data Quality": "",
          "Representativity": "",
          "Relative Surface": "",
          "Conservation": "",
          "Global": "",
        },
      ],
      "Species": [
        {
          "Species Name": "Acrocephalus arundinaceus",
          "Code": "A298",
          "Group": "B",
          "S": "",
          "NP": "",
          "Type": "",
          "Min": "",
          "Max": "",
          "Unit": "",
          "Cat.": "",
          "D.equal": "",
          "Pop.": "",
          "Con.": "",
          "Iso.": "",
          "Glo.": "",
        },
      ],
      "OtherSpecies": [
        {
          "Species Name": "Acrocephalus arundinaceus",
          "Code": "A298",
          "Group": "B",
          "S": "",
          "NP": "",
          "Type": "",
          "Min": "",
          "Max": "",
          "Unit": "",
          "Cat.": "",
          "D.equal": "",
          "Pop.": "",
          "Con.": "",
          "Iso.": "",
          "Glo.": "",
        },
      ]
    },
    "SiteDescription": {
      "GeneralCharacter": [
        {
          "Code": "N01",
          "Cover [%]": 10.5,
        },
        {
          "Code": "N02",
          "Cover [%]": 10.5,
        },
        {
          "Code": "N03",
          "Cover [%]": 10.5,
        },
        {
          "Code": "N04",
          "Cover [%]": 10.5,
        },
        {
          "Code": "N05",
          "Cover [%]": 10.5,
        },
      ],
      "Quality": "Este espacio fue declarado Reserva de la Biosfera en 1984 y Biotopo Protegido en 1998, gozando de un régimen normativo específico dirigido a preservar sus valores naturales y a ordenar el aprovechamiento de sus recursos. Así mismo, en 2009 se designó Humedal de Importancia Internacional Ramsar la Ría de Mundaka-Gernika. Las áreas de especial valor son las marismas, los acantilados, islotes, enclaves dunares y los encinares cantábricos. Las marismas existentes en Urdaibai son las más extensas y mejor conservadas de la costa vasca. Su conjunto compone una excelente variedad de hábitats y fitocenosis, algunas de cuyas representaciones son de carácter excepcional. El hábitat marismeño y sus comunidades específicas tienen en este espacio un desarrollo de primer orden, tanto en diversidad como en extensión, abarcando un espectro muy completo desde el medio más salino hasta el dulceacuícola. En la playa de Laga, y sometida a una intensa afluencia turística, se encuentra una pequeña representación de la vegetación adaptada a los acúmulos de arenas litorales, excepcional en la costa vasca. Los acantilados y roquedos litorales de Ogoño, Gaztelugatx, y las islas de Izaro y Aketz albergan especies de flora destacables por su rareza e interés corológico, como Armeria euscadiensis o Lavatera arborea. El interés faunístico de las zonas de marismas es excepcional en la CAPV, y muy destacado en el conjunto de la cornisa cantábrica. Su importancia como escala de paso para aves migratorias y como área de invernada regular hacen de este espacio un área ornitológicamente relevante en el contexto europeo: es, uno de los humedales más importantes del litoral cantábrico como área de reposo y alimentación en las rutas migratorias de espátulas (Platalea leucorodia) y águilas pescadoras (Pandion haliaetus). Los acantilados e islas albergan colonias de cría de aves litorales el cormorán moñudo (Phalacrocorax aristotelis), el paíño europeo (Hydrobates pelagicus), la garceta común (Egretta garzetta) y el halcón peregrino (Falco peregrinus). También se dan cita en la ZEPA otras especies importantes desde el punto de vista regional como el gavilán (Accipiter nisus), la curruca cabecinegra (Sylvia melanocephala) o el pico menor (Dendrocopos minor). Es de reseñar también la presencia de otras especies de interés regional, como Brachytron pratense, la anguila (Anguilla anguilla), la rana patilarga (Rana iberica), o el galápago leproso (Mauremys leprosa).",
      "Threats": {
        "Negative": [
          {
            "Rank": "L",
            "Threats and pressures": "A02",
            "Pollution (optional)": "",
            "Origin": "b"
          },
          {
            "Rank": "L",
            "Threats and pressures": "B02.01.02",
            "Pollution (optional)": "",
            "Origin": "i"
          }
        ],
        "Positive": [
          {
            "Rank": "M",
            "Threats and pressures": "M02.04",
            "Pollution (optional)": "",
            "Origin": "o"
          },
          {
            "Rank": "M",
            "Threats and pressures": "M02.04",
            "Pollution (optional)": "",
            "Origin": "b"
          }
        ]
      },
      "Ownership": [
        {
          "Type": "National/Federal",
          "[%]": 0
        },
        {
          "Type": "State/Province",
          "[%]": 0
        },
        {
          "Type": "Local/Municipal",
          "[%]": 0
        },
        {
          "Type": "Any Public",
          "[%]": 0
        },
        {
          "Type": "Joint or Co-Ownership",
          "[%]": 0
        },
        {
          "Type": "Private",
          "[%]": 0
        },
        {
          "Type": "Unknown",
          "[%]": 0
        },
        {
          "Type": "Sum",
          "[%]": 100
        }
      ],
      "Documentation": [
        {
          "Documents":"Benito, I. y Onanidia, M. (1991). Estudio de distribución de las plantas halófilas y su relación con los factores ambientales en la marisma de Mundaka-Urdaibai. Cuadernos de Sección. Ciencias Naturales 8. Benito, I., Onanidia, M. y Martínez, E. (1988). Estructura de la vegetación halófita en la marisma de Mundaka. Actas del Congreso de Biología Ambiental (II Congreso Mundial): 275-286. Universidad del País Vasco. Gobierno Vasco. Bolue Estudios Ambientales (2006) Galápagos acuáticos, en la Reserva de la Biosfera de Urdaibai. Informe inédito para el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. 52 pp. Cadiñanos, J.A. (1996). Metodología de evaluación del interés naturalístico y de conservación de unidades de vegetación. Aplicación en la Reserva de la Biosfera de Urdaibai. Trabajo de investigación inédito realizado para el Departamento de Urbanismo, Vivienda y Medio Ambiente del Gobierno Vasco. 286 pp. Campos, J.A., y Silván, F. (2001). Flora Amenazada de la Reserva de la Biosfera de Urdaibai. Departamento de Medio Ambiente y Ordenación del Territorio. Gobierno Vasco. Consultora de Recursos Naturales, S.L. (2007). Anteproyecto de mejora ambiental de las marismas de Gautegiz-Arteaga, Reserva de la Biosfera de Urdaibai (Bizkaia). Patronato de la Reserva de la Biosfera de Urdaibai. Gobierno Vasco. Consultora de Recursos Naturales, S.L. (2007). Estudio de la incidencia de los tendidos eléctricos sobre la avifauna de Urdaibai. Aproximación a la problemática en la CAPV. Informe inédito promovido por el Ente Vasco de la Energía (EVE). 93 pp. Consultora de Recursos Naturales, S.L. (2006). Estudio de la accidentalidad de la fauna en las vías de comunicación de la Reserva de la Biosfera de Urdaibai (Bizkaia). Informe inédito para la Oficina Técnica del Patronato de la Reserva de la Biosfera de Urdaibai. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca. Gobierno Vasco. Consultora de Recursos Naturales, S.L. (2001). Estudio herpetológico en la Reserva de la Biosfera de Urdaibai. Informe inédito para el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. 49 pp. CRN (Consultores Independientes en Gestión de Recursos Naturales, S.A.) (2005). Inventario de Puntos de Interés Geológico en la Reserva de la Biosfera de Urdaibai (Bizkaia). Departamento de Medio Ambiente, Planificación Ambiental, Agricultura y Pesca de Gobierno Vasco. 230 pp. Del Villar, J. y Garaita, R. (2004). Seguimiento de las poblaciones de aves costeras de la Reserva de la Biosfera y ZEPA de Urdaibai. Informe 2004. Informe inédito. Del Villar, J., Garaita, R. y Prieto, A. (2007). La Espátula en la Reserva de la Biosfera de Urdaibai: diez años de seguimiento. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. Vitoria-Gasteiz.82 pp. EKOS, Asesoría e Investigación Medioambiental (2005). Cartografía de Flora Amenazada de la Reserva de la Biosfera de Urdaibai. Dirección de Biodiversidad y Participación Ambiental. Departamento de Medio Ambiente y Ordenación del Territorio. Gobierno Vasco. 45 pp. Etxezarreta, J. (1993 a 2001). Informes sobre Jornadas de Anillamiento (1993-2001) del Paíño europeo (Hydrobates pelagicus) en la isla de Aketx (Bermeo-Bizkaia). Sociedad de Ciencias Aranzadi. Informe inédito. Fundación Urdaibai (2007). Estudio y caracterización de puntos negros para el visón europeo (Mustela lutreola) en la Reserva de la Biosfera de Urdaibai. Diagnóstico, problema y medidas correctoras. Informe subvencionado por el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. 87 pp. Galarza, A. (Dir.) (2009) Plan de viabilidad para el establecimiento de un núcleo reproductor de Águila pescadora en la Reserva de la Biosfera de Urdaibai. Informe inédito de Fundación Urdaibai para el Departamento de Agricultura de la Diputación Foral de Bizkaia. 63 pp. Galarza, A. (1989). Avifauna de la ría de Gernika. Diputación Foral de Bizkaia. Bilbao. Galarza, A. y Hidalgo, J. (2006). Diagnosis de la fauna vertebrada asociada a los carrizales de la Reserva de la Biosfera de Urdaibai: censo y cartografía de la avifauna (2005/2006). Informe inédito de la Fundación Urdaibai. 36 pp. Garaita, R. (2010). Migración postnupcial de la Espátula común (Platalea leucorodia) en Urdaibai. Departamento de Medio Ambiente y Ordenación del Territorio. Gobierno Vasco. 78 pp. Garaita, R. y Del Villar, J. (2008). El paíño europeo (Hydrobates pelagicus) en Urdaibai. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca. Gobierno Vasco. 42 pp. Garaita, R. y Del Villar, J. (2006). La gaviota patiamarilla (Larus michahellis) en Urdaibai. Departamento de Medio Ambiente y Ordenación del Territorio. Gobierno Vasco. 26 pp. Gurrutxaga San Vicente, M. (2005). Red de Corredores Ecológicos de la Comunidad Autónoma de Euskadi. Informe de IKT, S.A. para el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. 145 pp. Hidalgo, J. y Del Villar, J. (2004). Guía de aves acuáticas de Urdaibai. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. Vitoria-Gasteiz. 237 pp. Meaza Rodríguez, G. (1993). Tendencias de cambio en la vegetación marismal de la Reserva de la Biosfera de Urdaibai (Vizcaya): la trascendencia de la impronta antrópica. XII Congreso N. de Geografía, Sevilla, pp. 605-610. Mendia, M., Monge-Ganuzas, M., Díaz, G., González, J. y Albizu, X. (2011) Urdaibai: Guía de lugares de interés geológico. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca. Gobierno Vasco. 356 pp. Pagola Carte, S. y Maguregi Arenaza, J. (2009). Oxygastra curtisii (Dale, 1834) (Insecta: Odonata: Corduliidae) en la Reserva de la Biosfera de Urdaibai. Estudio de las poblaciones y medidas de conservación de una libélula de interés comunitario. Segunda fase. Centro de Biodiversidad de Euskadi. Madariaga Dorretxea. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca. Gobierno Vasco. Busturia. 78 pp. Prieto Fernández, A. (2007). Seguimiento de la flora vascular amenazada en la Reserva de la Biosfera de Urdaibai. Dirección de Biodiversidad y Participación Ambiental. Departamento de Medio Ambiente y Ordenación del Territorio. Gobierno Vasco. Prieto, A. y del Villar, J. (2010) Urdaibai: guía de flora. Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca. Gobierno Vasco. 394 pp. Rallo, A., Aihartza, J. R., Garin, I., Zabala, J., Zuberogoitia, I., Clevenger, A.P. y Gómez, M. (2001). Inventario, Distribución y Uso del Espacio de los Mamíferos de la Reserva de la Biosfera de Urdaibai. Departamento de Educación, Universidades e Investigación de la Universidad Pública del País Vasco y el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. 104 pp. Sociedad de Ciencias Aranzadi (1983). Estudio del medio físico del valle y estuario de la ría de Mundaka-Gernika. Informe inédito. Sociedad de Ciencias Aranzadi-Observatorio de Herpetología (2009). Las lagartijas de Gaztelugatxe. Publicación divulgativa para el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. Tragsa. (2011). Proyecto de Restauración Integral del Estuario Superior de la Ría del Oka. Reserva de la Biosfera de Urdaibai (Bizkaia). Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca. Ugarte San Vicente, I. (2005). Coleópteros fitófagos (Insecta: Coleoptera) de los Encinares Cantábricos de la Reserva de la Biosfera de Urdaibai. Informe de la Asociación naturalística Amalur Natura Elkartea para el Departamento de Medio Ambiente, Planificación Territorial, Agricultura y Pesca de Gobierno Vasco. 206 pp."
        },
        {
          "Links": "Información del sitio actualizada en la Web del Gobierno Vasco: http://www.ingurumena.ejgv.euskadi.net/r49-u95/es/u95aWar/lugaresJSP/U95aEConsultaLugar.do?pk=1"+
          "Información del sitio actualizada en la Web del Gobierno Vasco: http://www.ingurumena.ejgv.euskadi.net/r49-u95/es/u95aWar/lugaresJSP/U95aEConsultaLugar.do?pk=1"+
          "Información del sitio actualizada en la Web del Gobierno Vasco: http://www.ingurumena.ejgv.euskadi.net/r49-u95/es/u95aWar/lugaresJSP/U95aEConsultaLugar.do?pk=1"+
          "Información del sitio actualizada en la Web del Gobierno Vasco: http://www.ingurumena.ejgv.euskadi.net/r49-u95/es/u95aWar/lugaresJSP/U95aEConsultaLugar.do?pk=1"+
          "5. SITE PROTECTION STATUS"
        }
      ]
    },
    "SiteProtectionStatus": {
      "DesignationTypes": [
        {
          "Code": "ES90",
          "Cover [%]": 4.90
        }
      ],
      "RelationSites": [
        {
          "Designation Level": "National or regional",
          "Type Code": "",
          "Site Name": "Urdaibai",
          "Type": "*",
          "Cover [%]" : 59.50
        },
        {
          "Designation Level": "National or regional",
          "Type Code": "",
          "Site Name": "Mundaka-Gernikako itsasadarra",
          "Type": "+",
          "Cover [%]" : 28.10
        },
        {
          "Designation Level": "National or regional",
          "Type Code": "ES90",
          "Site Name": "Gaztelugatxe",
          "Type": "+",
          "Cover [%]" : 3.0
        },
        {
          "Designation Level": "International",
          "Type Code": "Other",
          "Site Name": "Urdaibai",
          "Type": "*",
          "Cover [%]" : 59.50
        },
        {
          "Designation Level": "International",
          "Type Code": "Other",
          "Site Name": "Mundaka-Gernikako itsasadarra",
          "Type": "+",
          "Cover [%]" : 28.10
        },
      ],
      "SiteDesignation": "Decreto 229/1998, de 15 de septiembre, por el que se declara Biotopo protegido el área de Gaztelugatxe. http://www.euskadi.net/bopv2/datos/1998/10/9804403a.pdf Ley 5/1989 de Protección y Ordenación de la Reserva de la Biosfera de Urdaibai: http://www.ingurumena.ejgv.euskadi.net/r49-12872/es/contenidos/normativa/legislacion_urdaibai/es_15308/adjuntos/ley.pdf"
    },
    "SiteManagement": {
      "BodyResponsible": [
        {
          "Organisation": "Diputación Foral de Bizkaia",
          "Address": "",
          "Email": "espacios.naturales.protegidos@bizkaia.eus",
        },
        {
          "Organisation": "Gobierno Vasco",
          "Address": "",
          "Email": "urdaibai@euskadi.eus",
        }
      ],
      "ManagementPlan": [
        {
          "Name": "Información ecológica, objetivos y medidas de conservación.",
          "Link": "http://www.ingurumena.ejgv.euskadi.eus/r49-u95a/es/u95aWar/lugaresJSP/U95aSubmitLugar.do?pk=1&bloque=024"
        },
        {
          "Name": "Mapa de delimitación",
          "Link": "http://www.euskadi.net/r33-bopvmap/es?conf=BOPV/capas/Urdaibai/Urdaibai.xml"
        }
      ],
      "ConservationMeasures":"Documentación completa: http://www.ingurumena.ejgv.euskadi.eus/r49-u95a/es/u95aWar/lugaresJSP/U95aSubmitLugar.do?pk=1&bloque=024 Información sobre el lugar: http://www.ingurumena.ejgv.euskadi.eus/r49-u95a/es/u95aWar/comunJSP/u95aConsultaBioAccesoExterno.do?codBio=1 Otras medidas de conservación: Reserva de la Biosfera de Urdaibai: http://www.ingurumena.ejgv.euskadi.net/r49-12872/es/contenidos/normativa/legislacion_urdaibai/es_15308/indice.html http://www.ingurumena.ejgv.euskadi.eus/r49-u95a/es/u95aWar/comunJSP/u95aConsultaBioAccesoExterno.do?codBio=1"
    },
    "MapOfTheSite": {
      "INSPIRE": "",
      "MapDelivered": "No"
    }
  }

const SDFVisualization = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [activeKey, setActiveKey] = useState(1);
  const [siteCode, setSiteCode] = useState("");

  let dl = new(DataLoader);

  const getSiteCode = () => {
    let query = window.location.hash.split("?")[1];
    let params = new URLSearchParams(query);
    let siteCode = params.get("sitecode")
    setSiteCode(siteCode ? siteCode : "ES0000144"); 
  }

  const showMap = () => {
    return (
      <div className='sdf-map'>
        <MapViewer  
          siteCode={"AT1101112"}
          reportedSpatial={ConfigData.REPORTED_SPATIAL}
        />
      </div>
    )
  }

  const loadData = () => {
    if(siteCode !=="" && !isLoading) {
      setIsLoading(true);
      dl.fetch(ConfigData.SITEDETAIL_GET+"?siteCode="+siteCode)
      .then(response =>response.json())
      .then(data => {
        if(data?.Success) {
          if(Object.keys(data.Data).length === 0){
            setData("nodata");
          }
          else {
            setData(jsonData);
          }
        } else { setErrorLoading(true) }
        setIsLoading(false);
      });
    }
  }
  
  const showMainData = () => {
    return (
      <div className="sdf-header header--custom">
        <CRow className='sdf-title'>
          <CCol className='col-auto'>
            <h1>{data.SiteInfo.SiteName.toUpperCase()}</h1>
          </CCol>
          <CCol className='col-auto ms-auto'>
            <CButton color="white" onClick={()=>{window.print()}}>
              <i className="fa-solid fa-download"></i> Download PDF
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <div>
            {data.SiteInfo.Country}
          </div>
          <div>
            {ConfigData.SDI.SiteType[data.SiteInfo.Directive]}
          </div>
        </CRow>
        <CRow className="sdf-header-items">
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.SiteCode}</b>
            <div>SITE CODE</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Area} ha</b>
            <div>AREA</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Est}</b>
            <div>SITE ESTABLISHED</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.MarineArea} %</b>
            <div>MARINE AREA</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Habitats}</b>
            <div>HABITATS</div>
          </CCol>
          <CCol xs={12} md={6} lg={4} xl={2}>
            <b>{data.SiteInfo.Species}</b>
            <div>SPECIES</div>
          </CCol>
        </CRow>
      </div>
    );
  }

  const showTabs = () => {
    return (
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            {ConfigData.SDI.Titles[0]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            {ConfigData.SDI.Titles[1]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 3}
            onClick={() => setActiveKey(3)}
          >
            {ConfigData.SDI.Titles[2]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 4}
            onClick={() => setActiveKey(4)}
          >
            {ConfigData.SDI.Titles[3]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 5}
            onClick={() => setActiveKey(5)}
          >
            {ConfigData.SDI.Titles[4]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 6}
            onClick={() => setActiveKey(6)}
          >
            {ConfigData.SDI.Titles[5]}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            href="javascript:void(0);"
            active={activeKey === 7}
            onClick={() => setActiveKey(7)}
          >
            {ConfigData.SDI.Titles[6]}
          </CNavLink>
        </CNavItem>
      </CNav>
    );
  }

  if(!siteCode) {
    getSiteCode();
  }

  if(siteCode && Object.keys(data).length === 0) {
    loadData();
  }

  return (
    <div className="container--main min-vh-100">
      <AppHeader page="sdf"/>
        {isLoading ?
          <div className="loading-container"><em>Loading...</em></div>
        :
        siteCode && Object.keys(data).length > 0 &&
            <>
            {showMap()}
            {showMainData()}
            <CContainer fluid>
              <CRow className="p-3">
                {showTabs()}
              </CRow>
              <CTabContent>
                {renderTab(activeKey, data)}
              </CTabContent>
            </CContainer>
          </>
        }
    </div>
  );
}

const transformData = (activekey, data) => {
  switch(activekey) {
    case 1:
      return data.SiteIdentification;
    case 2:
      return data.SiteLocation;
    case 3:
      return data.EcologicalInformation;
    case 4:
      return data.SiteDescription;
    case 5:
      return data.SiteProtectionStatus;
    case 6:
      return data.SiteManagement;
    case 7:
      return data.MapOfTheSite;
  }
}

const tabStructure = (activekey, data) => {
  let fields = [];
  for(let i in Object.entries(data)){
    let field = Object.entries(data)[i];
    let index = activekey + "." + (parseInt(i)+1);
    let title;
    let value;
    let type;
    let layout;

    switch(activekey) {
      case 1:
        switch(field[0]) {
          case "Type":
            title = "Type";
            value = field[1];
            type = "value";
            break;
          case "SiteCode":
            title = "Site Code";
            value = field[1];
            type = "value";
            break;
          case "SiteName":
            title = "Site Name";
            value = field[1];
            type = "value";
            break;
          case "FirstCompletionDate":
            title = "First Compilation date";
            value = field[1];
            type = "value";
            break;
          case "UpdateDate":
            title = "Update date";
            value = field[1];
            type = "value";
            break;
          case "Respondent":
            title = "Respondent";
            value = field[1];
            type = "value";
            break;
          case "SiteDesignation":
            title = "Site indication and designation / classification dates";
            value = field[1];
            type = "array";
            break;
        }
        break;
      case 2:
        switch(field[0]) {
          case "SiteCentre":
            title = "Site-centre location [decimal degrees]";
            value = field[1];
            type = "value";
            layout = 2;
            break;
          case "Area":
            title = "Area [ha]";
            value = field[1];
            type = "value";
            layout = 2;
            break;
          case "MarineArea":
            title = "Marine area [%]";
            value = field[1];
            type = "chart";
            layout = 2;
            break;
          case "SiteLength":
            title = "Sitelength [km] (optional)";
            value = field[1];
            type = "value";
            layout = 2;
            break;
          case "Region":
            title = "Administrative region code and name";
            value = field[1];
            type = "value";
            break;
          case "BiogeographicalRegions":
            title = "Biogeographical Region(s)";
            value = field[1];
            type = "chart";
            break;
        }
        break;
      case 3:
        switch(field[0]) {
          case "HabitatTypes":
            title = "Habitat types present on the site and assessment for them";
            value = field[1];
            type = "combo";
            break;
          case "Species":
            title = "Species referred to in Article 4 of Directive 2009/147/EC and listed in Annex II of Directive 92/43/EEC and site evaluation for them";
            value = field[1];
            type = "combo";
            break;
          case "OtherSpecies":
            title = "Other important species of flora and fauna (optional)";
            value = field[1];
            type = "table";
            break;
        }
        break;
      case 4:
        switch(field[0]) {
          case "GeneralCharacter":
            title = "General site character";
            value = field[1];
            value = value.map(obj => ({"Habitat Class": ConfigData.SDI.HabitatClasses[obj.Code], ...obj}));
            let total = value.map(a=> a["Cover [%]"]).reduce((a, b) => a + b, 0);
            value.push({"Habitat Class":"Total Habitat Code", "Code":"","Cover [%]":total});
            type = "table";
            break;
          case "Quality":
            title = "Quality and importance";
            value = field[1];
            type = "value";
            break;
          case "Threats":
            title = "Threats, pressures and activities with impacts on the site";
            value = field[1];
            type = "double-table";
            break;
          case "Ownership":
            title = "Ownership (optional)";
            value = field[1];
            type = "table";
            break;
          case "Documentation":
            title = "Documentation (optional)";
            value = field[1];
            type = "array";
            break;
        }
        break;
      case 5:
        switch(field[0]) {
          case "DesignationTypes":
            title = "Designation types at national and regional level (optional)";
            value = field[1];
            type = "array";
            break;
          case "RelationSites":
            title = "Relation of the described site with other sites (optional)";
            value = field[1];
            type = "table";
            break;
          case "SiteDesignation":
            title = "Site designation (optional)";
            value = field[1];
            type = "value";
            break;
        }
        break;
      case 6:
        switch(field[0]) {
          case "BodyResponsible":
            title = "Body(ies) responsible for the site management";
            value = field[1];
            type = "array";
            break;
          case "ManagementPlan":
            title = "Management Plan(s)";
            value = field[1];
            type = "array";
            break;
          case "ConservationMeasures":
            title = "Conservation measures (optional)";
            value = field[1];
            type = "value";
            break;
        }
        break
      case 7:
        switch(field[0]) {
          case "INSPIRE":
            title = "INSPIRE ID";
            value = field[1];
            type = "value";
            break;
          case "MapDelivered":
            title = "Map delivered as PDF in electronic format (optional)";
            value = field[1];
            type = "value";
            break;
        }
    }
    if (!value) {
      value = "No information provided";
    }

    const dataType = (field, type, data) => {
      switch (type) {
        case "value":
          return (
            <div className="sdf-row-field">
              {typeof data === 'object' ? Object.entries(data).map(a => <p><b>{a[0]}</b>: {a[1] ? a[1] : "No information provided"}</p>) : data}
            </div>
          )
        case "array":
          return (
            Array.isArray(data) && data.map((a) => 
              <div className="sdf-row-field">
                {typeof a === 'object' ? Object.entries(a).map(b => <p><b>{b[0]}</b>: {b[1] ? b[1] : "No information provided"}</p>) : a[1]}
              </div>
            )
          )
        case "chart":
          return (
            <div className="piechart-container">
            {Array.isArray(value) ? value.map((a) =>
              Object.entries(a).map(b => 
              <div className="piechart-item">
                <div className="piechart" data-progress={b[1].toFixed(2)} data-label={b[0]} style={{"--progress": (b[1]*360/100+"deg")}}>{b[1]}%</div>
                <label>{b[0]}</label>
              </div>
              )
            )
            : <div className="piechart" data-progress={value.toFixed(2)} style={{"--progress": (value*360/100+"deg")}}>{value}%</div>}
            </div>
          )
        case "table": case "combo":
          let indicators;
          let codes = [];
          var count = {};
          if(type === "combo") {
            if(field === "HabitatTypes") {
              codes = value.map(a=> ConfigData.SDI.HabitatTypes[parseInt(a.Code.toString().substring(0, 1))]);
            }
            else if(field === "Species") {
              codes = value.map(a=> ConfigData.SDI.Species[a.Group]);
            }
            codes.forEach((i) => { count[i] = (count[i]||0) + 1;});
            indicators = 
              <CRow className="indicators-container">
                {Object.entries(count).map((a,i)=>
                  <CCol xs={12} md={6} lg={4} xl={3} key={"i_"+[i]}>
                    <div className="indicators-item">
                      <div className="indicators-number">{a[1]}</div>
                      <div className="indicators-title">{a[0]}</div>
                    </div>
                  </CCol>
                )}
              </CRow>
          }
          let tooltips = ConfigData.SDI.Tooltips;
          let header = Object.keys(value[0]).map(a => { 
            return (
              <th scope="col" key={a}>{a}
                {
                  tooltips[field] && tooltips[field][a] &&
                  <span tooltips={tooltips[field][a]}>
                    <i className="fa-solid fa-circle-info"></i>
                  </span>
                }
              </th>
            )
          });
          let body = value.map((row, i) => {
            return (
              <tr key={"tr_"+i}>
                {Object.keys(value[0]).map((cell, ii) => {
                  return <CTableDataCell key={"tc_"+i+ii}><span>{row[cell]}</span></CTableDataCell>
                })}
              </tr>
            )
          });
          
          return (
          <>
            {type === "combo" && indicators}
            <div className="sdf-row-field">
              <CTable>
                <CTableHead>
                  <CTableRow>
                    {header}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {body}
                </CTableBody>
              </CTable>
            </div>
          </>
          )
        case "double-table":
          let tables = [];
          let indicator;
          let color;
          Object.entries(value).map( a => {
            if(a[0] === "Negative") {
              indicator = {"Threats and pressures":a[1].length};
              color = "red"
            }
            else if (a[0] === "Positive") {
              indicator = {"Activities and Management":a[1].length};
              color = "green";
            }
            a[1] = a[1].map(obj => ({...obj, "Origin": ConfigData.SDI.Origin[obj.Origin]}));

            let header = Object.keys(a[1][0]).map(b => {return(<CTableHeaderCell scope="col" key={b}> {b} </CTableHeaderCell>)});
            let body = a[1].map((row, i) => {
              return (
                <tr key={"tr_"+i}>
                  {Object.keys(a[1][0]).map((cell, ii) => {
                    return <CTableDataCell key={"tc_"+i+ii}>{row[cell]}</CTableDataCell>
                  })}
                </tr>
              )
            });
            tables.push(
              <CCol xs={12} md={6} lg={6} xl={6}>
                <div className="indicators-container">
                    <div className={"indicators-item " + color}>
                      <div className="indicators-number">{Object.values(indicator)}</div>
                      <div className="indicators-title">{Object.keys(indicator)}</div>
                    </div>
                  <div className="sdf-row-field">
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          {header}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {body}
                      </CTableBody>
                    </CTable>
                  </div>
                </div>
              </CCol>
            );
          });
          return (
            <CRow>
                {tables}
            </CRow>
          );
      }
    }
    
    fields.push(
      <CRow className={"sdf-row" + (layout === 2 ? " col-md-6 col-12" : "")}>
        <CCol>
          <div className='sdf-row-title'>{index + ' ' + title}</div>
            {dataType(field[0], type, value)}
        </CCol>
      </CRow>
    );
  }
  return fields;
}

const renderTab = (activekey, data) => {
  let mData = transformData(activekey, data);
  return (
    <CTabPane role="tabpanel" aria-labelledby="home-tab" visible>
      <CRow className="p-4">
        <h2>{activekey}.{ConfigData.SDI.Titles[activekey-1]}</h2>
        {tabStructure(activekey, mData)}
      </CRow>
    </CTabPane>
  );
}

export default SDFVisualization;
