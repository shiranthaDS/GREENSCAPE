const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    category:{
        type:String,
        require:true
    },
    area:{
        type:String,
        require:true
    },
    description:{
        type:String,
        required:true
    },
    
    

});

module.exports = mongoose.model('streetsupervision',postSchema);