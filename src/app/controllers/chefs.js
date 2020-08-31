const { date } = require('../../lib/utils')
const Chefs = require('../models/chef')
const File = require("../models/fileModel")
const Recipes = require("../models/recipesModel")

module.exports = {
    chefs(req, res){
        return res.redirecet ("admin/chefs")
    },

    async index(req, res){

        let results = await Chefs.all()
        const chefs = results.rows        

        const filesPromise = chefs.map(async chef => {

            results = await Chefs.files(chef.id)
            let file = results.rows[0] 
            
            file = {
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }
            
            return chef = {
                ...chef,
                file
            }            
        })

            const newChefs = await Promise.all(filesPromise) 

            return res.render ("admin/chefs/index", { chefs: newChefs, success: req.session.success}), delete req.session.success
                
    },

    create(req, res) {
        return res.render("admin/chefs/create")
    },

    async post(req, res){

        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == ""){
                    return res.send("Preencha todos os campos")
                }
            }

            let { name } = req.body

            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: file.path
            }))
            const files = await Promise.all(filesPromise)

            const chefsPromisse = files.map(file => Chefs.create({
                name,
                created_at: date(Date.now()).iso,
                file_id: file,
            }))
            const chefId = await Promise.all(chefsPromisse)

            req.session.success = "Chef criado com sucesso!";
            return res.redirect(`chefs/${chefId}`)    
            
        } catch (err) {
            console.error(err)
        }
              
    },

    async show(req, res) {
        // Encontra os dados do chef e todas a receitas ligadas a ele,
        let results = await Chefs.findAll(req.params.id)
        const dados = results.rows

        if(!dados) return res.send("Chefe não encontrado")

        results = await Chefs.files(dados[0].id)
        
        const files = results.rows.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))
   
        const chef = {
            id: dados[0].id,
            name: dados[0].name,
            total_recipes: dados[0].total_recipes,
            created_at: dados[0].created_at
        }

        const resultsRecipes = await Chefs.recipechefs(req.params.id)
        let recipes = resultsRecipes.rows

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

        recipes = await Promise.all(filesPromise)

        if(dados[0].title == null){            
            return res.render("admin/chefs/show", { chef, files, success: req.session.success}), delete req.session.success    
        }else{
            return res.render("admin/chefs/show", { chef, dados:recipes, files, success: req.session.success}), delete req.session.success
        }
    }, 

    async edit(req, res) {
        try {
            const chef = await Chefs.find(req.params.id)
            
            if(!chef) return res.send("Chefe não encontrado")

            results = await Chefs.files(chef.id)
            let files = results.rows 
            files = files.map(file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))

            return res.render("admin/chefs/edit", { chef, files })
        } catch (err) {
            console.error(err)
        }
    },

    async put(req, res){
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files"){
                    return res.send("Preencha todos os campos")
                }
            }

            let { name } = req.body

            if(req.files.length != 0) {            
                const newFilesPromise = req.files.map(file => File.create({
                    name: file.filename,
                    path: file.path
                }))

                const newFiles = await Promise.all(newFilesPromise)  
                const newChefsPromise = newFiles.map(file => Chefs.update(req.body.id, {
                    name,
                    file_id: file,
                }))

                await Promise.all(newChefsPromise)                
            }

            if (req.body.removed_files) {
                const removedFiles =req.body.removed_files.split(",")

                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromise)
            }

            await Chefs.update(req.body.id, {
                name                
            })

            req.session.success = "Chef atualizado com sucesso!";
            return res.redirect(`chefs/${req.body.id}`)
        } catch (err) {
            console.error(err)
        }       
    },

    async delete(req, res){
        await Chefs.delete(req.body.id)
        
        req.session.success = "Chef deletado com sucesso!";
        return res.redirect("/admin/chefs")
    }
}