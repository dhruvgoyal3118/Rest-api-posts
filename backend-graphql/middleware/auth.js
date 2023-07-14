const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization');
    
    if(!authHeader) 
    {
       req.isAuth=false;
       return next();
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        // console.log(token);
        decodedToken = jwt.verify(token,'somesupersecret');
    }
    catch(err){
        req.isAuth=false;
        return next();
    }
    console.log('baila');   
    console.log(decodedToken);
    if(!decodedToken)
    {
        req.isAuth=false;
        return next();
    }
    req.userId  = decodedToken.userId;
    console.log('req.userId is '+typeof req.userId);
    req.isAuth=true;
    return next();

}
