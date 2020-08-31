const db = require('../../config/db')

const Base = require('./Base')

Base.init({table: 'users'})

module.exports = {
    ...Base, 
    
    all(){
        const query = `
            SELECT * FROM users
            ORDER by id
        `

        return db.query(query)
    },

    allRecipes(id) {      
        return db.query(`
            SELECT recipes.*, chefs.name, users.name as user_name
            FROM recipes
            LEFT JOIN chefs ON recipes.chef_id = chefs.id
            LEFT JOIN users ON recipes.user_id = users.id
            WHERE user_id = $1
            ORDER BY recipes.id`, [id]
        )         
    },
 
    async updatePassword(id, fields){

        try{
            let query = "UPDATE users SET"

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length){
                    query = `${query}
                        ${key} = '${fields[key]}',
                    `
                } else {    
                    //last interation
                    query = `${query}
                        ${key} = '${fields[key]}'
                        WHERE id = ${id}
                    `
                }
            })     

            await db.query(query)
            return          

        }catch(err){
            console.error(err)
        }
        
    }
}