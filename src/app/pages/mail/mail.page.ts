// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-mail',
//   templateUrl: './mail.page.html',
//   styleUrls: ['./mail.page.scss'],
// })
// export class MailPage implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AccountPage } from '../account/account.page';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.page.html',
  styleUrls: ['./mail.page.scss'],
})
export class MailPage implements OnInit {
  emails = [];

  constructor(private http: HttpClient, private popoverCtrl: PopoverController, private router: Router) { }

  ngOnInit() {
    this.http.get<any[]>('https://devdactic.fra1.digitaloceanspaces.com/gmail/data.json').subscribe(res => {
      this.emails = res;
      for (const e of this.emails) {
        // Create a custom color for every email
        e.color = this.intToRGB(this.hashCode(e.from));
      }
    });
  }

  openDetails(id) {
    this.router.navigate(['tabs', 'mail', id]);
  }

  // for the popover: adding a function to call our component
  async openAccount(ev) {
    const popover = await this.popoverCtrl.create({
      component: AccountPage,
      event: ev,
      cssClass: 'custom-popover'
    });

    await popover.present();
  }

  // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  private hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  private intToRGB(i) {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }

  doRefresh(ev) {
    setTimeout(() => {
      ev.target.complete();
    }, 2000);
  }
}

