import React, { Component } from 'react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CImage, CTableDataCell, CFormCheck, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import moreicon from './../../../assets/images/three-dots.svg'

import ConfigData from '../../../config.json';

export class FetchEnvelops extends Component {
  static displayName = FetchEnvelops.name;

  constructor(props) {
    super(props);
    this.state = { envelops: [], loading: true };
  }

  componentDidMount() {
    this.populateEnvelopsData();
  }
    
  static renderEnvelopsTable(envelops) {
    return (        
        <CTable className='mt-5'>
        <CTableHead>
            <CTableRow>
            <CTableHeaderCell scope="col"> <CFormCheck /></CTableHeaderCell>
            <CTableHeaderCell scope="col">Envelope ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Country</CTableHeaderCell>
            <CTableHeaderCell scope="col">Pending changes</CTableHeaderCell>
            <CTableHeaderCell scope="col">Submission date</CTableHeaderCell>            
            <CTableHeaderCell scope="col">&nbsp;</CTableHeaderCell>            
            </CTableRow>
        </CTableHead>
        <CTableBody>{envelops.Data.map((item, index) => (
            <CTableRow className='align-middle' v-for="item in tableItems" key={index}>
                <CTableDataCell><CFormCheck /></CTableDataCell>
                <CTableDataCell>{item.EnvelopeId}</CTableDataCell>
                <CTableDataCell>{item.Country}Spain</CTableDataCell>
                <CTableDataCell>{item.PendingChanges}</CTableDataCell>
                <CTableDataCell>{item.SubmissionDate}</CTableDataCell>
                <CTableDataCell>
                <CDropdown >
                <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                    <CImage src={moreicon} className="ico--md "></CImage>
                </CDropdownToggle>
                <CDropdownMenu>
                    <CDropdownItem >Harvest info form submission/s</CDropdownItem>
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
      : FetchEnvelops.renderEnvelopsTable(this.state.envelops);

    return (
      <>        
        {contents}        
      </>
    )
  }
  
  async populateEnvelopsData() {
    const response = await fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Pending');
    const data = await response.json();
    this.setState({ envelops: data, loading: false });
  }
}
