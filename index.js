
console.clear()
console.log(`Iniciando pawcare api 🐾`)

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { router } = require('./routes/router')
const { notFound, errorHandler } = require('./middlewares')

require('dotenv').config()
const { PORT, MONGO_URI } = process.env

/* En Vercel cada petición puede caer en una copia nueva del servidor, así que la conexión
se pide antes de entrar al router: si ya existe se reutiliza y si falló se vuelve a intentar.
Con 5 segundos de espera un Atlas dormido responde error rápido en vez de colgar la petición */
let conexion = null

const conectar = () => {
    if (!conexion) {
        conexion = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
            .catch(( error ) => {
                conexion = null
                throw error
            })
    }
    return conexion
}

const app = express()

app.use( cors() )
/* Helmet añade cabeceras de seguridad y morgan loguea cada petición por consola */
app.use( helmet() )
app.use( morgan('dev') )
/* Subimos el límite del body porque las fotos llegan en base64 y superan los 100kb por defecto */
app.use( express.json({ limit: '8mb' }) )
app.use( express.urlencoded({ extended: false, limit: '8mb' }) )

/* Sin base de datos no entramos al router: respondemos 503 con un mensaje claro */
app.use( async ( req, res, next ) => {
    try {
        await conectar()
        next()
    } catch (error) {
        console.log(`Sin conexión a Mongo: ${error.message}`)
        res.status(503).json
        ({ 
            message: 'Base de datos no disponible, inténtalo en unos segundos', 
            data: null 
        })
    }
})

app.use( '/pawcare' , router )

/* Middlewares de error globales */
app.use( notFound )
app.use( errorHandler )

conectar()
    .then(() => console.log(`Conectado a Mongo 🔗`))
    .catch(( error ) => console.log(`Sin conexión a Mongo: ${error.message}`))

app.listen( PORT, () => {
    console.log(`✅Iniciando API en localhost:${PORT}`)
})

module.exports = app
