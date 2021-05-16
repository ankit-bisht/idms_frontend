import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndividualDetailServiceService {

  individualDetails = {};
  groupDetails = {};
  agentDetails = {};
  carrierDetails = {};
  policyDetails = {};

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
  * @param AGENTS
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
  * @param CARRIER
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


  /**
  *
  * @param POLCIES
  */

  addToPolicy(details) {
    Object.entries(details).forEach(([key, value]) => { this.policyDetails[key] = value })
    return this.policyDetails;
  }

  getPolicy() {
    return this.policyDetails;
  }

  clearPolicy() {
    this.policyDetails = {};
    return this.policyDetails;
  }
}
