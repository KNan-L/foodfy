const db = require('../../config/db')
const fs = require('fs')

const Base = require('./Base')

Base.init({table: 'recipes'})

module.exports = {
    ...Base,

    all() {        
       const query = `
            SELECT recipes.*, name
            FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            ORDER BY recipes.id
            `

        return db.query(query)        
    },

    
    async delete(id){
        try {
            const result = await db.query(`
            SELECT * FROM files 
            LEFT JOIN recipe_files ON recipe_files.file_id = files.id
            WHERE recipe_files.recipe_id = $1`, [id])

            const files = result.rows
            for ( let file =0 ; file < files.length; file++ ){
                let idF = files[file].file_id
                let path = files[file].path
                fs.unlinkSync(path)
                db.query(`DELETE FROM files WHERE id = $1`,[idF])
            }            

            return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
        }catch(err){
            console.error(err)            
        }        

    },

    chefSelectedOption() {
        return db.query(`SELECT name, id FROM chefs`)
    },

    async paginate(params) {
        const { limit, offset, callback } = params

        query = `
            SELECT recipes.*, name,
                (
                    SELECT count(*) AS total
                    FROM recipes                     
                )
            FROM recipes
            LEFT JOIN chefs ON chefs.id = recipes.chef_id
            ORDER BY recipes.id ASC
            LIMIT $1 OFFSET $2
        `

        const results = await db.query(query, [limit, offset])
        return results.rows
    },

    files(id) {
        return db.query(`   
            SELECT files.* FROM files
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            WHERE recipe_files.file_id = files.id
            AND recipe_files.recipe_id = $1`,[id])
    },

    recipefiles(id){
      return db.query(`
            SELECT files.* FROM files
            LEFT JOIN files ON files.id = recipe_files.file_id
            LEFT JOIN recipes ON recipes.id = recipe_files.recipe_id
            WHERE recipe_files.file_id = files.id
            AND recipe_files.recipe.id = $1
        `,[id])
    }
}