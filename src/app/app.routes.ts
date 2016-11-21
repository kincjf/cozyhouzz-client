import { Routes, RouterModule } from '@angular/router';

import { Login } from './login';

import { Signup } from './member/signup';
import { Change } from './member/change';

import { BizList } from './businessList/bizList/bizList';
import { BizListDetail } from './businessList/bizListDetail/bizListDetail';

import { AuthGuard } from './common/auth.guard';
import { MainPage} from './common/mainPage/mainPage';

import { BuildCaseInput} from './buildCase/buildCaseInput';
import { BuildCaseUpdate} from './buildCase/buildCaseUpdate/buildCaseUpdate';
import { BuildCaseLately } from './buildCase/buildCaseLately/buildCaseLately';
import { BuildCaseList } from './buildCase/buildCaseList/buildCaseList';
import { BuildCaseDetail } from './buildCase/detail/detail';

import { RoomInfoInput } from './roomInfo/input';
import { RoomInfoUpdate } from './roomInfo/update';
import { RoomInfoList } from './roomInfo/list';
import { RoomInfoDetail } from './roomInfo/detail';
import { RoomInfoLately } from './roomInfo/lately';

import { ConsultingCounsel } from './consulting/consultingCounsel/consultingCounsel';
import { ConsultingDetail } from './consulting/consultingDetail/consultingDetail';
import { ConsultingListInfo } from './consulting/consultingListInfo/consultingListInfo';
import { ConsultingMyListInfo } from './consulting/consultingMyListInfo/consultingMyListInfo';
import { ConsultingChange} from './consulting/consultingchange/consultingchange';
import {CanDeactivateGuard} from "./common/can-deactivate-guard.service";


export const ROUTES: Routes = [
  { path: '',       component:  MainPage },  // 메인 페이지 화면

  { path: 'login',  component: Login }, // URL/login : 로그인

  { path: 'signup', component: Signup },  // URL/signup : 일반과 사업주 회원가입
  { path: 'change', component: Change },  // URL/change : 사업주 회원정보변경시 일반과 사업주정보선택화면

  { path: 'businesslist', component: BizList },  // URL/businesslist : 사업주 목록 조회
  { path: 'businessdetail', component: BizListDetail },  // URL/businessdetail : 사업주 상세보기

  { path: 'buildcaseinput', component: BuildCaseInput, canDeactivate: [CanDeactivateGuard] },  // URL/buildcaseinput : 시공사례입력
  { path: 'buildcaseupdate/:buildCaseIdx', component: BuildCaseUpdate, canDeactivate: [CanDeactivateGuard] },  // URL/buildcaseinput : 시공사례수정
  { path: 'buildcaselately', component: BuildCaseLately },  // URL/buildcaselately : 최근 본 시공사례 조회
  { path: 'buildcaselist', component: BuildCaseList },  // URL/buildcaselist : 시공사례 조회
  { path: 'buildcasedetail/:buildCaseIdx', component: BuildCaseDetail },  // URL/buildcasedetail : 시공사례 상세보기

  { path: 'create/room', component: RoomInfoInput, canDeactivate: [CanDeactivateGuard] },  // 방 정보 입력
  { path: 'update/room/:roomListIdx', component: RoomInfoUpdate, canDeactivate: [CanDeactivateGuard] },     // 방 정보 수정
  { path: 'lately/room', component: RoomInfoLately },  // 최근 본 방 정보
  { path: 'list/room', component: RoomInfoList },  // 방 정보 목록 조회
  { path: 'detail/room/:roomListIdx', component: RoomInfoDetail },  // 방 정보 상세보기

  { path: 'bizList',   component: BizList },  // URL/bizList : 업체목록조회하기
  { path: 'bizListDetail/:bizUserIdx',   component: BizListDetail },  // URL/bizListDetail : 업체목록 상세보기

  { path: 'consultingCounsel',   component: ConsultingCounsel, canDeactivate: [CanDeactivateGuard] },  // URL/consultingCounsel : 특정업체 컨설팅 상담
  { path: 'consultingDetail/:consultingIdx',   component: ConsultingDetail },  // URL/consultingDetail : 컨설팅 정보 상세보기
  { path: 'consultingMyListInfo',   component: ConsultingMyListInfo },  // URL/consultingMyListInfo : 내 컨설팅 정보조회
  { path: 'consultingListInfo',   component: ConsultingListInfo },  // URL/consultingListInfo : 컨설팅 정보조회
  { path: 'consultingChange/:consultingIdx',  component: ConsultingChange, canDeactivate: [CanDeactivateGuard] },  // URL/consultingChange : 컨설팅 정보변경
  { path: '**',     component: MainPage }    // 라우터 설정에 없는 URL이 입력 되었을때  :  메인페이지로 이동
];
