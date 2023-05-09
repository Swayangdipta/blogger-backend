const config  = require('../config/config')
const PORT = config.PORT || 9000

let restartCounter = 0

exports.startServer = app => {
    try {
        app.listen(PORT,()=>{
            console.log(`Server started at port::${PORT}`);
        })  
    } catch (error) {
        restartCounter++
        if(restartCounter < 7){
            console.log(`Attempting to start the server.Attempt:: ${restartCounter}`);
            this.startServer()
        }else{
            // As of now it will just log a message in console 
            // later after multiple faild attempts some event will occur
            console.log("Faild to start server.");
            console.error(error)
        }
    }  
}