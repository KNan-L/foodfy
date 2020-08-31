const faker = require('faker')
const { hash } = require('bcryptjs')
const { date } = require('./src/lib/utils')
const User = require('./src/app/models/user')
const File = require('./src/app/models/fileModel')
const Chef = require('./src/app/models/chef')
const Recipe = require('./src/app/models/recipesModel')
const RecipeFiles = require('./src/app/models/recipes_file')


let userIds = []
let chefsIds = []
let totalChefs = 6
let files = []


async function createUsers() {
    const users = []
    const password = await hash('1111', 8)

    while (users.length < 3 ){
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            is_admin: true,
            password
        })
    }

    const usersPromise = users.map(user => User.create(user))
    userIds = await Promise.all(usersPromise)
}

async function createChefs() {
    const chefs = []
    const files = []
    const chefsVetor = ['Jorge Relato', 'Fabiana Melo', 'Vania Steroski', 'Juliano Vieira', 'Júlia Kinoto', 'Ricardo Golvea']
    const filesVetor = ['avatar1.jpeg', 'avatar2.jpeg', 'avatar3.jpeg', 'avatar4.jpeg', 'avatar5.jpeg', 'avatar6.jpeg']

    for (let file = 0; file < filesVetor.length; file ++ ){
        files.push({
            name: filesVetor[file],
            path: `public/assets/${filesVetor[file]}`
        })
    }    

    const filesPromise = files.map(file => File.create(file))
    await Promise.all(filesPromise)

    for (let chef = 0; chef < chefsVetor.length; chef ++ ){
        chefs.push({
            name: chefsVetor[chef],
            created_at: date(Date.now()).iso,
            file_id: chef + 1,
        })        
    }    

    const chefsPromise = chefs.map(chef => Chef.create(chef))
    chefsIds = await Promise.all(chefsPromise)    
}

async function createRecipes() {
    let recipes = []
    let recipes_files = []
    const filesVetor = ['burger.png', 'asinhas.png', 'doce.png']

    for (let file = 0; file < filesVetor.length; file ++ ){
        files.push({
            name: filesVetor[file],
            path: `public/assets/${filesVetor[file]}`
        })
    } 

    const filesPromise = files.map(file => File.create(file))
    await Promise.all(filesPromise)
    
    while ( recipes.length < 3 ){
        recipes.push({
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 1)),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 1)),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            created_at: date(Date.now()).iso,
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            user_id: 1,
        })
    }


    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)   
   

    while (recipes_files.length < 3){
        for (let rf = 0; rf < 3; rf ++){
            recipes_files.push({
                //recipe_id: recipesIds[Math.floor(Math.random() * filesVetor.length)],
                recipe_id: rf + 1,
                file_id: Math.floor(Math.random() * 3) + 7
            })        
        }
        
    }
    
    const recipefilesPromise = recipes_files.map(recipefiles => RecipeFiles.create(recipefiles))
    await Promise.all(recipefilesPromise)
}

async function init(){
   await createUsers()
   await createChefs()
   await createRecipes()
}

init()

