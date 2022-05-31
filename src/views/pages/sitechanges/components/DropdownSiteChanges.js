import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';


function DropdownSiteChanges(props) {
    return(
        <CDropdown>
            <CDropdownToggle className='btn-more' caret={false}>
                <i className="fa-solid fa-ellipsis"></i>
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem role={'button'} onClick={() => props.clickFunction()}>Review site <b>CHANGE</b></CDropdownItem>
                <CDropdownItem >Accept change/s</CDropdownItem>
                <CDropdownItem >Reject change/s</CDropdownItem>
                <CDropdownItem >Add comments</CDropdownItem>
                <CDropdownItem >Mark as justification required</CDropdownItem>
                <CDropdownItem >View spatial change/s</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default DropdownSiteChanges