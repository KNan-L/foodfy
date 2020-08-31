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

async function show(req, res, next){
    const { userId: id } = req.session
    const user = await User.findOne({ where: {id}})

    if(!user) return res.render("admin/users/edit", {
        error: "Usuário não encontrado"
    })

    req.user = user

    next()
}

async function post(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("admin/users/create", fillAllFields)
    }

    let { email, password } = req.body

    const user = await User.findOne({
        where: { email }
    
    })

    if (user) return res.render('admin/users/create', {
        user: req.body,
        error: 'Usuário já cadastrado'
    })

    req.user = user

    next()
}

async function put(req, res, next){
    const id = req.session.userId
    
    //Check if has all fieds
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("admin/users/create", fillAllFields)
    }

    try{
        const user = await User.findOne({ where: { id } })

        const passed = user.is_admin

        if(!passed) return res.render("admin/users/index", {
            error: "Você não é administrador"
        })    

        req.user = user
        next()

    }catch(err){
        console.error(err)
    }
}

module.exports = {
    show,
    post,
    put
}