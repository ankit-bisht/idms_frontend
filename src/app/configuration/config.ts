const PROD_SERVER = 'http://63.141.51.26:81/api/v1/';

export class Configuration {
    public baseUrl = PROD_SERVER;
    public Hmac256Secret = 'abcdefg';
    public UrlObj = {
        loginApi: this.baseUrl + "userLogin",
    }
}
