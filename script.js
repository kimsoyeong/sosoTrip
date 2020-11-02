$("#planBtn").css("color","#A0A0FF");
$("#planBtn").css("border-bottom","3px solid #A0A0FF");

let table = document.getElementById('plan');
let username, allday; // 유저네임, 여행일자
var iCal; //달력

// 로그아웃
document.getElementById("logout").onclick = logout;
function logout(){
  $.ajax({
    url: 'userout.php',
    type: 'post',
    async: false,
    success: function(){
      alert("로그아웃 되었습니다.")
      location.replace('home.html');
    }
  });
}

// 표 출력
$(document).ready(function (){
  // 로그인 정보 확인
  $.ajax({
    url: 'userin.php',
    type: 'post',
    data:{
      button: 1,
    },
    dataType: "json",
    async: false,
    success: function(response){
      username = response[0];
      allday = response[1];
    },
  })

  // 계획 출력
  let t;
  $.ajax({
    url: 'table.php',
    type: 'POST',
    data:{
      username: username,
      day: allday,
    },
    async: false,
    success: function(response){
      t = response;
    }
  });
  table.innerHTML += t;

  document.getElementById("username").innerText = username;
  let dayArr = document.getElementsByClassName('day_td');
  for(var i=0;i<dayArr.length;i++){
    dayArr[i].addEventListener('click',showDesc);
    dayArr[i].addEventListener('click', readPos); // 마커 위도, 경도 읽기
  }
  // 달력 생성
  iCal = new iCalendar('calendar');
  iCal.render();
});

// 날짜가 선택되었을 때의 이벤트
document.addEventListener('iCalendarDateSelected', function(event) {
  let cal = document.getElementsByClassName('curr')[0];
  let a =  cal.getElementsByTagName('a');
  for(var i=0;i<a.length;i++){
    if(a[i] != event.target){
      a[i].classList.remove('selected-link');
    }
  }
  let srcDate = parseInt(iCal.selectedDate.split('-')[2]) - 1;
  for(var i=0; i<allday; i++){ //달력에 표시
    a[srcDate + i].classList.add('selected-link');
  }

  let cale = document.getElementsByClassName('selected-link');
  let cals = new Array();
  for(var i=0; i<cale.length; i++){
    cals.push($(cale[i]).data("id"));
  }
  $.ajax({
    url: 'saveCal.php',
    type: 'POST',
    data:{
      username: username,
      calendar: cals,
      button: 1,
    },
  });
});

