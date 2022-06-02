import React, { useState, useEffect, useCallback } from 'react';
import { useHistory  } from "react-router-dom";
import ConfigData from '../../../config.json';

const PostEnvelops = ({version_id, country_code}) => {    
    let history = useHistory();
    async function postVersionIdHandler(version_id,country_code ){
        var harvested =[{"VersionId": version_id, "CountryCode": country_code}];
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
            history.push('../sitechanges') ;
        }
        else 
            alert ("Error:" + data.Message);
    }

    return (
        <React.Fragment>
            <section>
                <button onClick={() => postVersionIdHandler(version_id,country_code )}>
                    Review site CHANGES
                </button>
            </section>
        </React.Fragment>
    )
}

export default PostEnvelops;
