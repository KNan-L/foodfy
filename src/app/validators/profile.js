const User = require('../models/user')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys){
        if(body[key] == "") {
            return {
                user:body,
                error: "Por Favor, preencha todos os campos."
            }
        }
    }
}

async function put(req, res, next){
    //Check if has all fieds
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("admin/profile/index", fillAllFields)
    }

    //has password
    const { id, password } = req.body

    if(!password) return res.render("admin/profile/index", {
        user: req.body,
        error: "Coloque sua senha para atualizar o cadastro"
    })

    //Password match
    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if(!passed) return res.render("admin/profile/index", {
        user: req.body,
        error: "Senha Incorreta"
    })
    
    req.user = user
    next()
}

module.exports = {
    put
}