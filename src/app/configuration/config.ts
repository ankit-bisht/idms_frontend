const PROD_SERVER = 'https://adms-globalfinancial.com/backend/api/v1/';
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
    updateCarrier: this.baseUrl + "updateCarrier",
    clients: this.baseUrl + "clients",
    upload: this.baseUrl + "upload",
    deleteClient: this.baseUrl + "deleteClient",
    getAllProductsDetails: this.baseUrl + "getAllProductsDetails",
    deleteCarrier: this.baseUrl + "deleteCarrier",
    searchClientDetails: this.baseUrl + "searchClientDetails",
    getClientAllDetails: this.baseUrl + "getClientAllDetails",
    updateEditStatus: this.baseUrl + "updateEditStatus",
    updateAgentEditStatus: this.baseUrl + "updateAgentEditStatus",
    updateCarrierEditStatus: this.baseUrl + "updateCarrierEditStatus",
    getGroupAllDetails: this.baseUrl + "getGroupAllDetails",
    getGroupsDetails: this.baseUrl + "getGroupsDetails",
    createGroup: this.baseUrl + "createGroup",
    updateGroup: this.baseUrl + "updateGroup",
    deleteGroup: this.baseUrl + "deleteGroup",
    deleteAgent: this.baseUrl + "deleteAgent",
    updateAgent: this.baseUrl + "updateAgent",
    updateGroupEditStatus: this.baseUrl + "updateGroupEditStatus",
    getAgents: this.baseUrl + "getAgents",
    createAgent: this.baseUrl + "createAgent",
    getAgentAllDetails: this.baseUrl + "getAgentAllDetails",
    getCarriers: this.baseUrl + "getAllCarriersDetails",
    getCarrierDetails: this.baseUrl + "getCarrierDetails",
    createCarrier: this.baseUrl + "createCarrier",
    getPolicyConstants: this.baseUrl+ "getPolicyConstants",
    createPolicy: this.baseUrl+"createPolicy",
    updatePolicyEditStatus : this.baseUrl + "updatePolicyEditStatus",
    updatePolicy: this.baseUrl + "updatePolicy",
    getPolicyDetails: this.baseUrl + "getPolicyDetails",
    getAllPoliciesDetails : this.baseUrl+"getAllPoliciesDetails",
    getAllProductIds: this.baseUrl + "getAllProductIds",
    deletePolicy: this.baseUrl + "deletePolicy",
    getClientRelationships: this.baseUrl + "getClientRelationships",
    getClientTierRelationships : this.baseUrl + "getClientTierRelationships",
    getCommissionValue: this.baseUrl + "getCommissionValue",
    uploadCommissionFile:this.baseUrl+"uploadCommissionFile",
    getCommissions:this.baseUrl+"getCommissions",
    getUserNotes:this.baseUrl+"getUserNotes",
    userNotesUpdate:this.baseUrl+"userNotesUpdate",
    searchClientDetaials:this.baseUrl + "searchClientDetaials",
    searchPolicyDetails:this.baseUrl + "searchPolicyDetails"
  }
}
