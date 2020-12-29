import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  domain = "http://localhost:8020/";
  
  constructor(private http: HttpClient) { }

  get(url) {
    url = this.domain + url;
    return this.http.get(url);
  }

  post(url, postData) {
    url = this.domain + url;
    return this.http.post(url, postData);
  }

  delete(url) {
    url = this.domain + url;
    return this.http.delete(url);
  }
}
