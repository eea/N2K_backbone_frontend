import React, { useState } from 'react';
import { CImage, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import moreicon from 'src/assets/images/three-dots.svg'
import PostEnvelops from '../PostEnvelops';

function DropdownHarvesting(props) {
    return(
        <CDropdown>
            <CDropdownToggle className='btn-more' caret={false} size="sm">
                <i className="fa-solid fa-ellipsis"></i>
            </CDropdownToggle>
            <CDropdownMenu>
                {/* <PostEnvelops version_id={item.Id} country_code={item.Country} />    */}
                <PostEnvelops versionId={props.versionId} countryCode={props.countryCode} modalProps={props.modalProps}/>
                {/* <CDropdownItem role={'button'} onClick={() => props.clickFunction()}>Review site CHANGES</CDropdownItem>                                 */}
            </CDropdownMenu>
        </CDropdown>
    )
}

export default DropdownHarvesting