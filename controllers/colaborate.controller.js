const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const { uploadErrors } = require('../utils/errors.utils');
const { modelName } = require('../models/user.model');
const pipeline = promisify(require('stream').pipeline);


module.exports.colaborate = async (req, res) => {
    const diagramId = req.body.diagramId;
    const emailSender = req.body.sender;
    const emailReceiver = req.body.receiver;
    const data = {colaborater: emailSender, diagramId: diagramId};
    await UserModel.findOneAndUpdate(
        {email: emailReceiver},
        {  $addToSet: { colaboraters: data} },
        { new: true, upsert: true },
        (err, docs) => {
            if (!err) res.status(201).json(docs);
            else return res.status(400).json(err);
        }
    );
    
};