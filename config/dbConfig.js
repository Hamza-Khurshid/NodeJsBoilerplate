const mongoose = require("mongoose");

function dbConnection() {

    mongoose.connect(
        `mongodb+srv://test1:test1@spreadknowledge-fzdmf.mongodb.net/test?retryWrites=true&w=majority`
        ,
        { useNewUrlParser: true },
        function (err) {
            if (err) {
                console.log("err connecting db: ", err);
            } else {
                console.log("db successfully connected.");
            }
        }
    );
}

module.exports = dbConnection;