class iCalendar {
  constructor(target) {
    if (!target) {
      throw new Error('iCalendar: Target argument missing!');
    } else {
      let elementExists = !!document.getElementById(target);
      if (elementExists == false) {
        throw new Error('iCalendar: Specified target does not exist in DOM');
      }
    }
    this.target = target;
    this.version = 'v1.0-alpha';
    this.months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    };
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.selectYear = this.currentYear;
    this.selectMonth = this.currentMonth;
    this.selectedDate = null;
    this.calendarBody = document.querySelector('#cal-frame table.curr tbody');
    this.events = [];
    this.apiUrl = null;
    this.eventsJSON = [];
  }

  render() {
    let structure = '<div id="cal"><div class="header"><a href="" class="prev"><span class="left button" id="prev"> &lang; </span></a><span class="month-year" id="label"> June 2020 </span><a href="" class="next"><span class="right button" id="next"> &rang; </span></a></div>';
    structure += '<table id="days"><td>sun</td><td class="weekday">mon</td><td class="weekday">tue</td><td class="weekday">wed</td><td class="weekday">thu</td><td class="weekday">fri</td><td>sat</td></table>';
    structure += '<div id="cal-frame"><table class="curr"><tbody id="calendar-body"></tbody></table></div>';
    structure += '</div>';

    document.getElementById(this.target).innerHTML = structure;
    this.updateCalendar(this.currentMonth, this.currentYear);
    this._eventHandler();
  }

  updateCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    let monthAndYear = document.getElementById('label');
    monthAndYear.innerHTML = this.months[month] + " " + year;

    // 서버에 저장된 날짜를 받아옴
    let cals;
    $.ajax({
      url: 'saveCal.php',
      type: 'POST',
      data:{
        username: username,
        button: 0,
      },
      async: false,
      dataType: 'json',
      success: function(response){
        cals = response;
      },
    });
    while(cals.length > allday){ //선택 날짜에 맞게 배열 크기를 조정
      cals.splice(cals.length-1, 1);
    }

    // creating all cells
    let date = 1;
    for (let calendarRow = 0; calendarRow < 6; calendarRow++) {
      // creates a table row
      let row = document.createElement("tr");

      //creating individual cells, filing them up with data.
      for (let callendarCell = 0; callendarCell < 7; callendarCell++) {
        if (calendarRow === 0 && callendarCell < firstDay) {
          let cell = document.createElement("td");
          cell.classList.add('nil');
          let cellText = document.createTextNode("");
          let div = document.createElement('div');
          div.setAttribute('class', "day");
          div.appendChild(cellText);
          cell.appendChild(div);
          row.appendChild(cell);
        } else if (date > this._daysInMonth(month, year)) {
          break;
        } else {
          let cell = document.createElement("td");
          let cellText = document.createTextNode(date);
          let div = document.createElement('div');
          div.setAttribute('class', "day");
          let a = document.createElement('a');
          let actualMonth = this.currentMonth + 1;
          a.setAttribute('data-id', this.currentYear + '-' + actualMonth + '-' + date);
          a.setAttribute('class', 'calendarLink');

          // 서버에 저장된 날짜에 seleted-link 클래스를 추가하여 selected를 표시
          if(cals.includes($(a).data("id"))){
            a.classList.add('selected-link');
          }

          a.appendChild(cellText);
          div.appendChild(a);
          // color today's date
          if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
            div.classList.add('today');
          }
          //Check if date is weekend and apply styles
          if (this._isWeekend(this.currentYear, this.currentMonth, date)) {
            div.classList.add('weekend');
          }
          cell.appendChild(div);
          row.appendChild(cell);
          date++;
        }
      }
      tbl.appendChild(row); // appending each row into calendar body.
    }
  }

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.updateCalendar(this.currentMonth, this.currentYear);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.updateCalendar(this.currentMonth, this.currentYear);
  }

  jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
  }

  _daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  _isWeekend(year, month, date) {
    var dt = new Date(year, month, date);
    if (dt.getDay() == 6 || dt.getDay() == 0) {
      return true;
    } else {
      return false;
    }
  }

  _eventHandler() {
    let prevButton = document.querySelector("a.prev");
    prevButton.addEventListener("click", event => {
      event.preventDefault();
      this.previous();
    });

    let nextButton = document.querySelector("a.next");
    nextButton.addEventListener("click", event => {
      event.preventDefault();
      this.next();
    });

    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('calendarLink')) {
        //remove previously selected element
        let calendarLinks = document.getElementById('calendar-body').getElementsByClassName('selected-link');
        for (var i = 0; i < calendarLinks.length; i++) {
          calendarLinks[i].classList.remove('selected-link');
        }
        //remove previously selected element
        let selectedElement = event.target;
        selectedElement.classList.add("selected-link");
        this.selectedDate = selectedElement.getAttribute("data-id");
        let cEvent = new Event("iCalendarDateSelected");
        document.dispatchEvent(cEvent);
        event.preventDefault();
      }
    }.bind(this));
  }

  addEvent(iCalendarEvent) {
    this.events.push(iCalendarEvent);
  }

  getEvents() {
    return this.events;
  }

  setAPIUrl(apiURL) {
    this.apiUrl = apiURL;
  }

  _fetchEvents() {
    fetch(this.apiUrl + "?date=" + this.selectedDate).then(function(response) {
      // with the response, convert it to JSON, then pass it along
      response.json().then(function(json) {

      });
    });
  }

  _makeThisExtend(obj, CtorFunc) {
    for (var k in obj)
    if ({}.hasOwnProperty.call(obj, k))
    obj[k] = { value: obj[k] };
    return Object.create(CtorFunc.prototype, obj);
  }
}

