import React, { useEffect, useState} from 'react';
import { CTable, CTableBody, CTableHead, CTableRow, CTableHeaderCell, CImage, CTableDataCell, CFormCheck, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';

import ConfigData from '../../../config.json';
import {DataLoader} from '../../../components/DataLoader';

export default function FetchDataTable() {

    const [events, setEvents] = useState([]);
    let dl = new(DataLoader);

    useEffect(() => {
      dl.fetch(ConfigData.SERVER_API_ENDPOINT+'/api/sitechanges/GetByStatus')
      .then(response => response.json())
      .then(data => {
        setEvents(data);
      });
    }, []);
  
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
            <CTableBody>{ events.Data.map((item, key) => (
                <CTableRow v-for="item in tableItems" key={id}>
                <CTableDataCell><CFormCheck /></CTableDataCell>
                <CTableDataCell>{item.SiteCode}</CTableDataCell>
                <CTableDataCell><span className={'badge badge--' + item.Level.toLocaleLowerCase()}>{item.Level}</span></CTableDataCell>
                <CTableDataCell>{item.ChangeCategory}</CTableDataCell>
                <CTableDataCell>{item.ChangeType}</CTableDataCell>
                <CTableDataCell>{item.Country}</CTableDataCell>
                <CTableDataCell><span className='badge badge--default'>{item.Tags}My_tag</span></CTableDataCell>
                <CTableDataCell>
                    
                </CTableDataCell>
                <CTableDataCell>
                    <CDropdown >
                    <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                        <CImage src={moreicon} className="ico--md "></CImage>
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem role={'button'} onClick={() => setVisibleXL(!visibleXL)}>Review site CHANGE</CDropdownItem>
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
