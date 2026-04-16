import React, { useState } from "react";
import ConfigSDF from "./sdf_legacy_config.json";
import MapViewer from '../../../components/MapViewer';
import {
  CRow,
  CCol,
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
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
      let index = activekey + "." + (parseInt(i) + 1);
      let title;
      let value;
      let type;
      let layout;
      let legend;
      switch (activekey) {
        case 1:
          switch (field[0]) {
            case "Type":
              title = "Type";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "SiteCode":
              title = "Site Code";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "SiteName":
              title = "Site Name";
              value = field[1];
              type = "single";
              break;
            case "FirstCompletionDate":
              title = "First Compilation date";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "UpdateDate":
              title = "Update date";
              value = field[1];
              type = "single";
              layout = 2;
              break;
            case "Respondent":
              title = "Respondent";
              value = field[1];
              type = "single";
              break;
            case "SiteDesignation":
              title = "Site indication and designation / classification dates";
              value = field[1][0];
              let tableHeader = ConfigSDF.TableHeader.SiteDesignationGroup;
              let filter = (obj, keys) => keys.reduce((a, b) => (a[b] = obj[b], a), {});
              let explanations = filter(value, tableHeader.e);
              value = [filter(value, tableHeader.a), filter(value, tableHeader.b)];
              if (explanations.Explanations) {
                value.push(explanations);
              }
              type = "multiple";
              break;
          }
          break;
        case 2:
          switch (field[0]) {
            case "Longitude":
              title = "Site-centre location [decimal degrees]";
              value = field[1];
              type = "single";
              break;
            case "Area":
              title = "Area [ha]";
              value = field[1];
              type = "single";
              break;
            case "MarineArea":
              title = "Marine area [%]";
              value = field[1];
              type = "single";
              break;
            case "SiteLength":
              title = "Sitelength [km] (optional)";
              value = field[1];
              type = "single";
              break;
            case "Region":
              title = "Administrative region code and name";
              value = field[1];
              type = "table";
              break;
            case "BiogeographicalRegions":
              title = "Biogeographical Region(s)";
              value = field[1];
              type = "table";
              break;
          }
          break;
        case 3:
          switch (field[0]) {
            case "HabitatTypes":
              title = "Habitat types present on the site and assessment for them";
              value = field[1];
              type = "table";
              legend = ConfigSDF.Legend.HabitatTypes;
              break;
            case "Species":
              title = "Species referred to in Article 4 of Directive 2009/147/EC and listed in Annex II of Directive 92/43/EEC and site evaluation for them";
              value = field[1];
              value.map(a => ConfigSDF.SpeciesFilters.forEach(b => delete a[b]));
              value = value.map(obj => ({ ...obj, "Group": ConfigSDF.SpeciesGroups[obj.Group] }));
              type = "table";
              legend = ConfigSDF.Legend.Species;
              break;
            case "OtherSpecies":
              title = "Other important species of flora and fauna (optional)";
              value = field[1];
              value.map(a => ConfigSDF.OtherSpeciesFilters.forEach(b => delete a[b]));
              value = value.map(obj => ({ ...obj, "Group": ConfigSDF.SpeciesGroups[obj.Group] }));
              type = "table";
              legend = ConfigSDF.Legend.OtherSpecies;
              break;
          }
          break;
        case 4:
          switch (field[0]) {
            case "GeneralCharacter":
              title = "General site character";
              value = field[1].GeneralCharacter;
              value = value.map(obj => ({ "Code": obj.Code, "HabitatClass": ConfigSDF.HabitatClasses[obj.Code], "Cover": obj.Cover }));
              let total = value.map(a => a["Cover"]).reduce((a, b) => a + b, 0);
              value.push({ "Code": "", "HabitatClass": "Total Habitat Cover", "Cover": parseFloat((total).toFixed(4)) });
              legend = field[1].OtherCharacteristics;
              type = "table";
              break;
            case "Quality":
              title = "Quality and importance";
              value = field[1];
              type = "single";
              break;
            case "NegativeThreats":
              title = "Threats, pressures and activities with impacts on the site";
              value = field[1];
              type = "double-table";
              legend = ConfigSDF.Legend.Threats;
              break;
            case "Ownership":
              title = "Ownership (optional)";
              value = field[1];
              if (value.length) {
                let tableHeader = ConfigSDF.TableHeader.OwnershipType;
                let val = [];
                value.forEach(item => {
                  let check = Object.entries(tableHeader).find(a => a[1].toLowerCase().includes(item.Type.toLowerCase()));
                  if (check) {
                    item.Type = check[0];
                  }
                  let found = val.find(a => a.Type === item.Type);
                  if (found) {
                    found.Percent += item.Percent;
                  }
                  else {
                    val.push({ "Type": item.Type, "Percent": item.Percent });
                  }
                });
                value = Object.keys(tableHeader).map(a => ({ "Type": tableHeader[a], "Percent": val.filter(b => b.Type === a).length ? val.find(b => b.Type === a).Percent : 0 }));
                let total = value.map(a => a["Percent"]).reduce((a, b) => a + b, 0);
                value.push({ "Type": "Total", "Percent": parseFloat((total).toFixed(4)) });
              }
              type = "table";
              break;
            case "Documents":
              title = "Documentation (optional)";
              value = field[1];
              if (!value.Links?.length) {
                delete value.Links;
                if (!value.Documents) {
                  value = null;
                }
              }
              type = "single";
              break;
          }
          break;
        case 5:
          switch (field[0]) {
            case "DesignationTypes":
              title = "Designation types at national and regional level (optional)";
              value = field[1];
              type = "table";
              break;
            case "RelationSites":
              title = "Relation of the described site with other sites (optional)";
              value = field[1];
              type = "table";
              break;
            case "SiteDesignation":
              title = "Site designation (optional)";
              value = field[1];
              type = "single";
              break;
          }
          break;
        case 6:
          switch (field[0]) {
            case "BodyResponsible":
              title = "Body(ies) responsible for the site management";
              value = field[1];
              type = "multiple";
              break;
            case "ManagementPlan":
              title = "Management Plan(s)";
              value = field[1];
              type = "check"
              break;
            case "ConservationMeasures":
              title = "Conservation measures (optional)";
              value = field[1];
              type = "single";
              break;
          }
          break
        case 7:
          switch (field[0]) {
            case "INSPIRE":
              title = "INSPIRE ID";
              value = field[1];
              type = "single";
              break;
            case "MapDelivered":
              title = "Map delivered as PDF in electronic format (optional)";
              value = field[1];
              type = "single";
              break;
          }
          break;
      }
      if ((!value || value.length === 0) && value !== 0) {
        value = "No information provided";
        type = "single";
      }
      let labels = ConfigSDF[field[0]];
      if (labels) {
        if (Array.isArray(value)) {
          value = value.map(a => { let b = {}; Object.keys(a).forEach(key => b[labels[key]] = a[key] ? (isNaN(a[key]) && !isNaN(Date.parse(a[key].replaceAll(' ', ""))) ? formatDate(a[key]) : a[key]) : a[key]); return b });
        }
        else if (type === "double-table") {
          let c = {};
          Object.keys(value).forEach(i => c[i] = value[i].map(a => { let b = {}; Object.keys(a).forEach(key => b[ConfigSDF[i][key]] = a[key]); return b }))
          value = c;
        }
        else if (typeof value === 'object' && type !== "double-table") {
          let b = {};
          Object.keys(value).forEach(key => b[labels[key]] = value[key] ? (isNaN(value[key]) && !isNaN(Date.parse(value[key].replaceAll(' ', ""))) ? formatDate(value[key]) : value[key]) : value[key]);
          value = b;
        }
      }
      else {
        value = typeof value !== 'object' && isNaN(value) && !isNaN(Date.parse(value.replaceAll(' ', ""))) ? formatDate(value) : value;
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
                {typeof data === 'object' ? Object.entries(data).map(a => <p key={"v_" + a}><b>{a[0]}</b>: {a[1] ? parseLinks(a[1]) : "No information provided"}</p>) : parseLinks(data)}
              </div>
            )
          case "multiple":
            return (
              Array.isArray(data) && data.map((a, i) =>
                <div className="sdf-row-field" key={"a_" + i}>
                  {typeof a === 'object' ? Object.entries(a).map(b => <p key={"b_" + b}><b>{b[0]}</b>: {b[1] ? parseLinks(b[1]) : "No information provided"}</p>) : parseLinks(a[1])}
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
              return value;
            }
            let body = value.map((row, i) => {
              let color;
              if ((field === "Species" || field === "OtherSpecies") && Object.entries(row).find(a => a[0] === "S" && a[1] === "Yes")) {
                color = ConfigSDF.Colors.Red;
              }
              return (
                <tr style={{ backgroundColor: color ? color : "" }} key={"tr_" + i}>
                  {Object.keys(value[0]).map((cell, ii) => {
                    return <CTableDataCell key={"tc_" + i + ii}><span>{checkCellLink(cell, row[cell])}</span></CTableDataCell>
                  })}
                </tr>
              )
            });
            let tableHeader = ConfigSDF.TableHeader[field];
            return (
              <>
                <div className="sdf-row-field">
                  <CTable>
                    <CTableHead>
                      {tableHeader &&
                        <CTableRow>
                          {tableHeader.map((a, i) =>
                            <th colSpan={a.span} key={"th_" + i}>
                              {a.text}
                            </th>
                          )}
                        </CTableRow>
                      }
                      <CTableRow>
                        {header}
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {body}
                    </CTableBody>
                  </CTable>
                </div>
                {legend &&
                  (field === "GeneralCharacter" ?
                    <>
                      <div className="sdf-legend mt-2">
                        <b>Other Site Characteristics</b>
                      </div>
                      <div className="sdf-row-field">
                        {typeof legend === 'object' ? Object.entries(legend).map(a => <p key={"v_" + a}><b>{a[0]}</b>: {a[1] ? parseLinks(a[1]) : "No information provided"}</p>) : parseLinks(legend)}
                      </div>
                    </>
                    :
                    <div className="sdf-legend mt-2">
                      {Object.keys(legend).map(a => <div key={a}><b>{a}: </b>{checkLegendLinks(legend[a])}</div>)}
                    </div>
                  )
                }
              </>
            )
          case "double-table":
            let tables = [];
            Object.entries(value).map(a => {
              let header = a[1].length > 0 ? Object.keys(a[1][0]).map(b => {
                return (
                  <CTableHeaderCell className={order[section + a[0]]?.column === b ? "sorted" : ""} scope="col" key={b} onClick={() => sortFields(section, a[0], b)}>
                    {b}
                    {order[section + a[0]]?.column === b && (<div className="sort-icon">{order[section + a[0]]?.order === "asc" ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</div>)}
                  </CTableHeaderCell>
                )
              }) : null;
              let body = a[1].length > 0 && a[1].map((row, i) => {
                return (
                  <tr key={"tr_" + i}>
                    {Object.keys(a[1][0]).map((cell, ii) => {
                      return <CTableDataCell key={"tc_" + i + ii}>{row[cell]}</CTableDataCell>
                    })}
                  </tr>
                )
              });
              if (!body.length) {
                body = <tr><td>No data</td></tr>;
              }
              let tableHeader = ConfigSDF.TableHeader[a[0]];
              tables.push(
                <CCol xs={12} md={12} lg={6} xl={6} key={a[0]}>
                  <div className="mb-2">
                    <div className="sdf-row-field">
                      <CTable>
                        <CTableHead>
                          <CTableRow>
                            {tableHeader.map((a, i) =>
                              <th colSpan={a.span} key={"th_" + i}>
                                {a.text}
                              </th>
                            )}
                          </CTableRow>
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
                {legend &&
                  <div className="sdf-legend">
                    {Object.keys(legend).map(a => <div key={a}><b>{a}: </b>{legend[a]}</div>)}
                  </div>
                }
              </CRow>
            );
          case "check":
            let options = ConfigSDF.TableHeader.ManagementPlan;
            let checked = value[0].Exists ? value[0].Exists : "N";
            let check = options.map((a, i) => {
              return (
                <div key={"m_" + i}>
                  <div className="checkbox" disabled={checked !== a.value}>
                    <input type="checkbox" className="input-checkbox" id={"management_check_" + i} disabled checked={checked === a.value} />
                    <label htmlFor={"management_check_" + i} className="input-label">{a.text}</label>
                  </div >
                  {checked === "Y" && checked === a.value &&
                    Array.isArray(data) && data.map((a, i) =>
                      <div className="mb-3" key={"a_" + i}>
                        {typeof a === 'object' ? Object.entries(a).map(b => b[0] !== "Exists" && <p className="mb-1" key={"b_" + b}><b>{b[0]}</b>: {b[1] ? parseLinks(b[1]) : "No information provided"}</p>) : parseLinks(a[1])}
                      </div>
                    )
                  }
                </div>
              )
            });
            return (
              <div className="sdf-row-field">
                {check}
              </div>
            )
        }
      }

      fields.push(
        <CRow className={"sdf-row" + (layout === 2 ? " col-sm-6 col-12" : "")} key={index}>
          <CCol>
            <div className="sdf-row-title">{index + ' ' + title}</div>
            {dataType(field[0], type, value)}
          </CCol>
        </CRow>
      );
    }
    return fields;
  }

  const sortFields = (section, field, column) => {
    let colName = column;
    column = Object.keys(ConfigSDF[field]).find(key => ConfigSDF[field][key] === column);
    var collator = new Intl.Collator([], { numeric: true });
    function getValue(obj, path) {
      if (!path) return obj;
      const properties = path.split('.');
      return getValue(obj[properties.shift()], properties.join('.'))
    }
    let path = field === "GeneralCharacter" || field === "NegativeThreats" ? [field, field].join(".") : field === "PositiveThreats" ? ["NegativeThreats", field].join(".") : field;

    if (order[section + field]?.column === colName && order[section + field].order === "asc") {
      setOrder((prevState) => ({
        ...prevState,
        [section + field]: { "column": colName, "order": "desc" }
      }));
      setData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          ...(field === "GeneralCharacter" && {
            [field]: {
              [field]: getValue(prevState, [section, path].join('.')).sort((a, b) => collator.compare(field === "GeneralCharacter" && column === "HabitatClass" ? ConfigSDF.HabitatClasses[b.Code] : b[column] === null ? "" : b[column], field === "GeneralCharacter" && column === "HabitatClass" ? ConfigSDF.HabitatClasses[a.Code] : a[column] === null ? "" : a[column]))
            }
          }),
          ...(field.includes("Threats") && {
            ["NegativeThreats"]: {
              ...prevState[section]["NegativeThreats"],
              [field]: getValue(prevState, [section, path].join('.')).sort((a, b) => collator.compare(b[column] === null ? "" : b[column], a[column] === null ? "" : a[column]))
            }
          }),
          ...((field !== "GeneralCharacter" && !field.includes("Threats")) && {
            [field]: getValue(prevState, [section, path].join('.')).sort((a, b) => collator.compare(b[column] === null ? "" : b[column], a[column] === null ? "" : a[column]))
          }),
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
          ...(field === "GeneralCharacter" && {
            [field]: {
              [field]: getValue(prevState, [section, path].join('.')).sort((a, b) => collator.compare(field === "GeneralCharacter" && column === "HabitatClass" ? ConfigSDF.HabitatClasses[a.Code] : a[column] === null ? "" : a[column], field === "GeneralCharacter" && column === "HabitatClass" ? ConfigSDF.HabitatClasses[b.Code] : b[column] === null ? "" : b[column]))
            }
          }),
          ...(field.includes("Threats") && {
            ["NegativeThreats"]: {
              ...prevState[section]["NegativeThreats"],
              [field]: getValue(prevState, [section, path].join('.')).sort((a, b) => collator.compare(a[column] === null ? "" : a[column], b[column] === null ? "" : b[column]))
            }
          }),
          ...((field !== "GeneralCharacter" && !field.includes("Threats")) && {
            [field]: getValue(prevState, [section, path].join('.')).sort((a, b) => collator.compare(a[column] === null ? "" : a[column], b[column] === null ? "" : b[column]))
          }),
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