import { Component } from '@angular/core';
import { Storage } from "@ionic/storage-angular";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  data?: any;

  constructor(
    private storage: Storage
  ) {}

  keres() {
    this.storage.get("test").then(res => {
      console.log(res)
      this.data = res;
    });
  }

  mentes() {
    this.storage.set("test", { test: "testUzenet" });
  }
}
