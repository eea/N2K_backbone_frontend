import ConfigData from '../config.json';

export class DataLoader {
    fetch(url, parms) {
        
        const options = parms?.headers?parms:{headers:{}};
        options.headers['Authorization'] = 'Bearer '+ConfigData.token;

        if(parms && parms.method)
            options['method'] = parms.method;
        
        return fetch(url,options);
    }    

    xmlHttpRequest(url, data){
        return new Promise((resolve,reject) =>{
            const request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.setRequestHeader('Authorization', 'Bearer ' + ConfigData.token);
            request.onload = (oEvent) => {
                if (request.status >= 200 && request.status < 300) {
                resolve(JSON.parse(request.response));
                } else {
                reject(request.statusText);
                }
            };
            request.send(data)
        });
    }
}