const { date } = require('../../lib/utils')
const Recipes = require("../models/recipesModel")
const File = require("../models/fileModel")
const RecipesFiles = require("../models/recipes_file")

module.exports = {
    admin(req, res){
        res.render("admin/admin.njk",{error: req.session.error, success:req.session.success})
        delete req.session.error    
        delete req.session.success    
    },

    async index(req, res) {
        try {
            let { filter,  page, limit } = req.query

            page = page || 1
            limit = limit || 8
            let offset = limit * (page - 1)

            const params = { filter, page, limit, offset }

            const allRecipes = await Recipes.paginate(params)  
            if( allRecipes.length == 0 ){ return res.render("admin/recipes/index") }

            const filesPromise = allRecipes.map(async recipe => {

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

            const recipes = allRecipes

            const pagination = {
                total: Math.ceil(recipes[0].total / limit ),
                page,
                filter
            }

            return res.render("admin/recipes/index", { items: newRecipes, pagination })    


        } catch (err) {
            console.error(err)        
        }
    },

    async create(req, res) {
        let results = await Recipes.chefSelectedOption()
        const chefs = results.rows

            
        return res.render("admin/recipes/create", { chefOptions: chefs})        
    },

    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
        
            for (key of keys) {
                if (req.body[key] == ""){
                    return res.send("Preencha todos os campos")
                }
            }

            if ( req.files.length == 0 ){
                return res.send("Por Favor envie pelo menos uma imagem")
            }

            let { title, ingredients, preparation, information, chef } = req.body
            
            const userId = req.session.userId
            const recipesId = await Recipes.create({
                title,
                ingredients,
                preparation,
                information,
                created_at: date(Date.now()).iso,
                chef_id: chef,
                user_id: userId
            })

            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: file.path
            }))

            const files = await Promise.all(filesPromise) 
        
            const recipeFilesPromise = files.map(file => RecipesFiles.create({
                recipe_id: recipesId,
                file_id: file
            }))
            

            await Promise.all(recipeFilesPromise)
            
            req.session.success = "Receita criada com sucesso!";
            return res.redirect(`/admin/recipes/${recipesId}`)             
            

        }catch(err){
            console.error(err)
            return res.render("admin/recipes/index", {
                user: req.body,
                error: "Erro inesperado, tente novamente."
            })
        }
    },

    async show(req, res) {
        try {
            const recipes = await Recipes.find(req.params.id)
            
            if (!recipes) return res.send("Receita não encontrada")

            results = await Recipes.files(recipes.id)            
            
            const files = results.rows.map( file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))        

            recipes.created_at = date(recipes.created_at)

            return res.render("admin/recipes/show", { recipes, files, success: req.session.success}), delete req.session.success

        } catch (err) {
            console.error(err)            
        }
    },


    async edit(req, res) {     
        const recipes = await Recipes.find(req.params.id)
        
        if(!recipes) return res.send("Receita não encontrada")

        results = await Recipes.chefSelectedOption()
        const chefs = results.rows

        results = await Recipes.files(recipes.id)
        let files = results.rows 
        files = files.map(file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render("admin/recipes/edit", { recipes, chefOptions: chefs, files})

    },

    async put(req, res) {

        try {
            const keys = Object.keys(req.body)
            
            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files"){
                    return res.send("Preencha todos os campos")
                }
            }

            if(req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create({
                    name: file.filename,
                    path: file.path
                }))

                const newFiles = await Promise.all(newFilesPromise)
    
                const newRecipeFilesPromise = newFiles.map(file => RecipesFiles.create({
                    recipe_id: req.body.id,
                    file_id: file
                }))

                await Promise.all(newRecipeFilesPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")

                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromisse = removedFiles.map(id => File.delete(id))
                await Promise.all(removedFilesPromisse)            
            
            }    

            await Recipes.update(req.body.id, {
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information,
                chef_id: req.body.chef
            })
            
            req.session.success = "Receita atualizada com sucesso!";
            return res.redirect(`recipes/${req.body.id}`)
        } catch (err) {
            console.error(err)
        }
        

    },

    async delete(req, res) {
        try{
            await Recipes.delete(req.body.id)

            req.session.success = "Receita deletada com sucesso!"
            return res.redirect(`/admin`)
        }catch(err){
            console.error(err)

        }
    }
}
