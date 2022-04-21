import React, { useState, useEffect, useCallback } from 'react';

import ConfigData from '../../../config.json';

function PostEnvelops (){

    async function postVersionIdHandler(versionId){
        const response = await fetch(ConfigData.SERVER_API_ENDPOINT+'/api/Harvesting/Harvest', {
            method: 'POST',
            body: JSON.stringify(havested),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <React.Fragment>
            <section>
                <button  onClic={postVersionIdHandler}>Post</button>
            </section>
    
        </React.Fragment>
    )
}

export default PostEnvelops;