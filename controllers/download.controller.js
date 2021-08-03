const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const { modelName } = require('../models/user.model');
const pipeline = promisify(require('stream').pipeline);


module.exports.downloadModel = async (req, res) => {
    const modelName = req.body.modelName;
    const modelUrl =  `${__dirname}/../client/public/uploads/models/${modelName}`


    try {
        var readStream = fs.createReadStream(modelUrl);
        var jsonModel ={};
        readStream.on('open', function () {
            // This just pipes the read stream to the response object (which goes to the client)
            readStream.pipe(res);
        });
        return res.sta
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};