class iCalendarEvent {
  constructor() {
    this.id = null;
    this.start = "";
    this.end = "";
    this.title = "";
    this.body = "";
    this.url = "";
    this.color = "";
  }
}
// -여기까지 달력-----------------

//선택한 메뉴에 따라 화면에 보여주기
document.getElementById("checklistBtn").onclick = menu;
document.getElementById("planBtn").onclick = menu;
document.getElementById("reserBtn").onclick = menu;
function menu(ev){
  if(ev.target.id == "planBtn"){ //여행 일정
    location.href = "main.html";
  }
  else if(ev.target.id == "checklistBtn"){ //체크리스트
    document.getElementById("forImg").innerHTML = "";
    $("#plans").hide();
    $("#checklist").show();
    $("#reserve").hide();
    $("#calendar").hide();

    $("#planBtn").css("color","gray");
    $("#checklistBtn").css("color","#A0A0FF");
    $("#reserBtn").css("color","gray");

    $("#planBtn").css("border-bottom","none");
    $("#checklistBtn").css("border-bottom","3px solid #A0A0FF");
    $("#reserBtn").css("border-bottom","none");

    showList();
    $("body").css("display", "none");
    $("body").fadeIn(100);
  }
  else if(ev.target.id = "reserBtn"){ //예약 내역
    $("#plans").hide();
    $("#checklist").hide();
    $("#reserve").show();
    $("#calendar").hide();

    $("#planBtn").css("color","gray");
    $("#checklistBtn").css("color","gray");
    $("#reserBtn").css("color","#A0A0FF");

    $("#planBtn").css("border-bottom","none");
    $("#checklistBtn").css("border-bottom","none");
    $("#reserBtn").css("border-bottom","3px solid #A0A0FF");

    showRe();
    $("body").css("display", "none");
    $("body").fadeIn(100);
  }
}

//recommend on/ off 추천 기능
let rToggle = document.getElementById("ckbx-style-11-1");
rToggle.onclick = recommend;
function recommend(){
  if(rToggle.checked == true){
    $("#recommend").show();
    $("#recoBtn").css("color", "#CCCCFF");
  }
  else{
    $("#recommend").hide();
  }
}

// plan 관련 함수
// 클릭한 요일의 상세 일정을 textarea에 표시
let nowDay;
function showDesc(ev){
  document.getElementById("submit").style.visibility = "visible";
  document.getElementById("deleteM").style.visibility = "visible";
  $("#calendar").hide();

  let tmp;
  nowDay = ev.target.id;

  $.ajax({
    url: 'readDesc.php',
    type: 'POST',
    data:{
      username: username,
      day: nowDay,
    },
    dataType: 'json',
    async: false,
    success: function(response){
      tmp = response;
    }
  });

  document.getElementById("mapday").innerHTML = nowDay.replace("d","D");
  document.getElementById("dest").value = tmp[0];
  document.getElementById("txtarea").value = tmp[1];
  document.getElementById("dest").removeAttribute("disabled");
  document.getElementById("txtarea").removeAttribute("disabled");
  document.getElementById("map").style.visibility = "visible";
  document.getElementById("menu_wrap").style.visibility = "visible";

  document.getElementById("forImg").innerHTML = "";
  let imgArr;
  $.ajax({
    url: 'img.php', //이미지 읽어오는 php
    type: 'POST',
    data:{
      username: username,
      day: nowDay,
    },
    dataType: 'json',
    async: false,
    success: function(response){
      imgArr = response;
    }
  });

  for(var i=0;i<imgArr.length; i++){
    var idtmp = imgArr[i].replace(".","_");

    var div = document.createElement("div");
    div.id = idtmp+"Div";
    div.classList.add('scale');

    var img = document.createElement("img");
    img.src = "./reserve/"+username+"/"+imgArr[i];
    img.id = idtmp;
    img.alt = imgArr[i];
    img.style.height = '259.8px';
    div.appendChild(img);
    document.getElementById("forImg").appendChild(div);
  }

  let forImg = document.getElementById("forImg");
  let reImgs = forImg.getElementsByTagName("img");
  for(var i=0; i<reImgs.length; i++){
    reImgs[i].addEventListener("click", deleteImg);
  }
  $("#reserve").show();
}

