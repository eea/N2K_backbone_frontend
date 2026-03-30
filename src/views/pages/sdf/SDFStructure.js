import React, { useState } from "react";
import ConfigSDF from "./sdf_config.json";
import MapViewer from '../../../components/MapViewer';
import {
  CRow,
  CCol,
  CContainer,
  CTableDataCell,
} from '@coreui/react'

const SDFVisualization = (props) => {

  const [data, setData] = useState(props.data);
  const [order, setOrder] = useState([]);
  const siteCode = props.siteCode;
  const release = props.release;

  const scrollTo = (item) => {
    event.stopPropagation();
    event.preventDefault();
    let element = document.getElementById(item);
    const y = element.getBoundingClientRect().top + window.scrollY;
    window.history.pushState(null, null, window.location.href.split("&nav")[0] + "&nav=" + item);
    window.scroll({
      top: y,
      behavior: 'instant'
    });
  }

  const showMap = () => {
    return (
      <div className="sdf-map px-4 pb-5">
              <i className="fas fa-arrow-up"></i>
        <MapViewer
          siteCode={siteCode}
          release={release}
          mapSubmission={props.mapUrl}
        />
      </div>
    )
  }

  const showMainData = () => {
    return (
      <CContainer fluid className="sdf-index">
        <CRow className="p-4">
          <CCol>
            <h2>Table of contents</h2>
            <ol>
              {Object.keys(data).filter(a => a !== "SiteInfo").map((a, i) => <a href="#" data-id={i + 1} key={i} onClick={(e) => scrollTo(e.currentTarget.dataset.id)}><li>{ConfigSDF.Titles[i]}</li></a>)}
            </ol>
          </CCol>
        </CRow>
      </CContainer>
    );
  }

  const formatDate = (date, ddmmyyyy) => {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    if (ddmmyyyy) {
      date = (d <= 9 ? "0" + d : d) + "/" + (m <= 9 ? "0" + m : m) + "/" + y;
    }
    else {
      date = (y + "-" + (m <= 9 ? "0" + m : m));
    }
    return date;
  };

  const sectionsContent = (activekey, data, section) => {
    let fields = [];
    for (let i in Object.entries(data)) {
      let field = Object.entries(data)[i];
      let index;
      let title;
      let value;
      let type;
      let layout;
      let legend;
      switch (activekey) {
        case 1:
          switch (field[0]) {
            case "F_1_1_site_type":
              index = "1.1";
              title = "Site type";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_2_site_code":
              index = "1.2";
              title = "Site code";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_3_site_name":
              index = "1.3";
              title = "Site name";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_3_1_site_name_nonLatin":
              index = "1.3.1";
              title = "Site name non-latin alphabet (optional)";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "Respondent":
              index = "1.4";
              title = "Respondent";
              value = field[1];
              type = "single";
              break;
            case "F_1_4_1_respond_name":
              index = "1.4.1";
              title = "Name of the organisation";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_4_2_respond_contact":
              index = "1.4.2";
              title = "Contact point in the organisation (optional)";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_4_3_respond_address":
              index = "1.4.3";
              title = "Postal address";
              value = field[1];
              type = "single";
              break;
            case "F_1_4_4_respond_email":
              index = "1.4.4";
              title = "Functional mailbox email address";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_4_5_respond_URI":
              index = "1.4.5";
              title = "Website with contact information";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_5_1_SPA_date":
              index = "1.5.1";
              title = "Date site first classified as SPA";
              value = field[1];
              type = "single";
              break;
            case "F_1_5_2_a_SPA_act_URI":
              index = "1.5.2";
              title = "SPA classification act (URI or free text)";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_5_2_b_SPA_act_freetext":
              index = "";
              title = "";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_5_3_pSCI_date":
              index = "1.5.3";
              title = "Date site first proposed as SCI";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "cSCI_date":
              index = "";
              title = "Date confirmed as SCI";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_5_4_SAC_date":
              index = "1.5.4";
              title = "Date site designated as SAC";
              value = field[1];
              type = "single";
              break;
            case "F_1_5_5_a_SAC_act_URI":
              index = "1.5.5";
              title = "SAC designation act (URI or free text)";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_5_5_b_SAC_act_freetext":
              index = "";
              title = "";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_1_5_6_site_text":
              index = "1.5.6";
              title = "Explanations (optional)";
              value = field[1];
              type = "single";
              break;
            default:
              break;
          }
          break;
        case 2:
          switch (field[0]) {
            case "longitude":
              index = "";
              title = "Longitude";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "latitude":
              index = "";
              title = "Latitude";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_2_1_1_site_area":
              index = "2.1.1";
              title = "Area (ha)";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_2_1_2_a_area_diff":
              index = "2.1.2";
              title = "Reason for area difference with spatial dataset (if any)";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_2_1_3_a_area_diff_text":
              index = "2.1.3";
              title = "Reason for area difference - explanations";
              value = field[1];
              type = "single";
              break;
            case "F_2_2_administrative_region":
              index = "2.2";
              title = "Administrative region (optional)";
              value = field[1];
              type = "table";
              break;
            case "F_2_3_biogeographical_regions":
              index = "2.3";
              title = "Biogeographical and marine regions";
              value = field[1];
              type = "table";
              break;
            default:
              break;
          }
          break;
        case 3:
          switch (field[0]) {
            case "F_3_1_a_essential_information":
              index = "3.1.a";
              title = "Essential information (habitat type)";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.F_3_1_a_essential_information;
              break;
            case "F_3_1_b_site_assessment":
              index = "3.1.b";
              title = "Site assessment (habitat type)";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.F_3_1_b_site_assessment;
              break;
            case "F_3_2_a_essential_information":
              index = "3.2.a";
              title = "Essential information (species)";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.F_3_2_a_essential_information;
              break;
            case "F_3_2_b_site_assessment":
              index = "3.2.b";
              title = "Site assessment (species)";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.F_3_2_b_site_assessment;
              break;
            case "F_3_3_other_species":
              index = "3.3";
              title = "Other important species of flora and fauna (optional)";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.F_3_3_other_species;
              break;
            case "F_3_3_8_species_motivation":
              index = "";
              title = "Motivation";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.F_3_3_8_species_motivation;
              break;
            default:
              break;
          }
          break;
        case 4:
          switch (field[0]) {
            case "F_4_1_site_characteristics":
              index = "4.1";
              title = "Site characteristics";
              value = field[1];
              type = "single";
              break;
            case "F_4_2_site_quality":
              index = "4.2";
              title = "Quality and importance of the site";
              value = field[1];
              type = "single";
              break;
            case "F_4_3_pressures":
              index = "4.3";
              title = "Pressures on the site";
              value = field[1];
              value = value.map(item => ({
                ...item,
                F_4_3_3_pressure_location: ConfigSDF.PressureLocation[item.F_4_3_3_pressure_location]
              }));
              type = "table";
              legend = ConfigSDF.Legend.F_4_3_pressures;
              break;
            case "F_4_3_5_pressure_date":
              index = "4.3.5";
              title = "Last update of the information on the preassures on the site";
              value = field[1];
              type = "single";
              break;
            case "F_4_4_a_documentation":
              index = "4.4";
              title = "Documentation";
              value = field[1];
              type = "single";
              break;
            case "F_4_4_1_documentation_URI":
              index = "4.4.1";
              title = "Link(s)";
              value = field[1];
              type = "single";
              break;
            case "F_4_4_2_documentation_date":
              index = "4.4.2";
              title = "Last update of the documentation information";
              value = field[1];
              type = "single";
              break;
            default:
              break;
          }
          break;
        case 5:
          switch (field[0]) {
            case "F_5_1_1_a_management_body":
              index = "5.1.1";
              title = "Name of the organisation";
              value = field[1];
              type = "single";
              break;
            case "F_5_1_2_management_body_contact":
              index = "5.1.2";
              title = "Contact point in the organisation (optional)";
              value = field[1];
              type = "single";
              break;
            case "F_5_1_3_a_management_body_address":
              index = "5.1.3";
              title = "Postal address";
              value = field[1];
              type = "single";
              break;
            case "F_5_1_4_management_body_email":
              index = "5.1.4";
              title = "Functional mailbox email address";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_5_1_5_management_URI":
              index = "5.1.5";
              title = "Website with contact information";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "F_5_2_1_management_plans_exist":
              index = "5.2.1";
              title = "Existence of management plan(s)";
              value = field[1];
              type = "single";
              break;
            case "F_5_2_2_management_list":
              index = "5.2.2";
              title = "Reference and validity of the management plan(s)";
              value = field[1];
              type = "table";
              break;
            case "F_5_2_3_a_management_text":
              index = "5.2.3";
              title = "Further explanations";
              value = field[1];
              type = "single";
              break;
            case "F_5_3_1_a_measures_MP_included":
              index = "5.3.1";
              title = "Detailed information on measures \nNecessary conservation measures are included in the management plan(s)";
              value = field[1];
              type = "single";
              break;
            case "F_5_3_1_measures_list":
              index = "";
              title = "Necessary conservation measures are described in the following document(s)";
              value = field[1];
              type = "table";
              break;
            case "F_5_3_1_d_measures_text":
              index = "";
              title = "Further explanations on detailed conservation measures";
              value = field[1];
              type = "single";
              break;
            case "F_5_4_a_measures_effectiveness":
              index = "";
              title = "Is the effectiveness of the conservation measures periodically assessed?";
              value = field[1];
              type = "single";
              break;
            case "F_5_4_b_measures_results":
              index = "";
              title = "Further explanations on detailed conservation measures";
              value = field[1];
              type = "single";
              break;
            default:
              break;
          }
          break
        case 6:
          switch (field[0]) {
            case "F_6_1_1_inspire_namespace":
              index = "6.1.1";
              title = "Namespace";
              value = field[1];
              type = "single";
              break;
            case "F_6_1_2_inspire_local_id":
              index = "6.1.2";
              title = "Local identifier";
              value = field[1];
              type = "single";
              break;
            case "F_6_1_3_inspire_version":
              index = "6.1.3";
              title = "Version identifier (optional)";
              value = field[1];
              type = "single";
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
      if ((!value || value.length === 0) && value !== 0) {
        value = "";
        type = "single";
      }
      let labels = ConfigSDF[field[0]];
      if (labels) {
        if (Array.isArray(value)) {
          value = value.map(a => { let b = {}; Object.keys(a).forEach(key => b[labels[key]] = a[key] ? (isNaN(a[key]) && !isNaN(Date.parse(a[key].replaceAll(' ', ""))) ? formatDate(a[key]) : a[key]) : a[key]); return b });
        }
      }
      else {
        value = typeof value !== "object" && isNaN(value) && !isNaN(Date.parse(value.replaceAll(' ', ""))) ? formatDate(value) : value;
      }

      const parseLinks = (text) => {
        if (typeof text !== 'string') {
          return text;
        }
        const reg = new RegExp(/(https?:\/\/[^\s]+|www\.[^\s]+|[\w-]+\.com[^\s]*)/gi);
        const parts = text.split(reg);
        return parts.map((part, i) => (
          reg.test(part)
            ? <a className="sdf-link" href={part.startsWith('http') ? part : `https://${part}`} target="_blank" rel="noreferrer" key={i}>{part}</a>
            : part
        ));
      }

      const dataType = (field, type, data) => {
        switch (type) {
          case "single":
            return (
              <div className="sdf-row-field">
                {typeof data === "object" ? Object.entries(data).map(a => <p key={"v_" + a}><b>{a[0]}</b>: {a[1] ? parseLinks(a[1]) : ""}</p>) : parseLinks(data)}
              </div>
            )
          case "multiple":
            return (
              Array.isArray(data) && data.map((a, i) =>
                <div className="sdf-row-field" key={"a_" + i}>
                  {typeof a === "object" ? Object.entries(a).map(b => <p key={"b_" + b}><b>{b[0]}</b>: {b[1] ? parseLinks(b[1]) : ""}</p>) : parseLinks(a[1])}
                </div>
              )
            )
          case "table":
            let header = Object.keys(value[0]).map(a => {
              return (
                <th className={order[section + field]?.column === a ? "sorted" : ""} scope="col" key={a} onClick={() => sortFields(section, field, a)}>
                  {a}
                  {order[section + field]?.column === a && (<div className="sort-icon">{order[section + field]?.order === "asc" ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</div>)}
                </th>
              )
            });
            let checkCellLink = (cell, value) => {
              if (field === "HabitatTypes" && cell === "Code") {
                value = <a href={"https://eunis.eea.europa.eu/habitats_code2000/" + value} target="blank">{value}</a>
              }
              else if ((field === "Species" || field === "OtherSpecies") && cell === "Scientific Name" && value !== "-") {
                value = <a href={"https://eunis.eea.europa.eu/species/" + value} target="blank">{value}</a>
              }
              else if ((field === "Species" || field === "OtherSpecies") && cell === "Code" && value !== "-") {
                value = <a href={"https://eunis.eea.europa.eu/species_code2000/" + value} target="blank">{value}</a>
              }
              return parseLinks(value);
            }
            let body = value.map((row, i) => {
              let color;
              if ((field === "F_3_2_a_essential_information" || field === "F_3_3_other_species") && Object.entries(row).find(a => (a[0] === "3.2.4 Sensitive" || a[0] === "3.3.4 Sensitive") && a[1] === "Yes")) {
                color = ConfigSDF.Colors.Red;
              }
              return (
                <tr style={{ backgroundColor: color ? color : "" }} key={"tr_" + i}>
                  {Object.keys(value[0]).map((cell, ii) => {
                    return <CTableDataCell key={"tc_" + i + ii}>{cell.includes("Scientific name") ? <i>{row[cell]}</i> : <span>{checkCellLink(cell, row[cell])}</span>}</CTableDataCell>
                  })}
                </tr>
              )
            });
            let tableHeader = ConfigSDF.TableHeader[field];
            return (
              <>
                <div className="sdf-row-field">
                  <table className="table">
                    <thead>
                      {tableHeader &&
                        <tr>
                          {tableHeader.map((a, i) =>
                            <th colSpan={a.span} key={"th_" + i}>
                              {a.text}
                            </th>
                          )}
                        </tr>
                      }
                      <tr className={field.startsWith("F_3_") ? "th-rotate" : ""}>
                        {header}
                      </tr>
                    </thead>
                    <tbody>
                      {body}
                    </tbody>
                  </table>
                </div>
                {legend &&
                  <div className="sdf-legend mt-2">
                    {Object.keys(legend).map(a => <div key={a}><b>{a}: </b>{checkLegendLinks(legend[a])}</div>)}
                  </div>
                }
              </>
            )
          default:
            break;
        }
      }

      fields.push([
        (ConfigSDF.Subtitles[index] || ConfigSDF.Subtitles[title]) && (
          <div className="sdf-subtitle" key={section + "-" + field[0] + "-subtitle"}>
            <div className="sdf-row-title">{ConfigSDF.Subtitles[index] || ConfigSDF.Subtitles[title]}</div>
          </div>
        ),
        <CRow className={"sdf-row" + (layout === 2 ? " col-sm-6 col-12" : "")} key={section + "-" + field[0] + "-row"}>
          <CCol>
            <div className="sdf-row-title">{index + " " + title}</div>
            {dataType(field[0], type, value)}
          </CCol>
        </CRow>
      ]);
    }
    return fields;
  }

  const sortFields = (section, field, column) => {
    let colName = column;
    column = ConfigSDF[field] && Object.keys(ConfigSDF[field]).find(key => ConfigSDF[field][key] === column);
    var collator = new Intl.Collator([], { numeric: true });
    function getValue(obj, path) {
      if (!path) return obj;
      const properties = path.split('.');
      return getValue(obj[properties.shift()], properties.join('.'))
    }

    if (order[section + field]?.column === colName && order[section + field].order === "asc") {
      setOrder((prevState) => ({
        ...prevState,
        [section + field]: { "column": colName, "order": "desc" }
      }));
      setData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: getValue(prevState, [section, field].join('.')).sort((a, b) => collator.compare(b[column] === null ? "" : b[column], a[column] === null ? "" : a[column]))
        }
      }));
    }
    else {
      setOrder((prevState) => ({
        ...prevState,
        [section + field]: { "column": colName, "order": "asc" }
      }));
      setData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: getValue(prevState, [section, field].join('.')).sort((a, b) => collator.compare(a[column] === null ? "" : a[column], b[column] === null ? "" : b[column]))

        }
      }));
    }
  }

  const checkLegendLinks = (string) => {
    if (string.includes("(see reference portal)")) {
      return <>{string.split("(see reference portal)")} (<a href={ConfigSDF.Links.ReferencePortal} target="_blank">see reference portal</a>)</>
    }
    else {
      return string;
    }
  }

  const renderSections = (data) => {
    let sections = [];
    Object.keys(data).filter(a => a !== "SiteInfo").forEach((item, i) => {
      sections.push(
        <div id={i + 1} key={i}>
          <CRow className="p-4">
            <h2>{i + 1}. {ConfigSDF.Titles[i]}</h2>
            {sectionsContent(i + 1, data[item], item)}
          </CRow>
        </div>
      )
    });
    return sections;
  }

  return (
    <>
      {showMainData()}
      <CContainer fluid className="sdf-content">
        {renderSections(data)}
        {showMap()}
      </CContainer>
    </>
  );
}

export default SDFVisualization;
