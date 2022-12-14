let models = require("./user.model.js")

async function getTest(test) {
    let filter = {};
    if(test){
        filter.test = test
    }
    return await models.User.find(filter)
}

module.exports.getTest = getTest;
