import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import moreicon from 'src/assets/images/three-dots.svg'


function DropdownSiteChanges(props) {
    return(
        <CDropdown>
            <CDropdownToggle className='btn-more' caret={false} size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem role={'button'} onClick={() => props.review()}>Review site <b>CHANGE</b></CDropdownItem>
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