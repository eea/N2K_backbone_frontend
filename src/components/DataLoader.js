import ConfigData from '../config.json';

export class DataLoader {
    constructor(){
        this.token = localStorage.getItem("token");
        if (!this.token && document.location.href.includes("localhost")){
            this.token = ConfigData.token;
        } 
    }

    fetch(url, parms) {
        
        const options = parms?.headers?parms:{headers:{}};
        options.headers['Authorization'] = 'Bearer '+this.token;

        if(parms && parms.method)
            options['method'] = parms.method;
        
        return fetch(url,options);
    }    

    xmlHttpRequest(url, data){
        return new Promise((resolve,reject) =>{
            const request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.setRequestHeader('Authorization', 'Bearer ' + this.token);
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
