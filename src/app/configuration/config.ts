const PROD_SERVER = 'http://67.200.244.131:81/api/v1/';
const LOCAL_SERVER = 'http://localhost:4400/api/v1/';

export class Configuration {
  public baseUrl = PROD_SERVER;
  public Hmac256Secret = 'abcdefg';
  public UrlObj = {
    loginApi: this.baseUrl + "userLogin",
    clientDropDownValues: this.baseUrl + "clientDropDownValues",
    documentDropDownValues: this.baseUrl + "clientDocumentTypeDropDownValues",
    createClient: this.baseUrl + "createClient",
    updateClient: this.baseUrl + "updateClient",
    clients: this.baseUrl + "clients",
    upload: this.baseUrl + "upload",
    deleteClient: this.baseUrl + "deleteClient",
    searchClientDetails: this.baseUrl + "searchClientDetails",
    getClientAllDetails: this.baseUrl + "getClientAllDetails",
    updateEditStatus: this.baseUrl + "updateEditStatus",
    getGroupAllDetails: this.baseUrl + "getGroupAllDetails",
    getGroupsDetails: this.baseUrl + "getGroupsDetails",
    createGroup: this.baseUrl + "createGroup",
    updateGroup: this.baseUrl + "updateGroup",
    updateGroupEditStatus:this.baseUrl + "updateGroupEditStatus"
  }
}
