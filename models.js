
/* Creamos los modelos de Mongoose que usan los controllers */
const mongoose = require('mongoose')

const { loginSchema, cuidadorSchema, perfilSchema, reservaSchema } = require('./schemas')

const Login = mongoose.model(`Login`, loginSchema)

const Cuidador = mongoose.model(`Cuidador`, cuidadorSchema )

const Perfil = mongoose.model(`Perfil`, perfilSchema )

const Reserva = mongoose.model(`Reserva`, reservaSchema )

module.exports = {
    Login,
    Cuidador,
    Perfil,
    Reserva
}