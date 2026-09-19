
/* Creamos los modelos de Mongoose que usan los controllers. El nombre del modelo es el
primer parámetro; la colección real la fija cada schema con la opción collection */
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