import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng2-recaptcha';

/*
 * Platform and Environment providers/directives/pipes
wsgrggnee */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { Login } from './login';

import { Signup } from './member/signup';
import { Change } from './member/change';

import { NormalSignupChange } from './member/normalSignupchange';
import { BusinessSignupChange } from './member/businessSignupchange';

import { BizList } from './businessList/bizList/bizList';
import { BizListDetail } from './businessList/bizListDetail/bizListDetail';

import { AuthGuard } from './common/auth.guard';
import { MainPage} from './common/mainPage/mainPage';

import { BuildCaseInput} from './buildCase/buildCaseInput';
import { BuildCaseUpdate} from './buildCase/buildCaseUpdate/buildCaseUpdate';
import { BuildCaseLately } from './buildCase/buildCaseLately/buildCaseLately';
import { BuildCaseList } from './buildCase/buildCaseList/buildCaseList';
import { BuildCaseDetail } from './buildCase/detail/detail';

import { ConsultingCounsel } from './consulting/consultingCounsel/consultingCounsel';
import { ConsultingDetail } from './consulting/consultingDetail/consultingDetail';
import { ConsultingListInfo } from './consulting/consultingListInfo/consultingListInfo';
import { ConsultingMyListInfo } from './consulting/consultingMyListInfo/consultingMyListInfo';
import { ConsultingChange} from './consulting/consultingchange/consultingchange';

import { RoomInfoInput } from './roomInfo/input';
import { RoomInfoUpdate } from './roomInfo/update';
import { RoomInfoList } from './roomInfo/list';
import { RoomInfoDetail } from './roomInfo/detail';
import { RoomInfoLately } from './roomInfo/lately';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    Login, Signup, Change,
    NormalSignupChange, BusinessSignupChange,
    BizList, BizListDetail,
    MainPage,
    BuildCaseInput, BuildCaseUpdate, BuildCaseLately, BuildCaseList, BuildCaseDetail,
    ConsultingCounsel, ConsultingDetail, ConsultingListInfo, ConsultingMyListInfo, ConsultingChange,
    RoomInfoInput, RoomInfoUpdate, RoomInfoList, RoomInfoDetail, RoomInfoLately
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    RecaptchaModule.forRoot(),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    AuthGuard
  ]
})
export class AppModule {

}