//save버튼 클릭 시, 작성한 여행일정을 서버에 저장
function save(){
  let dest = document.getElementById("dest").value; //장소
  let text = document.getElementById("txtarea").value; //상세 일정

  $.ajax({
    url:'savePlan.php', // 요청 할 주소
    type:'POST', // GET, PUT
    data: {
      username: username,
      day: nowDay,
      dest: dest, // 장소
      textarea: text,
    },// 전송할 데이터
    dataType:'text', //데이터 전송 타입
    success: function(response){ //성공 시 함수
      alert("PLAN SAVED");
    }
  });
  mPosition();
  location.href = "main.html";
}


//체크리스트 관련 함수들
document.getElementById("addbtn").onclick = newElement; //추가 버튼에 함수 추가

//서버에서 저장된 체크리스트 읽어와서 표시하기
function showList(){
  document.getElementById("myul").innerHTML = '';
  document.getElementById("myuld").innerHTML = '';
  let readUn;
  let readDo;

  $.ajax({
    url: 'read.php',
    type: 'POST',
    data:{
      username: username,
    },
    dataType: "json", //받을 때만 적용
    async: false,
    success: function(response){
      readUn = response[0];
      readDo = response[1];
    },
    error: function(){
      alert("error");
    }
  });

  if(readUn.length > 0){
    for(var i = 0; i < readUn.length; i++){
      var listadd = document.createElement("li");
      listadd.innerHTML = readUn[i];
      listadd.id = readUn[i]; //id값 주기
      document.getElementById("myul").appendChild(listadd);
    }
  }
  if(readDo.length > 0){
    for(var i = 0; i < readDo.length; i++){
      var listadd = document.createElement("li");
      listadd.innerHTML = readDo[i];
      listadd.id = readDo[i]; //id값 주기
      document.getElementById("myuld").appendChild(listadd);
    }
  }
}

//list에 새로운 할일을 추가하는 함수
function newElement(){
  var listadd = document.createElement("li"); //li태그를 가진 ele를 생성
  var input = document.getElementById("todo").value;  //todo에 입력된 값을 받음
  listadd.innerHTML=input;

  if(input != ''){  //input이 비어있지 않은 경우
    document.getElementById("myul").appendChild(listadd);
  }
  document.getElementById("todo").value = ""; //todo를 비워줌

  //서버에 저장
  $.ajax({
    url: 'saveList.php',
    type: 'POST',
    data:{
      username: username,
      list: input,
    },
    dataType: 'text',
  });
}

document.getElementById("myul").onclick = doneElement;
//완료한 할 일을 완료한 목록으로 이동
function doneElement(ev){
  if(ev.target.tagName == "LI"){
    var listadd = document.createElement("li"); //li태그를 가진 ele를 생성
    listadd.innerHTML = ev.target.innerText;
    document.getElementById("myuld").appendChild(listadd); //추가
    document.getElementById("myul").removeChild(ev.target); //삭제

    $.ajax({
      url: 'doneList.php',
      type: 'POST',
      data:{
        username: username,
        list: listadd.innerHTML,
        removeNot: 1,
      },
      dataType: 'text',
    });
  }
}

document.getElementById("myuld").onclick = deleteElement;
//완료 목록에서 할 일을 삭제
function deleteElement(ev){
  if(ev.target.tagName == "LI"){
    document.getElementById("myuld").removeChild(ev.target); //삭제

    $.ajax({
      url: 'doneList.php',
      type: 'POST',
      data:{
        username: username,
        list: ev.target.innerText,
        removeNot: 0,
      },
      dataType: 'text',
    });
  }
}

