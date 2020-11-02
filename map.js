// 마커를 담을 배열입니다
var markers = [];

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
  center: new kakao.maps.LatLng(36.3688388,127.3441342), // 지도의 중심좌표
  level: 14 // 지도의 확대 레벨
};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map);

// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지도를 클릭했을때 클릭한 위치에 마커를 추가하도록 지도에 클릭이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
  // 클릭한 위치에 마커를 표시합니다
  addMarker(mouseEvent.latLng);
});

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

  let keyword = document.getElementById('keyword').value;

  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!');
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {

    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    // 페이지 번호를 표출합니다
    displayPagination(pagination);

  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

    alert('검색 결과가 존재하지 않습니다.');
    return;

  } else if (status === kakao.maps.services.Status.ERROR) {

    alert('검색 결과 중 오류가 발생했습니다.');
    return;

  }
}

// 검색 결과 목록을 표출하는 함수입니다
function displayPlaces(places) {

  var listEl = document.getElementById('placesList'),
  menuEl = document.getElementById('menu_wrap'),
  fragment = document.createDocumentFragment(),
  bounds = new kakao.maps.LatLngBounds(),
  listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // // 지도에 표시되고 있는 마커를 제거합니다
  // removeMarker();

  for ( var i=0; i<places.length; i++ ) {

    // 마커를 생성하고 지도에 표시합니다
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
    itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(placePosition);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
  a();
}
let lili;
let listArr;

function a(){
  listArr = document.getElementById("placesList").childNodes;
  lili = [];
  for(var i=0;i<listArr.length;i++){
    let tmp = listArr[i].childNodes[1];
    let temp = tmp.childNodes[3]; //도로명 주소가 저장된 element
    listArr[i].onclick = check;
    lili[i] = temp.innerText; //도로명 주소
  }
}

function check(ev){
  let tar = ev.target; //li
  for(var i=0;i<listArr.length;i++){
    if(tar == listArr[i] || tar == listArr[i].childNodes[0] || tar == listArr[i].childNodes[1]){
      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();

      // 주소로 좌표를 검색합니다
      geocoder.addressSearch(lili[i], function(result, status) {

        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          // 결과값으로 받은 위치를 마커로 표시합니다
          var marker = new kakao.maps.Marker({
            map: map,
            position: coords
          });
          markers.push(marker);

          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        }
      }); //function
    }
  }
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

  var el = document.createElement('li'),
  itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
  '<div class="info">' +
  '   <h5>' + places.place_name + '</h5>';

  if (places.road_address_name) {
    itemStr += '    <span>' + places.road_address_name + '</span>' +
    '   <span class="jibun gray">' +  places.address_name  + '</span>';
  } else {
    itemStr += '    <span>' +  places.address_name  + '</span>';
  }

  itemStr += '  <span class="tel">' + places.phone  + '</span>' +
  '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById('pagination'),
  fragment = document.createDocumentFragment(),
  i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild (paginationEl.lastChild);
  }

  for (i=1; i<=pagination.last; i++) {
    var el = document.createElement('a');
    el.href = "#";
    el.innerHTML = i;

    if (i===pagination.current) {
      el.className = 'on';
    } else {
      el.onclick = (function(i) {
        return function() {
          pagination.gotoPage(i);
        }
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function deleteMarkers() {
  for ( var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild (el.lastChild);
  }
}

//원래 코드
// 마커를 생성하고 지도위에 표시하는 함수입니다
function addMarker(position) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: position,
    clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
  });
  kakao.maps.event.addListener(marker, 'click', function() {
    alert('마커를 클릭했습니다!');
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(map);

  // 생성된 마커를 배열에 추가합니다
  markers.push(marker);
}

// 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
function setMarkers(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

//마커의 좌표를 서버에 저장하는 함수
function mPosition(){
  let pos = new Array();
  for (var i = 0; i < markers.length; i++) {
    let markerpos = markers[i].getPosition();
    let lat = markerpos.getLat();
    let lng = markerpos.getLng();
    pos.push(lat+"|"+lng+'\n');
  }

  $.ajax({
    url: 'marker.php',
    type: 'POST',
    data:{
      username: username,
      posArr: pos,
      day: nowDay,
    },
  });
}

//저장된 좌표로 지도에 마커 표시하기
function readPos(){
  deleteMarkers();
  let markerArr = new Array();
  $.ajax({
    url: 'rMarker.php',
    type: 'POST',
    data:{
      username: username,
      day: nowDay,
    },
    dataType: "json",
    async: false,
    success:function(response){
      if(response != "1"){
        markerArr = response;
      }
    },
  });

  if(markerArr.length > 0){
    for(var i=0;i<markerArr.length; i++){
      var tmpll = markerArr[i];
      let ll = tmpll.split("|");
      var lat = ll[0];
      var lng = ll[1];
      var latlng = new kakao.maps.LatLng(lat, lng);
      addMarker(latlng);
    }
  }
}
