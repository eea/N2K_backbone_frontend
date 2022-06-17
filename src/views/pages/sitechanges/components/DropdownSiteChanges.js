import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';


function DropdownSiteChanges(props) {
    return(
        <CDropdown>
            <CDropdownToggle className='btn-more' caret={false}>
                <i className="fa-solid fa-ellipsis"></i>
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem role={'button'} onClick={() => props.actions.review()}>Review site <b>CHANGES</b></CDropdownItem>
                <CDropdownItem role={'button'} onClick={() => props.actions.accept()}>Accept changes</CDropdownItem>
                <CDropdownItem role={'button'} onClick={() => props.actions.reject()}>Reject changes</CDropdownItem>
                <CDropdownItem >Add comments</CDropdownItem>
                <CDropdownItem role={'button'} onClick={() => props.actions.mark()}>Mark as justification required</CDropdownItem>
                <CDropdownItem >View spatial changes</CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default DropdownSiteChanges