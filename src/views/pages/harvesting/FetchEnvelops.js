import React, { Component } from 'react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CImage, CTableDataCell, CFormCheck, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';

import TableEnvelops from './TableEnvelops';
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
      <TableEnvelops />
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
