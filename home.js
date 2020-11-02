document.getElementById("login").onclick = userin;
document.getElementById("signin").onclick = userin;

// 로그인,회원가입 함수
function userin(ev){
  //사용자 이름과 여행 일자의 양식 확인
  var regen = /^[a-zA-z]+$/;
  var regpw = /^[a-zA-z0-9]+$/;
  var regnum = /^[0-9]+$/;
  let username = $("#username").val();
  let password = $("#password").val();
  let day = $("#day").val();

  if (!regen.test(username)){ //username이 양식에 맞지 않는 경우
    alert("username는 영문자로 입력하세요.");
    $("username").val('');
  }
  if(!regpw.test(password)){
    alert("password는 영문자, 숫자로 입력하세요.");
    $("#password").val('');
  }
  if(regen.test(username) && regpw.test(password)){ //양식에 맞게 적은 경우
    if(ev.target == $("#login")[0]){ //로그인
      if(!regnum.test(day)) { //day이 양식에 맞지 않는 경우
        alert("day는 숫자로 입력하세요.");
        $("#day").val('');
      }
      else{
        $.ajax({
          url: 'userin.php',
          type: 'post',
          data:{
            username: username,
            password: password,
            day: day,
            button: 0,
          },
          async: false,
          success: function(response){
            if(response == "success"){
              location.href = 'main.html'; //여행 일정 작성 페이지로 이동
            }
            else{
              alert("username과 password를 확인해주세요.");
            }
          },
          error: function(response){
            alert("불가능");
          }
        });
      }
    }
    else{ //회원가입
      $.ajax({
        url: 'userin.php',
        type: 'post',
        data:{
          username: username,
          password: password,
          button: 2,
        },
        success: function(response){
          if(response == "success"){
            alert("환영합니다. 회원가입이 완료되었습니다.");
          }
          else{
            alert("중복되는 username입니다.");
          }
        },
        error: function(response){
          alert("불가능");
        }
      });
    }
  } //if_양식
}
