import ConfigData from '../../../config.json';

export class AcceptReject {

  static postRequest(url,body){
    const options = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return fetch(url, options)
  }

  static acceptChanges(site,version){
    if(!confirm("This will approve all the changes")) return;

    const rBody = [
      {
        "SiteCode": site,
        "VersionId": version,
      }
    ]

    return this.postRequest(ConfigData.SERVER_API_ENDPOINT+'/api/SiteChanges/AcceptChanges', rBody)
  }

  static rejectChanges(site,version){
    if(!confirm("This will reject all the changes")) return;

    const rBody = [
      {
        "SiteCode": site,
        "VersionId": version,
      }
    ]

    return this.postRequest(ConfigData.SERVER_API_ENDPOINT+'/api/SiteChanges/RejectChanges', rBody)
  }
}
