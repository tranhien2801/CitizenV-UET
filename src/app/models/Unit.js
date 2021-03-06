const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const JWT_KEY = "UETcitizenV";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const Schema = mongoose.Schema;

const UnitShema = new Schema (
    {
        nameUnit: { type: String, required: true }, 
        code: { type: String, required: true, unique: true, },
        password: { type: String, required: true, minLength: 7},
        idParent: { type: String },
        timeStart: { type: Date},
        timeEnd: { type: Date, min: Date.now },
        active: { type: String },
        progress: { type: String},
    },
    {
        timestamps: true,
    },
);

UnitShema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});


UnitShema.pre('save', async function (next) {
    // Hash the password before saving the unit model
    const unit = this
    if (unit.isModified('password')) {
        unit.password = await bcrypt.hash(unit.password, 8)
    }
    next()
});

UnitShema.methods.generateAuthToken = async function() {
    // Generate an auth token for the unit
    const unit = this;
    var role = 'A1';
    switch (unit.code.length) {
        case 2:
            role = 'A2';
            break;
        case 4:
            role = 'A3';
            break;
        case 6:
            role = 'B1';
            break;
        case 8:
            role = 'B2';
            break;
        default:
            break;    
    }
    // Mã hóa code và role thành token hợp lệ trong 5h
    const token = jwt.sign({code: unit.code, role: role}, JWT_KEY, {expiresIn: 60*60*5});
    return token;
}

UnitShema.statics.findByCredentials = async (code, password) => {
    // Search for a unit by code and password.
    const unit = await Unit.findOne({ code } );
    if (!unit) {
       // throw new Error({ error: 'Invalid login credentials' });
       return "Mã đơn vị không tồn tại trong hệ thống";
    }
    const isPasswordMatch = await bcrypt.compare(password, unit.password);
    if (!isPasswordMatch) {
        //throw new Error({ error: 'Invalid login credentials' });
        return "Mật khẩu không đúng";
    }
    return unit;
}

const Unit = mongoose.model('Unit', UnitShema);

module.exports = Unit;


