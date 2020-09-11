const PROD_SERVER = 'http://192.168.2.251:81/api/v1/';

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
        upload : this.baseUrl + "upload",
        searchClientDetails: this.baseUrl + "searchClientDetails",
        getClientAllDetails: this.baseUrl + "getClientAllDetails",
    }
}
