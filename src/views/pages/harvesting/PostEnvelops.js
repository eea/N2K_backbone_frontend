
import React, { useState, useEffect, useCallback } from 'react';

import ConfigData from '../../../config.json';

const PostEnvelops = ({version_id, country_code}) => {
    function postVersionIdHandler(version_id,country_code){
        //alert({versionId});
        alert(version_id + "/" + country_code);
/*
        //var envIds= '[{    "VersionId": 123, "CountryCode": "ES"}, {    "VersionId": 1, "CountryCode": "AT"}]'; 
        //var harvested =[{"VersionId": 33, "CountryCode": "AT"}];
        const response = await fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Harvest', {
            method: 'POST',
            body: JSON.stringify(harvested),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        */
    }

    return (
        <React.Fragment>

                <section>
                    <button data-version={version_id}  onClick={postVersionIdHandler(version_id, country_code )}  >Post </button>
                </section>

        </React.Fragment>
    )
}

export default PostEnvelops;
