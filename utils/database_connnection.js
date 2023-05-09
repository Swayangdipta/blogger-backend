const config  = require('../config/config')
const mongoose = require('mongoose')


exports.dbConnection = () => {
    try {
        mongoose.connect(config.DB_URL).then((res)=>{
            console.log(`DATABASE CONNECTED.`);
        }).catch(err => {
            console.log(err);
        })
    } catch (error) {
        console.error("Faild to establish database connection!!!");
        console.error(error);
    }
}