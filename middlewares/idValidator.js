const mongoose = require("mongoose");

const validator = (ids = ['id']) => {
    return (req, res, next) => {
        for (const key of ids){
            const value = req.params[key];
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return res.status(400).json({message: 'Invalid id'});
            }
        }
        next();
    }
}
module.exports = validator;