const express = require('express')
const routes = express.Router()
const multer = require("../app/middlewares/multer")

const recipes = require("../app/controllers/recipes")
const chefs = require("../app/controllers/chefs")

const UserController = require("../app/controllers/user")
const ProfileController = require("../app/controllers/profile")
const SessionController = require("../app/controllers/session")

const UserValidator = require("../app/validators/user")
const ProfileValidator = require("../app/validators/profile")
const SessionValidator = require("../app/validators/session")



const { onlyUsers, onlyAdmin, CreatorRecipeOrAdmin} = require('../app/middlewares/session')




/*ROUTES ADMIN RECIPES */
routes.get("/", onlyUsers, recipes.admin )
routes.get("/recipes", onlyUsers, recipes.index)
routes.get("/recipes/create", onlyUsers, recipes.create)
routes.get("/recipes/:id", onlyUsers, recipes.show)
routes.get("/recipes/:id/edit", CreatorRecipeOrAdmin, recipes.edit)
routes.post("/recipes", multer.array("photos", 6), recipes.post)
routes.put("/recipes", multer.array("photos", 6) ,recipes.put)
routes.delete("/recipes", recipes.delete)

/*ROUTES ADMIN CHEFS */
routes.get("/chefs", chefs.index )
routes.get("/chefs/create", onlyAdmin, chefs.create)
routes.get("/chefs/:id", chefs.show)
routes.get("/chefs/:id/edit", onlyAdmin, chefs.edit)
routes.post("/chefs", onlyAdmin, multer.array("photos", 1), chefs.post)
routes.put("/chefs", onlyAdmin, multer.array("photos", 1), chefs.put)
routes.delete("/chefs", onlyAdmin, chefs.delete)

// /* ROUTES USERS*/

//login / logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// // reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)


// //Perfil de Usuário

routes.get('/profile', onlyUsers, ProfileController.index) //Mostrar o formulario com os dados do usuario logado
routes.put('/profile', onlyUsers, ProfileValidator.put, ProfileController.put) //Editar o usuario logado
routes.get('/users/recipes', UserController.recipesUser) //Mostrar das recitas cadastrada pelo usúario

// //Rotas que o administrador ira acessar para gerenciar usuarios

routes.get('/users', onlyAdmin, UserController.list) //Mostrar a lista de usuario cadastrados
routes.get('/users/create', onlyAdmin, UserController.create) //cadastrar um usuario
routes.post('/users', onlyAdmin, UserValidator.post, UserController.post)
routes.get('/users/edit/:id',onlyAdmin, UserController.edit) // Editar um usuário
routes.put('/users', onlyAdmin, UserValidator.put, UserController.put) 
routes.delete('/users', UserController.delete) //deletar um usuario



//routes.get("/card", (req, res) => res.render('parts/card.njk'))



module.exports = routes