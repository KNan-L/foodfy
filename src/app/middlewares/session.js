const User = require('../../app/models/user')
const Recipes = require('../../app/models/recipesModel')

function onlyUsers(req, res, next ){
    if(!req.session.userId)
        return res.redirect('/admin/login')
    next()
}

async function onlyAdmin(req, res, next) {
    try {
        const userId = req.session.userId
        const user = await User.find(userId)
        if (!req.session.userId || !user.is_admin){    
            req.session.error = 'Você não pode acessar essa página.'
            return res.redirect('/admin')
        }
        next()
    } catch (err) {
        console.error();
    }
}

async function CreatorRecipeOrAdmin(req, res, next){
    const userId = req.session.userId
    const recipeId = req.params.id
    
    try{
        let results = await Recipes.find(recipeId)
        let UserIdRecipe = results.user_id
        
        const user = await User.find(userId)

        if (!user.is_admin){
            if ( UserIdRecipe !== userId){
                req.session.error = 'Você não pode acessar essa página.'
                return res.redirect('/admin')
            }      
        }
        
        next()
    }catch(err){
        console.error(err)
    }
}

module.exports = {
    onlyUsers,
    onlyAdmin,
    CreatorRecipeOrAdmin
}