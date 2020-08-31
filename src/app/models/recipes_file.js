const db = require('../../config/db')

const Base = require('./Base')

//Base.init({table: 'recipe_files'})

module.exports = {
  //  ...Base, 

    select({filename}){
        const query=(`
            SELECT file_id FROM recipe_files
            LEFT JOIN files ON files.id = recipe_files.file_id  
            WHERE files.name = $1`,[filename])

        return db.query(query)
    },

    create({recipe_id, file_id}) {

        const query = `
            INSERT INTO recipe_files(
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            
            RETURNING id
        `

        const values = [
            recipe_id,
            file_id,
        ]

        return db.query(query, values)
    },

   /* update(data){

        const query = `
            UPDATE recipe_files SET 
                recipe_id = ($1), 
                file_id = ($2)
            WHERE id = $3
        `
        const values = [
            data.recipe_id,
            data.file_id,
            data.id
        ]

        return db.query(query, values)
    },*/

   /* delete(id) {
        return db.query(`SELECT * FROM recipe_files WHERE files_id = $id`,[id])
    }*/
}