const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});
NODE_ENV = process.env.NODE_ENV;

const conectarDB = async () => {
    console.log(NODE_ENV)
    const DB_URI = (NODE_ENV === "test") ? process.env.DB_URI_TEST : process.env.DB_URI;

    try{
        await mongoose.connect(DB_URI,{
        })
        console.log("DB Conectada")
        
    }catch(error){
        console.log(error);
        process.exit(1) // Detener App
    }
}

module.exports = conectarDB