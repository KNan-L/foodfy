const User = require("../models/user")
const Recipes = require("../models/recipesModel")
const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')


module.exports = {
    async list(req, res){
        let results = await User.all()
        const users = results.rows        

        return res.render("admin/users/index", { users, success: req.session.success, error: req.session.error}), delete req.session.success, delete req.session.error
    }, 

    create(req, res){
        return res.render('admin/users/create')
    },

    async post(req, res){
        try{
            const user = req.body
            const token = crypto.randomBytes(2).toString("hex")
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            /*await User.create(req.body, {
                password: token
            })*/
            let { name, email, is_admin} = req.body

            const passwordHash = await hash(token, 8)

            if(is_admin != "true" ){
                is_admin = "false"
            }

            await User.create({
                name,
                email,
                password: passwordHash,
                is_admin
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Bem vindo ao Foodfy',
                html: `<h2>Olá ${name}.</h2>
                <p>Obrigado por se cadastrar, sua senha é ${token}. </p>
                <p>
                    Bem vindo ao Foodfy.                  
                </p>
                `,
            })

            req.session.success = "Usúario criado com sucesso!";
            return res.redirect('/admin/users')
        }catch(err){
            console.error(err)
        }
    },

    async recipesUser(req, res) { 
        try {
            const userId = req.session.userId

            let results = await User.allRecipes(userId)
            let recipes = results.rows

            if( recipes.length == 0 ){
                return res.render('admin/users/recipesuser', {
                    error: "Você ainda não cadastrou nenhhum receita."
                })
            }

            const filesPromise = recipes.map(async recipe => {

                results = await Recipes.files(recipe.id)
                let file = results.rows[0] 

                if(file){
                    file = {
                        ...file,
                        src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
                    }                            
                }else{
                    file = {
                        ...file,
                        src:`${req.protocol}://${req.headers.host}/assets/placeholder.png`
                    }                        
                }  
                               
                return recipe = {
                    ...recipe,
                    file
                }            
            })

            const newRecipes = await Promise.all(filesPromise)  
            const userName = newRecipes[0].user_name            

            return res.render('admin/users/recipesuser', {items: newRecipes, userName })
        } catch (err) {
            console.error(err);   
            return res.render('admin/users/recipesuser', {
                error: "Algo inesperado aconteceu. Tente novamente."
            })                
        }   
    },

    async edit(req, res){        
        try{
            
            const user = await User.find(req.params.id)

            return res.render('admin/users/edit', { user })

        }catch(err){
            console.error(err)
            
        }        
    },

    async put(req, res) {
        try{            
            let { id, name, email, is_admin } = req.body

            if(is_admin !== "true" ){
                is_admin = "false"
            }

            await User.update(id, {
                name,
                email,
                is_admin
            })

            return res.render('admin/users/edit', {
                user:req.body,
                success: "Conta atualizada com sucesso!"    
            })

        }catch(err){
            console.error(err)
            return res.render('admin/users/edit', {
                error: "Algum erro aconteceu!"
            })
        }   
    },

    async delete(req, res) {
        try{
            if (req.session.userId == req.body.id) {
                req.session.error = "Você não pode deletar a sua própria conta."
                return res.redirect("/admin/users")
            }

            await User.delete(req.body.id)

            req.session.success = "Usúario deletado com sucesso!";
            return res.redirect("/admin/users")
            
        }catch(err){
            console.error(err)
            return res.render("admin/users/index", {
                error: "Erro ao tentar deletar a conta do usúario."
            })
        }
    }

}