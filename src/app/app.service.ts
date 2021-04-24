import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AppService {
  constructor(private http: HttpClient) {}

  url = "https://jsonplaceholder.typicode.com/"; // since crudcrud reached maximum limits , using this API
  getEmployee(): Observable<any[]> {
    return this.http.get<any>(this.url + "posts");
  }
  createEmployee(data): Observable<any[]> {
    return this.http.post<any>(this.url + "posts", data);
  }
  editEmployee(data): Observable<any> {
    return this.http.put<any>(this.url + `posts/${data.userid}`, data);
  }
  deleteEmployee(id): Observable<any> {
    return this.http.delete<any>(this.url + `posts/${id}`);
  }
}
