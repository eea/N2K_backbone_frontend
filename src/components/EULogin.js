import ConfigData from '../config.json';
import { DataLoader } from './DataLoader';
import CryptoJS from 'crypto-js';
import { doc } from 'prettier';

export class EULogin {
    constructor(){
        if(EULogin.userIsLoaded()) return;
        this.dl = new(DataLoader);
        //Retrieve storage values if existing ones
        this.codeVerifier = sessionStorage.getItem("codeVerifier");
        this.loginUrl = sessionStorage.getItem("loginUrl");
        this.token = sessionStorage.getItem("token");

        const paramsString1 = this.getQuery();		
        if (paramsString1.code) {
            this.code = paramsString1.code;
            sessionStorage.setItem('code', paramsString1.code);
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
        return sessionStorage.getItem("token")?true:false;
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
        sessionStorage.setItem('codeVerifier', this.codeVerifier);
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
                this.loginUrl = a.Data;
                sessionStorage.setItem("loginUrl",this.loginUrl);
                return a.Data;
            })
        .catch((error) => {
                console.log(error)
            });
    }

    createToken() {
        let redirectionUrl = encodeURIComponent(document.location.origin.replace(/\//g, "##"));
        var cUrl =  ConfigData.EULoginServiceUrl + "EULogin/GetToken/redirectionUrl="+ 
                    redirectionUrl  + "&code=" +  sessionStorage.getItem("code") + 
                    "&code_verifier=" + sessionStorage.getItem("codeVerifier");	
        return this.dl.fetch(cUrl)
        .then(response => response.json())
        .then((a) => {
            sessionStorage.setItem("token",a.Data);
        })
        .catch(e=>console.log(error));
    }

    static getUserName() {
        return EULogin.tokenDecode(sessionStorage.getItem('token')).email;
    }

    static logout() {
        let redirectionUrl = document.location.origin;
        
        var cUrl =  ConfigData.EULogoutURL + "?id_token_hint=" + sessionStorage.getItem("token") + 
                    "&state=loggout&post_logout_redirect_uri=" + redirectionUrl

        if(sessionStorage.getItem("code")) sessionStorage.removeItem("code");
        if(sessionStorage.getItem("codeVerifier")) sessionStorage.removeItem("codeVerifier");
        if(sessionStorage.getItem("loginUrl")) sessionStorage.removeItem("loginUrl");
        if(sessionStorage.getItem("token")) sessionStorage.removeItem("token")
		location.href = cUrl;				
		//document.location.reload();
    }
}

export default EULogin;
