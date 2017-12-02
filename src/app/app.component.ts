import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const DOGS_KEY = makeStateKey('dogs');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  dogs: Array<any>;

  constructor(private http: HttpClient, private transferState: TransferState) {}

  ngOnInit(): void {
    this.dogs = this.transferState.get<Array<any>>(DOGS_KEY, null);

    if (!this.dogs) {
      this.http.get<Array<any>>('https://dog.ceo/api/breeds/list/all').subscribe(data => {
        this.dogs = data;
        this.transferState.set<Array<any>>(DOGS_KEY, data);
      });
    }
  }
}
