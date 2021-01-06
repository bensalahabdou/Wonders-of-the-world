const User = require('../models/users');
const jwt = require('JsonWebToken');

const handelErrors = (err) => {
    let errors = { email:'', password:'' };

    // handle the error of duplicated email
    if(err.code === 11000){
        errors.email = 'this email already exist try another'
    }

    //handle errors of email and password validation
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path]= properties.message;
        })
            
    }

    // handle errors for login step
    if(err.message === 'user does not exist'){
        errors.email = 'This user does not exist'
    }
    
    if(err.message === 'password is not correct'){
        errors.password = 'Try the correct password'
    }


    return errors;
}
 
const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
return jwt.sign({id}, process.env.SECRET_KEY, { expiresIn: maxAge })
}

module.exports.signup_get = (req, res)=>{
    res.render('pages/signup', {title: "sign up"})
};

module.exports.signin_get = (req, res)=>{
    res.render('pages/signin', {title: "sign in"})
};

module.exports.signup_post = async(req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true});
        res.status(201).json({user})
        console.log(token)
    }
    catch (e){
        let errors = handelErrors(e)
        res.status(400).json({errors});
    }
};


module.exports.signin_post = async(req,res) => {
    const  { email, password } = req.body;
   try{
        const user = await User.findUser( email, password );
        const token = createToken(user._id);
        res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true});
        res.status(201).json({user})
    }
   catch(e){
    let errors = handelErrors(e)
    res.status(401).json({errors});
   }
    
};



module.exports.logout_get = (req, res)=>{
    res.cookie('jwt', '', {maxAge: 1});
        res.redirect('/');
};


