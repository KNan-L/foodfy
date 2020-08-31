const User = require("../models/user")
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/index")
    },

    login(req, res){
        req.session.userId = req.user.id

        return res.redirect("/admin")

    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },

    forgotForm(req, res) {
        return res.render("admin/session/forgot-password")
    },

    async forgot(req, res) {
        
        const user = req.user 
                
        try{           
            
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.updatePassword(user.id, {
                reset_token: token,
                reset_token_expires: now,
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Recuperação de Senha',
                html: `
                    <h2>Esqueceu a Senha?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperar sua senha.</p>
                    <p>
                    <a href="http://localhost:3000/admin/password-reset?token=${token}" target="blank">
                        RECUPERAR SENHA
                    </a>
                    </p>
                `,
            })

            return res.render("admin/session/forgot-password",{
                success: "Verifique seu email para resetar sua senha."
            })
        }catch(err){
            console.error(err)
            return res.render("addmin/session/forgot-password", {
                error: "Erro inesperado, tente novamente."
            })
        }
    },

    resetForm(req, res) {
        return res.render("admin/session/password-reset", { token: req.query.token })
    },

    async reset(req, res){
            const user = req.user     
            const { password, token } = req.body           

        try{

            const newPassword = await hash(password, 8)

            await User.updatePassword(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })            
            
            return res.render("admin/session/index", {
                user: req.body,
                success: "Senha atualizada com sucesso! Faça seu Login."
            })

        }catch(err){
            console.error(err)
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente."
            })
        }       
        
    }
}