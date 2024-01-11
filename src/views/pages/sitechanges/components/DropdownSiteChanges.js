import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';


function DropdownSiteChanges(props) {
    return(
        <CDropdown>
            <CDropdownToggle className='btn-more' caret={false}>
                <i className="fa-solid fa-ellipsis"></i>
            </CDropdownToggle>
            <CDropdownMenu>
                {props.actions.review && <CDropdownItem role={'button'} onClick={() => props.actions.review()}>Review site <b>CHANGES</b></CDropdownItem>}
                <CDropdownItem href={"/#/sdf?sitecode=" + props.referenceSiteCode} target="_blank" className={props.referenceSiteCode === null ? "disabled" : ""}>Expert View</CDropdownItem>
                {props.actions.accept && <CDropdownItem role={'button'} onClick={() => props.actions.accept()}>Accept changes</CDropdownItem>}
                {props.actions.reject && <CDropdownItem role={'button'} onClick={() => props.actions.reject()}>Reject changes</CDropdownItem>}
                {props.actions.addComents && <CDropdownItem >Add comments</CDropdownItem>}
                {props.actions.mark && <CDropdownItem role={'button'} onClick={() => props.actions.mark()}>{props.toggleMark} as justification required</CDropdownItem>}
                {props.actions.backPending && <CDropdownItem role={'button'} onClick={() => props.actions.backPending()}>Back to Pending</CDropdownItem>}
                {props.actions.viewSpatial && <CDropdownItem >View spatial changes</CDropdownItem>}
                {props.actions.edition && <CDropdownItem role={'button'} onClick={() => props.actions.edition()}>Edit fields</CDropdownItem>}
            </CDropdownMenu>
        </CDropdown>
    )
}

export default DropdownSiteChanges