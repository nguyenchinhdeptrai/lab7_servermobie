exports.check_login = (req, res , next)=>{
    if(req.session.userLogin){
        //đã đăng nhập
        next();
    }else{
        //chưa đăng nhập yêu cầu login
        res.redirect('/');
    }
}