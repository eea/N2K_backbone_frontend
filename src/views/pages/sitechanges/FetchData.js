import React, { Component } from 'react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CImage, CTableDataCell, CFormCheck, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import moreicon from './../../../assets/images/three-dots.svg'

import ConfigData from '../../../config.json';

import justificationrequired from './../../../assets/images/exclamation.svg';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { changes: [], loading: true };
  }

  componentDidMount() {
    this.populateChangesData();
  }

  static renderChangesTable(changes) {
    return (        
        <CTable className='mt-5'>
            <CTableHead>
            <CTableRow>
                <CTableHeaderCell scope="col"><CFormCheck /></CTableHeaderCell>
                <CTableHeaderCell scope="col">Sitecode</CTableHeaderCell>
                <CTableHeaderCell scope="col">Level</CTableHeaderCell>
                <CTableHeaderCell scope="col">Change Category</CTableHeaderCell>
                <CTableHeaderCell scope="col">Change type</CTableHeaderCell>
                <CTableHeaderCell scope="col">Country</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tags</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>{changes.Data.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell><CFormCheck /></CTableDataCell>
                <CTableDataCell>{item.SiteCode}</CTableDataCell>
                <CTableDataCell><span className={'badge badge--' + item.Level.toLocaleLowerCase()}>{item.Level}</span></CTableDataCell>
                <CTableDataCell>{item.ChangeCategory}</CTableDataCell>
                <CTableDataCell>{item.ChangeType}</CTableDataCell>
                <CTableDataCell>{item.Country}</CTableDataCell>
                <CTableDataCell><span className='badge badge--default'>{item.Tags}My_tag</span></CTableDataCell>
                <CTableDataCell>
                    {/* <CImage src={justificationrequired} className="ico--md "></CImage> */}
                </CTableDataCell>
                <CTableDataCell>
                    <CDropdown >
                    <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem role={'button'} onClick={() => setVisibleXL(!visibleXL)}>Review site <b>CHANGE</b></CDropdownItem>
                        <CDropdownItem >Accept change/s</CDropdownItem>
                        <CDropdownItem >Reject change/s</CDropdownItem>
                        <CDropdownItem >Add comments</CDropdownItem>
                        <CDropdownItem >Mark as justification required</CDropdownItem>
                        <CDropdownItem >View spatial change/s</CDropdownItem>
                    </CDropdownMenu>
                    </CDropdown>
                </CTableDataCell>
                </CTableRow>
            ))}
            </CTableBody>
        </CTable>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderChangesTable(this.state.changes);

    return (
      <>        
        {contents}        
      </>
    )
  }
  
  async populateChangesData() {
    const response = await fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/get');
    const data = await response.json();
    this.setState({ changes: data, loading: false });
  }
}
