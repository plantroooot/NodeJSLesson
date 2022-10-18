//서버 오픈 문법
const express = require('express');
const app = express();

app.listen(8080, function(){//포트번호, 띄운 후 실행할 코드(http://localhost:8080/)
    console.log('listening on 8080');
});


//1. GET요청 처리 방법
//누군가가 /URL로 방문하면 해당 url 관련 안내문 띄우기
app.get('/pet', function(req, res){ // /pet 경로로의 GET요청을 처리하는 서버 제작.
    res.send('펫 용품 쇼핑할 수 있는 페이지입니다.'); //GET요청 처리
});

//숙제 : beauty URL로 접속하면 안내문 띄우기
app.get('/beauty', function(req, res){
    res.send('뷰티용품 사세요');
});

/* 
    *서버 재실행 귀찮음 - 자동화 
    1. npm install -g nodemon
    2. nodemon server.js -> 저장할때마다 서버 재실행됨
    3. window10 보안문제 -> powershell(관리자모드) / executionpolicy 입력 / set-executionpolity unrestricted / y
*/

//1-1 GET요청시 HTML파일 보내기 -> 응답인자.sendFile(__dirname + '파일명.html')
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});







