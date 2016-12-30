/**
 * Created by InSuJeong on 2016-12-21.
 */
import { Injectable } from '@angular/core'

//이 class를 다른곳에서 import해서 쓸수있도록 @Injectable 설정도 해준다.
@Injectable()
export class DaumMapService {
    loadDaumMap(address) {
        var lat = 37.56439;//위도
        var lng = 126.97759;//경도

        var addr = address;

        var src = "http://apis.daum.net/maps/maps3.js?apikey=081667aabd91180e5bb26c06b174233b&autoload=false&libraries=services,clusterer";

        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
        script.onload = function () {
            daum.maps.load(function () {

                // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
                var placeOverlay = new daum.maps.CustomOverlay({zIndex:1}),
                    contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
                    markers = [], // 마커를 담을 배열입니다
                    currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

                var mapContainer = document.getElementById('map'), // 지도를 표시할 div
                    mapOption = {
                        center: new daum.maps.LatLng(lat, lng), // 지도의 중심좌표
                        level: 4, // 지도의 확대 레벨
                        mapTypeId: daum.maps.MapTypeId.ROADMAP // 지도종류
                    };

                // 지도를 생성한다
                var map = new daum.maps.Map(mapContainer, mapOption);



                // 마커 이미지의 주소
                var markerImageUrl = 'http://t1.daumcdn.net/localimg/localimages/07/2012/img/marker_p.png',
                    markerImageSize = new daum.maps.Size(100, 100), // 마커 이미지의 크기
                    markerImageOptions = {
                        spriteOrigin : new daum.maps.Point(0, 0), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                        spriteSize : new daum.maps.Size(40, 42), // 스프라이트 이미지의 전체 크기
                        offset : new daum.maps.Point(11, 39)// 마커 좌표에 일치시킬 이미지 안의 좌표
                    };

                // 마커 이미지를 생성한다
                var markerImage = new daum.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);

                // 주소-좌표 변환 객체를 생성합니다
                var geocoder = new daum.maps.services.Geocoder();


                //로드뷰를 표시할 div
                var roadviewContainer = document.getElementById('roadview');

                // 로드뷰 위치
                //var rvPosition = vrcoords;
                //var rvPosition=new daum.maps.LatLng(37.56662, 126.98232);

                //로드뷰 객체를 생성한다
                var roadview = new daum.maps.Roadview(roadviewContainer, {
                    panoID:1028313536,
                    panoX:126.97837,
                    panoY:37.56613,
                    pan: 68, // 로드뷰 처음 실행시에 바라봐야 할 수평 각
                    tilt: 1, // 로드뷰 처음 실행시에 바라봐야 할 수직 각
                    zoom: -1 // 로드뷰 줌 초기값
                });

                //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체를 생성한다
                var roadviewClient = new daum.maps.RoadviewClient();

                // 주소로 좌표를 검색합니다
                geocoder.addr2coord(addr, function(status, result) {

                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {

                        var coords = new daum.maps.LatLng(result.addr[0].lat, result.addr[0].lng);
                        var rvPosition = new daum.maps.LatLng(result.addr[0].lat, result.addr[0].lng);
                        // 결과값으로 받은 위치를 마커로 표시합니다
                        var marker = new daum.maps.Marker({
                            map: map,
                            position: coords
                        });

                        // 인포윈도우로 장소에 대한 설명을 표시합니다
                        var infowindow = new daum.maps.InfoWindow({
                            content: '<div style="width:150px;text-align:center;padding:6px 0;">방위치</div>'
                        });
                        infowindow.open(map, marker);

                        // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다
                        roadviewClient.getNearestPanoId(rvPosition, 50, function(panoId) {
                            // panoId와 중심좌표를 통해 로드뷰를 실행한다
                            roadview.setPanoId(panoId, rvPosition);
                        });

                        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                        map.setCenter(coords);
                    }
                });

                // 지도 타입 변경 컨트롤을 생성한다
                var mapTypeControl = new daum.maps.MapTypeControl();

                // 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
                map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

                // 지도에 확대 축소 컨트롤을 생성한다
                var zoomControl = new daum.maps.ZoomControl();

            // 지도의 우측에 확대 축소 컨트롤을 추가한다
            map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

            // 지도에 마커를 생성하고 표시한다
            var marker = new daum.maps.Marker({
                position: new daum.maps.LatLng(37.56662, 126.98232), // 마커의 좌표
                image : markerImage, //마커의 이미지
                map: map // 마커를 표시할 지도 객체
            });
        });
        };
    }
}
