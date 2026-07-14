
console.clear()
console.log(`Iniciando pawcare api 🐾`)

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { router } = require('./routes/router')
const { notFound, errorHandler } = require('./middlewares')

require('dotenv').config()
const { PORT, MONGO_URI } = process.env

const conectar = async () => {
    mongoose.connect(MONGO_URI)
    .then(()=> console.log(`Conectado a Mongo ${MONGO_URI}🔗`))
    .catch(( err )=> console.log( err ))
}

const app = express()

app.use( cors() )
app.use( express.json() )
app.use( express.urlencoded({extended : false }) )
app.use( '/pawcare' , router )

/* Middlewares de error globales */
app.use( notFound )
app.use( errorHandler )

conectar()


app.listen( PORT , ()=> {
    console.log(`✅Iniciando API en localhost:${PORT}`)
})

module.exports = app