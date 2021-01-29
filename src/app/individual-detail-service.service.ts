import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndividualDetailServiceService {

  individualDetails = {};
  groupDetails = {};
  agentDetails = {};
  carrierDetails = {};

  constructor() { }

  addToIndividual(details) {
    Object.entries(details).forEach(([key, value]) => { this.individualDetails[key] = value })
    return this.individualDetails;
  }

  getIndividual() {
    return this.individualDetails;
  }

  clearIndividual() {
    this.individualDetails = {};
    return this.individualDetails;
  }

  /**
   *
   * @param GROUPS
   */

  addToGroup(details) {
    Object.entries(details).forEach(([key, value]) => { this.groupDetails[key] = value })
    return this.groupDetails;
  }

  getGroup() {
    return this.groupDetails;
  }

  clearGroup() {
    this.groupDetails = {};
    return this.groupDetails;
  }

  /**
  *
  * @param GROUPS
  */

  addToAgent(details) {
    Object.entries(details).forEach(([key, value]) => { this.agentDetails[key] = value })
    return this.agentDetails;
  }

  getAgent() {
    return this.agentDetails;
  }

  clearAgent() {
    this.agentDetails = {};
    return this.agentDetails;
  }

  /**
  *
  * @param GROUPS
  */

  addToCarrier(details) {
    Object.entries(details).forEach(([key, value]) => { this.carrierDetails[key] = value })
    return this.carrierDetails;
  }

  getCarrier() {
    return this.carrierDetails;
  }

  clearCarrier() {
    this.carrierDetails = {};
    return this.carrierDetails;
  }
}
