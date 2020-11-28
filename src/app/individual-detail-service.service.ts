import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndividualDetailServiceService {

  individualDetails = {};
  groupDetails = {};

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
}
