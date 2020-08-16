const PROD_SERVER = 'http://localhost:4400/api/v1/';

export class Configuration {
    public baseUrl = PROD_SERVER;
    public Hmac256Secret = 'abcdefg';
    public UrlObj = {
        loginApi: this.baseUrl + "userLogin",
        clientDropDownValues: this.baseUrl + "clientDropDownValues",
        documentDropDownValues: this.baseUrl + "clientDocumentTypeDropDownValues",
        createClient: this.baseUrl + "createClient",
        clients: this.baseUrl + "clients",
        searchClientDetails: this.baseUrl + "searchClientDetails",
        getClientAllDetails: this.baseUrl + "getClientAllDetails",
    }
}
