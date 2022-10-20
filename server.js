//최초 실행시 nodemon server.js

//서버 오픈 문법
const express = require('express');
const app = express();
//input데이터 저장 라이브러리
app.use(express.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://admin:dksktkd1@tododata.vmoi4xy.mongodb.net/?retryWrites=true&w=majority', function(error, client){ //database접속이 완료되면 실행됨
    if(error){return console.log(error);}
    db = client.db('todoapp');//todoapp이라는 database(폴더)에 연결

   /* db.collection('post').insertOne( {이름 : 'Jhon', _id : 100} , function(error, rst){//( {object자료형}, 콜백함수 - error, result)
        console.log('저장완료');
    }); */

    app.listen(8080, function(){//포트번호, 띄운 후 실행할 코드(http://localhost:8080/)
        console.log('listening on 8080');
    });
});


//1. GET요청 처리 방법
//누군가가 /URL로 방문하면 해당 url 관련 안내문 띄우기
//app.get('경로', 콜백함수 - function(req, res){})
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

app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html');
});

//2. POST요청 처리 방법
//어떤 사람이 /add 경로로 POST요청을 하면 ???을 해주세요~
//1. body-parser필요 - 상단 코드 참고
//2. form데이터 input태그에 name추가
//3. req.body.name(req.body -> 요청했던 form에 적힌 데이터 수신 가능)
//app,post('경로', 콜백함수)

//어떤 사람이 /add라는 경로로 post요청을 하면, 데이터 2개를 보내주는데, 이 때 post라는 이름을 가진 collection 두개 데이터를 저장하기({ 제목 : '', 날짜 : ''})
app.post('/newpost', function(req, res){
    res.send('전송완료');    
    console.log(req.body.title);
    console.log(req.body.date);   

    db.collection('post').insertOne( {제목 : req.body.title, 날짜 : req.body.date} , function(error, rst){//( {object자료형}, 콜백함수 - error, result)
        console.log('저장완료');
    }); 
});














