const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const mehotodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)
server.use(express.urlencoded({extended: true}))
server.use(express.static('public'))
server.use(mehotodOverride('_method'))
server.use(routes)


/* Configuração Nunjucks */
server.set('view engine', 'njk')

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function(){
    console.log("Server is Running")
})