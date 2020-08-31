const User = require('../models/public')
const Chefs = require('../models/chef')
const Recipes = require("../models/recipesModel")
const LoadRecipeServices = require("../services/LoadRecipeService")

module.exports = {
    async index(req, res){
        try {
            const index = {
                img: "/assets/chef.png",
                title: "As Melhores receitas",
                text: "Aprenda a construir os melhores pratos com receitas criadas por profissionais do mundo inteiro.",
            }


            const allRecipes = await LoadRecipeServices.load('recipes')
            const recipes = allRecipes
            .filter((recipe, index) => index >5 ? false : true )            
            if( recipes.length == 0 ){ return res.render("public/index", { index })}

            return res.render("public/index", { index, recipes }) 

        } catch (err) {
            console.error(err)
        }
    },

    async chefs(req, res){
        let results = await User.Allchefs()
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


        return res.render ("public/chefs", { chefs: newChefs })
        
    },

    async receitas(req, res){
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

            return res.render("public/receitas", { recipes: newRecipes, pagination })    


        } catch (err) {
            console.error(err)        
        }
    },

    async show( req, res){
        const recipes = await User.find(req.params.id)

        if(!recipes) return res.send("Receita não encontrada")

        results = await Recipes.files(recipes.id)
        
        const files = results.rows.map( file => ({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))        

        
    
        return res.render("public/recipes", { recipes, files })        
    },
    
    sobre(req, res){
        return res.render("public/sobre")
    },

    async search(req, res){
        const { filter } = req.query

        let results = await User.search(filter)
        let recipes = results.rows

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
        
        return res.render("public/search", { filter, recipes })      
    },

    
}