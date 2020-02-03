import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deploy } from 'plugins/cordova-plugin-ionic/dist/ngx';
import { CheckForUpdateResponse } from 'plugins/cordova-plugin-ionic/dist/IonicCordova';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deploy: Deploy
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    if (this.platform.is('cordova')) {
      let config = {
        appId: '6af104c9',
        channel: 'Master'
      };

      this.deploy.configure(config);

      this.deploy.checkForUpdate().then(async (update: CheckForUpdateResponse) => {
        if (update.available){
          await this.deploy.downloadUpdate((progress) => {
            console.log('download', progress);
          })
          await this.deploy.extractUpdate((progress) => {
            console.log(progress);
          })
          await this.deploy.reloadApp();
        }
      });
    }
  }
}
