import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../configuration/config';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { User } from "./user";
@Injectable()
export class ApiService {

  options: any;

  constructor(
    public httpClient: HttpClient,
    public urlObject: Configuration,
  ) { }

  /**
  * @method loginApi()
  * @desc check if user is authenticated or not
  */
  loginApi(loginInfoObj) {
    return this.httpClient.post(this.urlObject.UrlObj.loginApi, loginInfoObj);
  }

  deletePolicy(obj){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.deletePolicy, obj, this.options);

  }

  getClientRelationships(obj){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getClientRelationships, obj, this.options);

  }

  getCommissionValue(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getCommissionValue, obj, this.options);
  }

  getCommissions(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getCommissions, obj, this.options);
  }

  uploadCommissionFile(obj){
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.uploadCommissionFile, obj, this.options);
  }

  /**
 * @method deleteClient()
 * @desc update Status
 */
  updateEditStatus(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateEditStatus, obj, this.options);
  }

  getPolicyDetails(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getPolicyDetails, obj, this.options);
  }

  getAllProductIds(obj){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getAllProductIds, obj, this.options);

  }

  getAllPoliciesDetails(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getAllPoliciesDetails, obj, this.options);
  }

  /**
 * @method deleteClient()
 * @desc update Status
 */
  updateAgentEditStatus(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateAgentEditStatus, obj, this.options);
  }

  updatePolicyEditStatus(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updatePolicyEditStatus, obj, this.options);
  }

  updateCarrierEditStatus(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateCarrierEditStatus, obj, this.options);
  }

  getPolicyConstants(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getPolicyConstants, obj, this.options);
  }


  updateGroupEditStatus(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateGroupEditStatus, obj, this.options);

  }

  /**
 * @method deleteClient()
 * @desc delete client
 */
  deleteClient(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.deleteClient, obj, this.options);
  }

  /**
 * @method deleteClient()
 * @desc delete client
 */
  deleteAgent(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.deleteAgent, obj, this.options);
  }

  /**
 * @method deleteGroup()
 * @desc delete group
 */
  deleteGroup(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.deleteGroup, obj, this.options);
  }

  /**
 * @method deleteGroup()
 * @desc delete group
 */
  deleteCarrier(obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.deleteCarrier, obj, this.options);
  }

  /**
 * @method getConstants()
 * @desc get constants
 */
  getConstants(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.clientDropDownValues, Obj, this.options);
  }

  /**
* @method getConstants()
* @desc get constants
*/
  getAllProductsDetails(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getAllProductsDetails, Obj, this.options);
  }

  /**
 * @method documentDropDownValues()
 * @desc get drop doen constants for document
 */
  documentDropDownValues(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.documentDropDownValues, Obj, this.options);
  }

  /**
* @method createIndividuals()
* @desc create client
*/
  getIndividuals(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.clients, Obj, this.options).pipe(
      tap(c => localStorage.setItem('clients', JSON.stringify(c['result'])))
    );
  }

  /**
 * @method createClient()
 * @desc create client
 */
  createClient(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.createClient, Obj, this.options);
  }

  updatePolicy(Obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updatePolicy, Obj, this.options);
  }

  /**
* @method createPolicy()
* @desc create policy
*/
  createPolicy(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.createPolicy, Obj, this.options);
  }

  /**
 * @method createClient()
 * @desc create client
 */
  updateClient(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateClient, Obj, this.options);
  }

  /**
 * @method createClient()
 * @desc create client
 */
  updateCarrier(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateCarrier, Obj, this.options);
  }

  /**
 * @method createClient()
 * @desc create client
 */
  updateAgent(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateAgent, Obj, this.options);
  }

  /**
 * @method uploadAttachment()
 * @desc create client
 */
  uploadAttachment(Obj) {

    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }

    return this.httpClient.post(this.urlObject.UrlObj.upload, Obj, this.options);
  }

  /**
 * @method createIndividuals()
 * @desc create client
 */
  getGroupAllDetails(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getGroupAllDetails, Obj, this.options);
  }

  /**
 * @method createIndividuals()
 * @desc create client
 */
  getCarrierAllDetails(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getCarrierDetails, Obj, this.options);
  }

  /**
* @method createIndividuals()
* @desc create client
*/
  getGroups(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getGroupsDetails, Obj, this.options);
  }

  getClientTierRelationships(Obj){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getClientTierRelationships, Obj, this.options);
  }

  /**
* @method createIndividuals()
* @desc create client
*/
  getCarriers(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getCarriers, Obj, this.options);
  }


  /**
* @method createIndividuals()
* @desc create client
*/
  getAgents(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getAgents, Obj, this.options);
  }

  /**
* @method createClient()
* @desc create client
*/
  createAgent(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.createAgent, Obj, this.options);
  }

  /**
 * @method createIndividuals()
 * @desc create client
 */
  getAgentAllDetails(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getAgentAllDetails, Obj, this.options);
  }

  /**
 * @method createClient()
 * @desc create client
 */
  updateGroup(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.updateGroup, Obj, this.options);
  }

  createGroup(Obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.createGroup, Obj, this.options);
  }

  createCarrier(Obj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.createCarrier, Obj, this.options);
  }

  /**
 * @method createIndividuals()
 * @desc create client
 */
  searchIndividuals(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.searchClientDetails, Obj, this.options);
  }

  /**
 * @method createIndividuals()
 * @desc create client
 */
  getClientAllDetails(Obj) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    this.options = {
      headers: headers
    }
    return this.httpClient.post(this.urlObject.UrlObj.getClientAllDetails, Obj, this.options);
  }

}
