import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndividualDetailServiceService {

  individualDetails = {};

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
}
