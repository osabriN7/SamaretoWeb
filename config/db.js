const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://"+ process.env.DB_USER_PASS +"@cluster0.uupaj.mongodb.net/test",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false

    }
)
    .then(() => console.log("connected to Mongodb!"))
    .catch((err) => console.log("Failed to connect tp MongoDB", err))