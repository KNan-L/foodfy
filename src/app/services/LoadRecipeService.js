const Recipes = require('../models/recipesModel')

async function getImages(recipeId){
    results = await Recipes.files(recipeId)
    let file = results.rows[0] 
    
    if(file){
        file = {
            ...file,
            src:`${file.path.replace("public", "")}`
        }                            
    }else{
        file = {
            ...file,
            src:`/assets/placeholder.png`
        }                        
    }  

    return file    
}

async function format(recipe){
    const files = await getImages(recipe.id)
    recipe.files = files
    recipe.img = files.src

    return recipe
}

const LoadService = {
    load(service, filter){
        this.filter = filter
        return this[service]()
    },

    async recipe(){
        try {
            const recipe = await Recipe.findOne(this.filter)

            return format(recipe)
        } catch (err) {
            console.error(err)            
        }
    },

    async recipes(){
        try {
            //const recipes = await Recipes.findAll(this.filter)
            let results = await Recipes.all()
            const recipes = results.rows

            const recipesPromise = recipes.map(format)

            return Promise.all(recipesPromise)
            
        } catch (err) {
            console.error(err)           
        }
    },

    format,
}

module.exports = LoadService