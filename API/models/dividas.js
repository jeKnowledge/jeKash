const mongoose = require('mongoose');

const dividaSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    departament: {type: String, required: true},
    name: {type: String, require: true},
    price: {type: Number, require:true}
});

module.exports = mongoose.model('Divida',dividaSchema);