import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import moreicon from 'src/assets/images/three-dots.svg'


function DropdownSiteChanges(props) {
    return(
        <CDropdown>
            <CDropdownToggle color="primary" variant="ghost" caret={false} size="sm">
                <CImage src={moreicon} className="ico--md "></CImage>
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem role={'button'} onClick={() => props.clickFunction()}>Review site CHANGE</CDropdownItem>
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