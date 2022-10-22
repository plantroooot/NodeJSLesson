//최초 실행시 nodemon server.js

//서버 오픈 문법
const express = require('express');
const app = express();
//input데이터 저장 라이브러리
app.use(express.urlencoded({extended: true}));

//환경변수 연결
require('dotenv').config();

//MongoDatabase 연결
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect(process.env.DB_URL, function(error, client){ //database접속이 완료되면 실행됨
    if(error){return console.log(error);}
    db = client.db('todoapp');//todoapp이라는 database(폴더)에 연결

   /* db.collection('post').insertOne( {이름 : 'Jhon', _id : 100} , function(error, rst){//( {object자료형}, 콜백함수 - error, result)
        console.log('저장완료');
    }); */

    app.listen(process.env.PORT, function(){//포트번호, 띄운 후 실행할 코드(http://localhost:8080/)
        console.log('listening on 8080');
    });
});

//method-override - put, delete요청
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//EJS 연결
app.set('view engine', 'ejs');

//Pubilc폴더 연결
app.use('/public', express.static('public'));


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
    //res.sendFile(__dirname + '/index.html');
    res.render('index.ejs')
});

app.get('/write', function(req, res){
    //res.sendFile(__dirname + '/write.html');
    res.render('write.ejs')
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
                res.redirect('/list');
            });
        });        
    });
});

//2-1. 저장한 페이지 보여주기
// /list로 GET요청으로 접속하면 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(req, res){
    //DB에 저장된 post라는 collection안의 데이터 다루기 -> db.collection('post')

    // 1)모든 데이터 꺼내기 -> res.render('파일명', { 데이터이름 : 데이터내용 })
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

//4.작성한 글의 상세페이지 만들기
// get('/서버명/:파라미터') -> /서버명/파라미터로 get요청시 코드 실행
app.get('/detail/:id', function(req, res){ 
    // /detail/:id 로 접속시 detail.ejs보여줌 -> :문자열 -> req.params.문자열 세트로 다님
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, rst){ //그냥 id로 하면 문자열로 받아옴.
        
        //if(error){ return console.log('없음') }
        if(rst == null || rst == undefined){ //게시글이 없을경우
            res.send('전송실패');
        }else{
            res.render('detail.ejs', { data : rst });
        }
        console.log(rst);
        
    });
   
});

//5. PUT요청 처리방법(수정페이지)
//수정페이지 요청
app.get('/edit/:id', function(req, res){
   db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, rst){
        res.render('edit.ejs', { data : rst });
   }); 
});
//5-1. 수정기능1 - POST요청 사용
//id값을 가져오기 위해 id값을 파라미터로 가져옴 -> findOne으로 해당 _id값의 정보를 불러옴 -> updateOne으로 해당 _id값의 제목, 날짜를 input의 값으로 수정($set : {수정내용 - object형으로 입력} ).
// app.post('/edit/:id', function(req, res){ 
//         db.collection('post').updateOne({ _id : parseInt(req.params.id) }, { $set : {제목 : req.body.title, 날짜 : req.body.date} }, function(error, rst){
//             if(error) { return console.log(error); }
//             res.send('수정완료');
//       }); 
// });

//5-2. 수정기능2 - PUT요청 사용(methodoverride 사용)
//폼에 담긴 제목, 날짜 데이터를 가지고 db.collection에다가 업데이트함.
app.put('/edit', function(req, res){
    db.collection('post').updateOne({ _id : parseInt(req.body.id) }, { $set : { 제목 : req.body.title, 날짜 : req.body.date } }, function(error, rst){
        console.log('수정완료');
        res.redirect('/list');
    });
});


//6. 로그인 기능
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : 'dksktkd1', resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(미들웨어) - 요청 - 응답중간에 실행되는 코드

app.get('/login', function(req, res){
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(req, res){ //id, pw검사 -> passport.authenticate()
    res.redirect('/');
});

app.get('/mypage', loginCheck, function(req, res){
    console.log(req.user); //사용자의 정보
    res.render('mypage.ejs', {data : req.user});
});

function loginCheck(req, res, next){
    if(req.user){ //req.user가 있으면 통과
        next();
        //console.log(req.user);
    }else{
        res.send('로그인 해주세요.')
    }
}

passport.use(new LocalStrategy({
    usernameField: 'id', //form의 name이 id인 input
    passwordField: 'pw', //form의 name이 pw인 input
    session: true, //세션정보 저장여부
    passReqToCallback: false, //아이디 / 비밀번호 말고도 다른정보 검증시 true, 이후 콜백함수 맨 앞에 req추가.
  }, function (user_id, user_pw, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: user_id }, function (error, rst) {
      if (error) return done(error)

      //비밀번호 보안문제 해결해보기 -> 회원가입시 비번을 암호화하여 저장, 로그인시 비밀번호를 암호화하여 일치여부 판단
      //done(param1, param2, param3) - param1 : 서버에러, param2 : id,pw가 다 맞을때 결과를 반환함, param3 : error메세지
      if (!rst) return done(null, false, { message: '존재하지않는 아이디요' });
      if (user_pw == rst.pw) {
        return done(null, rst);
      } else {
        return done(null, false, { message: '비번틀렸어요' });
      }
    })
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id); // id를 이용하여 세션을 저장시키는 코드(로그인 성공시 실행)
  });

  passport.deserializeUser(function(user_id, done){
    //DB에서 위에 있던 user.id로 유저를 찾은 뒤에 유저 정보를 null옆에 넣음
    db.collection('login').findOne({id : user_id}, function(error, rst){
        done(null, rst); //마이페이지 접속시 사용
    })
    
  });


























