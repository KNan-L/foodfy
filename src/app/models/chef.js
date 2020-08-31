const { date } =require('../../lib/utils')
const db = require('../../config/db')

const Base = require('./Base')

Base.init({table: 'chefs'})


module.exports = {
    ...Base,

    all(){
        const query = `SELECT * FROM chefs
                       ORDER by id`

            return db.query(query)
    },

    findAll(id) {
        return db.query(`
            SELECT chefs.*, title, recipes.id as recipe_ID,
                (   
                    SELECT count(recipes) AS total_recipes 
                    FROM chefs 
                    LEFT JOIN recipes 
                    ON chefs.id = recipes.chef_id 
                    WHERE chefs.id = $1  
                    GROUP BY chefs.id 
                )
            FROM chefs
            LEFT JOIN recipes ON chefs.id = recipes.chef_id            
            WHERE chefs.id = $1`, [id]
        )
    },

    files(id) {
        return db.query(`   
        SELECT files.* FROM files
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        WHERE files.id = chefs.file_id
        AND chefs.id = $1`,[id])
    },

    recipechefs(id) {
        return db.query(`SELECT recipes.*,name
            FROM recipes
            LEFT JOIN chefs ON chefs.id = recipes.chef_id
            WHERE chefs.id = $1
            GROUP BY recipes.id,chefs.name
            ORDER by created_at DESC`,[id])

    }
}