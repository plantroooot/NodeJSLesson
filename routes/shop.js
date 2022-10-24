var router = require('express').Router(); //require -> 파일이나 라이브러리 첨부할때

//require('파일경로') / require('라이브러리명') -> 해당 파일이나 라이브러리를 연결하여 그 안의 함수나 변수를 사용 가능

function loginCheck(req, res, next){
    if(req.user){ //req.user가 있으면 통과
        next();
        //console.log(req.user);
    }else{
        res.send('로그인 해주세요.')
    }
}

router.use(loginCheck); //여기 있는 모든 URL에 적용할 미들웨어. - 특정 라우터파일에 미들웨어를 적용

router.get('/shirts', function(req, res){ //중간에 미들웨어를 사용 가능
    res.send('셔츠 파는 페이지입니다.')
});

router.get('/pants', function(req, res){
    res.send('바지 파는 페이지입니다.')
});

module.exports = router; //이 파일에서 router라는 변수를 내보낼 변수
