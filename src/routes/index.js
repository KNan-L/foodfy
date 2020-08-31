const express = require('express')
const routes = express.Router()

const public = require("../app/controllers/public")

const admin = require('./admin')

/* ROUTES PUBLIC*/

//página com todas as receitas
routes.get("/", public.index)
routes.get("/receitas", public.receitas)
routes.get("/recipes/:id", public.show)
routes.get("/sobre", public.sobre)
routes.get("/chefs", public.chefs)
routes.get("/search", public.search)

routes.use("/admin", admin)

/*routes.get('/admin/session/index', function(req, res){
    return res.redirect("/users/login")
})*/

module.exports = routes