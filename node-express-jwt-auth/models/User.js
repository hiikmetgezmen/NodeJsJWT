const mongoose = require('mongoose');
const {isEmail} = require('validator');
const brcypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'please enter an email'],
        unique:[true,'dsfgh'],
        lowercase:true,
        validate:[isEmail,'please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'please enter an password'],
        minLength:[6,'min 6']
    }
});


// userSchema.post('save',function (doc,next){
//     console.log('user was created',doc);
//     next();
// });

// userSchema.pre('save',function (next){
//     console.log('user about created',this);
//     next();
// });
userSchema.pre('save',async function (next){
    const salt = await brcypt.genSalt();
    this.password = await brcypt.hash(this.password,salt);
    next();
});

userSchema.statics.login = async function(email,password)
{
    const user = await this.findOne({email});
    if(user)
    {
        const auth = await brcypt.compare(password,user.password);
        if(auth)
        {
            return user;
        }
        throw Error('password');
    }
    throw Error('email');
};



const User = mongoose.model('user',userSchema);

module.exports = User;