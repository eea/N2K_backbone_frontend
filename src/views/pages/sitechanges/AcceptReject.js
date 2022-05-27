import ConfigData from '../../../config.json';

export class AcceptReject {

  static post_request(url,body){
    const options = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return fetch(url, options)
  }

  static accept_changes(site,version){
    if(!confirm("This will approve all the changes")) return;

    const rBody = [
      {
        "SiteCode": site,
        "VersionId": version,
      }
    ]

    return this.post_request(ConfigData.SERVER_API_ENDPOINT+'/api/SiteChanges/AcceptChanges', rBody)
  }

  static reject_changes(site,version){
    if(!confirm("This will reject all the changes")) return;

    const rBody = [
      {
        "SiteCode": site,
        "VersionId": version,
      }
    ]

    return this.post_request(ConfigData.SERVER_API_ENDPOINT+'/api/SiteChanges/RejectChanges', rBody)
  }
}
