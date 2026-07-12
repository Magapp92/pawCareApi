
const mongoose = require('mongoose')

const loginSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
      email: { type: mongoose.Schema.Types.String },
      password: { type: mongoose.Schema.Types.String },
      rol: { type: mongoose.Schema.Types.String }
    },
    { 
      collection: 'login',
       collation: {
            locale: 'es',
            strength: 2
        },
        versionKey: false
    }
)

const cuidadorSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
      nombre: { type: mongoose.Schema.Types.String },
      edad: { type: mongoose.Schema.Types.Number },
      avatarUrl: { type: mongoose.Schema.Types.String },
      ubicacion: { type: mongoose.Schema.Types.String },
      experienciaAnos: { type: mongoose.Schema.Types.Number },
      animalesQueAtiende: [{ type: mongoose.Schema.Types.String }],
      servicios: {
        cuidadoDiario: { type: mongoose.Schema.Types.Boolean },
        largaEstancia: { type: mongoose.Schema.Types.Boolean },
        paseador: { type: mongoose.Schema.Types.Boolean },
        peluqueria: { type: mongoose.Schema.Types.Boolean }
      },
      valoracion: { type: mongoose.Schema.Types.Number },
      preciosPorServicio: {
        cuidadoDiario: { type: mongoose.Schema.Types.Number },
        largaEstancia: { type: mongoose.Schema.Types.Number },
        paseador: { type: mongoose.Schema.Types.Number },
        peluqueria: { type: mongoose.Schema.Types.Number }
      },
      reservado:[
        {
            bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'booking' },
            fechaInicio: { type: mongoose.Schema.Types.String },
            fechaFin: { type: mongoose.Schema.Types.String }
        }
      ]
    },
    { 
      collection: 'cuidadores',
       collation: {
            locale: 'es',
            strength: 2
        },
        versionKey: false
    }
)

const perfilSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
      nombre: { type: mongoose.Schema.Types.String },
      telefono: { type: mongoose.Schema.Types.String },
      direccion: { type: mongoose.Schema.Types.String },
      avatarUrl: { type: mongoose.Schema.Types.String },
      miembroDesde: { type: mongoose.Schema.Types.String },
      mascotas: [
        {
        _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
        nombre: { type: mongoose.Schema.Types.String },
        especie: { type: mongoose.Schema.Types.String },
        raza: { type: mongoose.Schema.Types.String },
        edadMeses: { type: mongoose.Schema.Types.Number },
        vacunada: { type: mongoose.Schema.Types.Boolean },
        fotoUrl: { type: mongoose.Schema.Types.String }
        }
      ],
      reservas: [
        {
        bookingId: { type: mongoose.Schema.Types.ObjectId , ref: 'bookings' },
        fechaInicio: { type: mongoose.Schema.Types.String },
        fechaFin: { type: mongoose.Schema.Types.String },
        tipoServicio: { type: mongoose.Schema.Types.String },
        estado: { type: mongoose.Schema.Types.String },
        cuidadorNombre: { type: mongoose.Schema.Types.String },
        mascotaNombre: { type: mongoose.Schema.Types.String }
        }
      ]
    },
    { 
      collection: 'perfiles',
       collation: {
            locale: 'es',
            strength: 2
        },
        versionKey: false
    }
)

const reservaSchema = new mongoose.Schema (
    {
     _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
     fechaInicio: { type: mongoose.Schema.Types.String },
     fechaFin: { type: mongoose.Schema.Types.String },
     tipoServicio: { type: mongoose.Schema.Types.String },
     estado: { type: mongoose.Schema.Types.String },
     coste: { type: mongoose.Schema.Types.Number },
     comentario: { type: mongoose.Schema.Types.Number },
     mensaje: { type: mongoose.Schema.Types.String },
     respuesta: { type: mongoose.Schema.Types.String },
     cuidador: { 
        cuidadorId: { type: mongoose.Schema.Types.ObjectId, ref:'cuidadores' }, 
        nombre: { type: mongoose.Schema.Types.String },
        avatarUrl: { type: mongoose.Schema.Types.String }
    },
    mascota: {
       mascotaId: { type: mongoose.Schema.Types.ObjectId , ref:'perfiles' },
        nombre: { type: mongoose.Schema.Types.String },
        especie: { type: mongoose.Schema.Types.String },
        fotoUrl: { type: mongoose.Schema.Types.String },
      },
      usuario: {
        perfilId: { type: mongoose.Schema.Types.ObjectId , ref:'perfiles' },
        nombre: { type: mongoose.Schema.Types.String }
      }
    },
    {
      collection: 'reservas',
       collation: {
            locale: 'es',
            strength: 2
        },
        versionKey: false
    }
)

module.exports = {
    loginSchema,
    cuidadorSchema,
    perfilSchema,
    reservaSchema
}
