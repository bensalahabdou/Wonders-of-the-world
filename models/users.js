const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userShema = mongoose.Schema({
email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Please enter an email valid'], 
    trim: true
},
password:{
    type: String,
    required: [true, 'Please enter an password'],
    minLength: [8, 'minimum length is 8 caracters']
}
});

userShema.statics.findUser = async(email, password)=> {
    const user = await User.findOne({email});
    if(!user)
    throw new Error('user does not exist')
    else {
        const checkUser = await bcrypt.compare(password, user.password)
        if (!checkUser)
        throw new Error('password is not correct')
        else {
            console.log('This user is already exist')
            return user;
        }
    }
}

userShema.pre('save', async function(next){
    const user = this;
    try{
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    }
    catch(e){
        console.log(e)
    }
    
});



const User = mongoose.model('user', userShema);

module.exports = User;