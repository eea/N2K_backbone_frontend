import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';


function DropdownSiteChanges(props) {
    return(
        <CDropdown>
            <CDropdownToggle className='btn-more' caret={false}>
                <i className="fa-solid fa-ellipsis"></i>
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem role={'button'} onClick={() => props.actions.review()}>Review site <b>CHANGE</b></CDropdownItem>
                <CDropdownItem role={'button'} onClick={() => props.actions.accept()}>Accept change/s</CDropdownItem>
                <CDropdownItem role={'button'} onClick={() => props.actions.reject()}>Reject change/s</CDropdownItem>
                <CDropdownItem >Add comments</CDropdownItem>
                <CDropdownItem >Mark as justification required</CDropdownItem>
                <CDropdownItem >View spatial change/s</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default DropdownSiteChanges