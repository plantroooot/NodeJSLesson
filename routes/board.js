var router = require('express').Router();

router.get('/sports', function(req, res){
    res.send('스포츠 게시판')
});

router.get('/game', function(req, res){
    res.send('게임 게시판')
});

module.exports = router; //이 파일에서 router라는 변수를 내보낼 변수