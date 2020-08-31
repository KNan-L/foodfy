const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'recipes'})

module.exports = {
    ...Base, 

    Allchefs(){
        return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON chefs.id = recipes.chef_id
            GROUP BY chefs.id
            ORDER BY chefs.id ASC`)
    },

    Allrecipes(){
        return db.query(`
            SELECT recipes.*, name
            FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            ORDER BY created_at DESC
        `)
    },

    search(filter){
        return db.query(`
            SELECT recipes.*, name
            FROM recipes
            LEFT JOIN chefs ON chefs.id = recipes.chef_id
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            ORDER BY updated_at DESC
            `)        
    },

    paginate(params) {
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
        db.query(query, [limit, offset], function(err, results){
            if (err) throw `Database Error: ${err}`

            callback(results.rows)
        })
    },

    files(id) {
        return db.query(`   
            SELECT files.* FROM files
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
            LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id)
            WHERE recipe_files.file_id = files.id
            AND recipe_files.recipe_id = $1`,[id])
    }
}

