//최초 실행시 nodemon server.js

//서버 오픈 문법
const express = require('express');
const app = express();
//input데이터 저장 라이브러리
app.use(express.urlencoded({extended: true}));

//MongoDatabase 연결
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

//EJS 연결
app.set('view engine', 'ejs');


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
//1) body-parser필요 - 상단 코드 참고
//2) form데이터 input태그에 name추가
//3) req.body.name(req.body -> 요청했던 form에 적힌 데이터 수신 가능)
//app.post('경로', 콜백함수)

//어떤 사람이 /newpost라는 경로로 post요청을 하면, 데이터 2개를 보내주는데, 이 때 post라는 이름을 가진 collection 두개 데이터를 저장하기({ 제목 : '', 날짜 : ''})
app.post('/newpost', function(req, res){       
    //console.log(req.body.title);
    //console.log(req.body.date);
    db.collection('counter').findOne({name : '게시물갯수'}, function(error, rst){//1개만 찾기
        //총 게시물 갯수 구하기
        console.log(rst.totalPost);       
        var totalPostNum = rst.totalPost;       

        db.collection('post').insertOne( { _id : totalPostNum + 1, 제목 : req.body.title, 날짜 : req.body.date} , function(error, rst){//( {object자료형}, 콜백함수 - error, result)
            console.log('저장완료');

            //이후 DB에 있는 counter라는 콜렉션에 있는 totalPost라는 항목도 1증가시켜야함. 그래야 총 게시물 갯수 카운트가 올라가서 다음에 새로운 아이디를 가져올 수 있음
            // - updateOne({어떤 데이터를 수정할지}, { operator : {수정값}}) -> 지정한 1개의 데이터 수정가능
            //operator - $set -> 값을 바꾸고 싶을때, $inc -> 값을 증가시킬때($ 표시 붙은게 바로 operator 라는 문법)
            db.collection('counter').updateOne({name : '게시물갯수'}, { $inc : {totalPost:1}}, function(error, rst){
                if(error){ return console.log(error); }
                res.send('전송완료'); 
            });
        });        
    });
});

//2-1. 저장한 페이지 보여주기
// /list로 GET요청으로 접속하면 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(req, res){
    //DB에 저장된 post라는 collection안의 데이터 다루기 -> db.collection('post')

    // 1)모든 데이터 꺼내기
    db.collection('post').find().toArray(function(error, rst){
        console.log(rst);
        res.render('list.ejs', { posts : rst });
    });
});

//3. DELETE요청 처리방법
//3.1) method-override 라이브러리 이용
//3.2) Javascript AJAX이용 - 이걸로 사용!
app.delete('/delete', function(req, res){
    console.log(req.body);
    req.body._id = parseInt(req.body._id); //parseInt() - 정수로 변환

    //req.body에 담겨온 게시물번호를 가진 글을 DB에서 찾아서 삭제해주세요.
    //deleteOne({어떤 항목을 삭제할지 정함} 콜백함수)
    db.collection('post').deleteOne(req.body, function(error, rst){
        console.log('삭제완료');
        res.status(200).send({ message : '성공했습니다'});
        //요청성공시 보내는 요청코드 - 200, 실패시 400.
    });
});
















