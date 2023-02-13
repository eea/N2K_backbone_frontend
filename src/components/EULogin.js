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
        console.log(codeChallenge)
        var cUrl=   ConfigData.EULoginServiceUrl +  "EULogin/GetLoginUrlByCodeChallenge/redirectionUrl=" + 
                    ConfigData.EULoginRedirectionURL +"&code_challenge=" +  codeChallenge;
        
        return this.dl.fetch(cUrl)
        .then(response => response.json())
        .then((a) => {
                this.loginUrl = a.Data;
                sessionStorage.setItem("loginUrl",this.loginUrl);
                return a.Data;
            })
        .catch((error) => {
                console.log(error)});
    }

    createToken() {
        var cUrl =  ConfigData.EULoginServiceUrl + "EULogin/GetToken/redirectionUrl="+ 
                    ConfigData.EULoginRedirectionURL  + "&code=" +  sessionStorage.getItem("code") + 
                    "&code_verifier=" + sessionStorage.getItem("codeVerifier");	
        return this.dl.fetch(cUrl)
        .then(response => response.json())
        .then((a) => {
            sessionStorage.setItem("token",a.Data);
        })
        .catch(e=>console.log(error));
    }

    username() {
        console.log("hola");
        var cUrl =ConfigData.EULoginServiceUrl + "EULogin/Getusername/token=" +  sessionStorage.getItem("token");
        console.log(cUrl);
        return this.dl.fetch(cUrl)
        .then(response => response.json())
        .then(a => console.log(a))
        .catch(
            e => {
                console.log(e);
            }
        )
    }

    static logout() {
        if(sessionStorage.getItem("code")) sessionStorage.removeItem("code");
        if(sessionStorage.getItem("codeVerifier")) sessionStorage.removeItem("codeVerifier");
        if(sessionStorage.getItem("loginUrl")) sessionStorage.removeItem("loginUrl");
        if(sessionStorage.getItem("token")) sessionStorage.removeItem("token")

		document.location.reload();
    }
}

export default EULogin;