//RESERVATION 관련 함수
// 모든 예약 내역을 한 눈에 보여주기
function showRe(){
  document.getElementById("myForm").style.display = "none";

  document.getElementById("forImg").innerHTML = "";

  let imgArr;
  $.ajax({
    url: 'imgAll.php', //이미지 읽어오는 php
    type: 'POST',
    data:{
      username: username,
      allday: allday,
    },
    dataType: 'json',
    async: false,
    success: function(response){
      imgArr = response;
    }
  });

  for(var i=0;i<imgArr.length; i++){
    var idtmp = imgArr[i].replace(".","_");

    var div = document.createElement("div");
    div.id = idtmp+"Div";
    div.classList.add('scale');

    var img = document.createElement("img");
    img.src = "./reserve/"+username+"/"+imgArr[i];
    img.id = idtmp;
    img.alt = imgArr[i];
    img.style.height = '260px';
    div.appendChild(img);
    document.getElementById("forImg").appendChild(div);
  }

  let imgform = document.getElementById("forImg");
  let reImgs = imgform.getElementsByTagName("img");
  for(var i=0; i<reImgs.length; i++){
    reImgs[i].addEventListener("click", deleteImges);
  }
}

//img를 삭제_reservations에서
function deleteImges(ev){
  let i = ev.target.id;
  let del = confirm(i+": 삭제하시겠습니까?");
  if(del == true){
    let id = "#"+i;
    $('img').remove(id);
    let imgsection = document.getElementById('forImg');
    let imgArr = imgsection.getElementsByTagName('img');
    let imgIds = new Array();
    for(var j=0; j<imgArr.length; j++){
      imgIds[j] = imgArr[j].id;
    }
    $.ajax({
      url: 'removeImg.php',
      type: 'POST',
      data:{
        username: username,
        imgIdArr: imgIds,
        removed: i,
        allday: allday,
        sel: 1,
      },
      success: function(response){
        alert("삭제되었습니다.");
      }
    });
  }
}

//img를 삭제_계획란에서
function deleteImg(ev){
  let i = ev.target.id;
  let del = confirm(i+": 삭제하시겠습니까?");
  if(del == true){
    let id = "#"+i;
    $('img').remove(id);
    let imgsection = document.getElementById('forImg');
    let imgArr = imgsection.getElementsByTagName('img');
    let imgIds = new Array();
    for(var j=0; j<imgArr.length; j++){
      imgIds[j] = imgArr[j].id;
    }
    $.ajax({
      url: 'removeImg.php',
      type: 'POST',
      data:{
        username: username,
        imgIdArr: imgIds,
        removed: i,
        day: nowDay,
        sel: 0,
      },
      success: function(response){
        alert("삭제되었습니다.");
      }
    });
  }
}

$("#fileToUpload").on('change', function(){
  var fileName = $("#fileToUpload").val();
  $(".uploadName").val(fileName);
})
document.getElementById("fileSubmit").addEventListener("click", saveProfile);
//예약 내역을 업로드하는 함수
function saveProfile(){
  var form = $('#myForm')[0];
  var data = new FormData(form);
  let check = false;

  $.ajax({
    url:'upload.php', // 요청 할 주소
    type:'POST', // GET, PUT
    data: data,
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false,
    async: false,
    success: function(response){
      if(response == "ok"){
        check = true;
      }
      if(response != "ok"){
        alert(response);
      }
    }
  });

  if(check == true){
    let file= document.getElementById("fileToUpload").value;
    let tmp = file.split("\\");

    let fileName = tmp[tmp.length - 1];

    $.ajax({
      url: 'uploadFileName.php',
      type:'POST',
      data:{
        username: username,
        day: nowDay,
        fileName: fileName,
      },
      success:function(response){
        alert("저장되었습니다.");
      }
    });
    location.href = "main.html";
  }
}
