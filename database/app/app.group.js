let Group = require("../models/model.group").Group;
let jwt = require("jsonwebtoken")

CreateGroup = (request, response) => {

    let group = new Group({
        group_name: request.body.group_name,
        group_admin: jwt.decode(request.session.token).id,
        group_members: jwt.decode(request.session.token).id,
    })

    group.save((error, group) => {
        if(error){
            response.status(500).send({"message": error});
            return
        }
        response.status(200).send({"message": "Group was created!"})
        
    })

}

let group = {
    CreateGroup,
}

module.exports = group
