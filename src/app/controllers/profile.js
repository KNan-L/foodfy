const User = require('../models/user')
const Profile = require('../models/profileModel')

module.exports = {
    async index(req, res){
        try{
            const id = req.session.userId      
                               
            const user = await User.findOne({ where: { id } })   

            if(!user) return res.render("admin/users/index", {
                error: "Usúario não encontrado."
            })

            return res.render("admin/profile/index", {user})

        }catch(err){
            console.error(err)
        }
    },

    async put(req, res){
        try {

            const { user } = req

            let { name, email } = req.body
            
            await Profile.update(user.id, {
                name,
                email
            })

            return res.render("admin/profile/index", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })

        }catch(err){
            console.error(err)
            return res.render ("admin/profile/index", {
                error: "Algum erro aconteceu!"
            })
        }
    },

    logout(req, res){
        req.session.destroy()
        return res.redirect("/admin/users")
    }
}