const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports.uploadModel = async (req, res) => {
    const fileName = req.body.name + "-" + req.body.userId + ".json";
    fs.writeFileSync(`${__dirname}/../client/public/uploads/models/${fileName}`, req.body.file, (err, data) => {
        if(err) {
            return console.log(err)
        }
        console.log(data)
    })

    try {

        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {
                $addToSet: { modelsUrl: "./uploads/models/" + fileName, modelsName: req.body.name +".json" }
            },
            {new :true},
            (err, docs) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                res.send(docs);
            }
        )

    } catch (err) {
        return res.status(500).send({ message: err })
    }
};