import ConfigData from '../config.json';
import { DataLoader } from './DataLoader';
import CryptoJS from 'crypto-js';
import { doc } from 'prettier';

export class EULogin {
    constructor(){
        if(EULogin.userIsLoaded()) return;
        this.dl = new(DataLoader);
        //Retrieve storage values if existing ones
        this.codeVerifier = localStorage.getItem("codeVerifier");
        this.loginUrl = localStorage.getItem("loginUrl");
        this.token = localStorage.getItem("token");

        const paramsString1 = this.getQuery();		
        if (paramsString1.code) {
            this.code = paramsString1.code;
            localStorage.setItem('code', paramsString1.code);
        } 

        if (this.code && this.codeVerifier && this.loginUrl && !this.token){
            this.createToken().then(a=>location.href = document.location.origin);
        }
    }

    static tokenDecode(token){
        return JSON.parse(
                decodeURIComponent(window.atob(token.split('.')[1].replace('-', '+').replace('_', '/')).split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''))
            );
    }

    static userIsLoaded(){
        if (document.location.href.includes("localhost")) return true;
        return localStorage.getItem("token")?true:false;
    }

    getQuery() {
        let p= new URLSearchParams(document.location.search);
        return {code: p.get("code")};
    }

    base64URL(string) {
        return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }	

    generateRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    generateCodeVerifier() {
        this.codeVerifier = this.generateRandomString(128)
        localStorage.setItem('codeVerifier', this.codeVerifier);
        return this.codeVerifier;
    }

    generateLoginUrl() {	
        var codeChallenge= this.base64URL(CryptoJS.SHA256(this.codeVerifier));
        let redirectionUrl = encodeURIComponent(document.location.origin.replace(/\//g, "##"));
        var cUrl=   ConfigData.EULoginServiceUrl +  "EULogin/GetLoginUrlByCodeChallenge/redirectionUrl=" + 
                    redirectionUrl +"&code_challenge=" +  codeChallenge;
        
        return this.dl.fetch(cUrl)
        .then(response => response.json())
        .then((a) => {
            if(a?.Success) {
                this.loginUrl = a.Data;
                localStorage.setItem("loginUrl",this.loginUrl);
                return a.Data;
            } else { throw(a.Message) }
        })
        .catch((error) => {
                console.log(error)
        });
    }

    createToken() {
        /*let redirectionUrl = encodeURIComponent(document.location.origin.replace(/\//g, "##"));
        var cUrl =  ConfigData.EULoginServiceUrl + "EULogin/GetToken/redirectionUrl="+ 
                    redirectionUrl  + "&code=" +  localStorage.getItem("code") + 
                    "&code_verifier=" + localStorage.getItem("codeVerifier");	*/
        var cUrl =  ConfigData.EULoginServiceUrl + "EULogin/GetToken";
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "RedirectionUrl": document.location.origin,
                "Code": localStorage.getItem("code"),
                "Code_Verifier": localStorage.getItem("codeVerifier")
            }),
        };

        return this.dl.fetch(cUrl,options)
        .then(response => response.json())
        .then((a) => {
            if(a?.Success) {
                localStorage.setItem("token",a.Data);
            } else { throw(a.Message) }
        })
        .catch(e=>console.log(e));
    }

    static getUserName() {
        return localStorage.getItem('token')?EULogin.tokenDecode(localStorage.getItem('token')).email:"";
    }

    static logout() {
        let redirectionUrl = document.location.origin;
        
        var cUrl =  ConfigData.EULogoutURL + "?id_token_hint=" + localStorage.getItem("token") + 
                    "&state=loggout&post_logout_redirect_uri=" + redirectionUrl

        if(localStorage.getItem("code")) localStorage.removeItem("code");
        if(localStorage.getItem("codeVerifier")) localStorage.removeItem("codeVerifier");
        if(localStorage.getItem("loginUrl")) localStorage.removeItem("loginUrl");
        if(localStorage.getItem("token")) localStorage.removeItem("token")
		location.href = cUrl;				
		//document.location.reload();
    }
}

export default EULogin;
