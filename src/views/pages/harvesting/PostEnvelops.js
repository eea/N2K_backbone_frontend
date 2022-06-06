import React, { useState, useEffect, useCallback } from 'react';
import { useHistory  } from "react-router-dom";
import { CDropdownItem } from '@coreui/react';
import ConfigData from '../../../config.json';

function PostEnvelops(props) {
    let history = useHistory();
    async function postVersionIdHandler(versionId, countryCode ){
        var harvested =[{"VersionId": versionId, "CountryCode": countryCode}];
        const response = await fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Harvest', {
            method: 'POST',
            body: JSON.stringify(harvested),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        if (data.Success)  {
            //history.push('../sitechanges');
            props.modalProps.showAlert();
        }
        else 
            alert ("Error:" + data.Message);
    }

    return (
        <>
            <CDropdownItem>Harvest</CDropdownItem> {/* onClick={() => props.modalProps.showModal(()=> postVersionIdHandler(props.versionId, props.countryCode))} */}
            <CDropdownItem>Discard</CDropdownItem>
        </>
    )
}

export default PostEnvelops;
