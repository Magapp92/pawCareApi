/* Schemas de las 4 colecciones. Los required y enum evitan guardar documentos incompletos
o con valores que el front no sabe pintar (rol, especie, tipo de servicio y estado de la reserva) */
const mongoose = require('mongoose')

/* Credenciales de acceso con el rol que decide a qué pantalla entra el front */
const loginSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
      email: { type: mongoose.Schema.Types.String, required: true },
      password: { type: mongoose.Schema.Types.String, required: true },
      rol: { type: mongoose.Schema.Types.String, required: true, enum: ['usuario', 'cuidador'] }
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

/* Cuidador con sus servicios activos, precios y fechas ya reservadas */
const cuidadorSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
      nombre: { type: mongoose.Schema.Types.String, required: true },
      edad: { type: mongoose.Schema.Types.Number, min: 0 },
      avatarUrl: { type: mongoose.Schema.Types.String },
      ubicacion: { type: mongoose.Schema.Types.String, required: true },
      experienciaAnos: { type: mongoose.Schema.Types.Number },
      miembroDesde: { type: mongoose.Schema.Types.String },
      animalesQueAtiende: [{ type: mongoose.Schema.Types.String }],
      servicios: {
        cuidadoDiario: { type: mongoose.Schema.Types.Boolean },
        largaEstancia: { type: mongoose.Schema.Types.Boolean },
        paseador: { type: mongoose.Schema.Types.Boolean },
        peluqueria: { type: mongoose.Schema.Types.Boolean }
      },
      valoracion: { type: mongoose.Schema.Types.Number },
      preciosPorServicio: {
        cuidadoDiario: { type: mongoose.Schema.Types.Number, min: 0 },
        largaEstancia: { type: mongoose.Schema.Types.Number, min: 0 },
        paseador: { type: mongoose.Schema.Types.Number, min: 0 },
        peluqueria: { type: mongoose.Schema.Types.Number, min: 0 }
      },
      /* Fechas que el cuidador ya tiene ocupadas, con el id de la reserva que las bloquea */
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

/* Perfil del usuario con sus mascotas y un resumen de sus reservas */
const perfilSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
      nombre: { type: mongoose.Schema.Types.String, required: true },
      telefono: { type: mongoose.Schema.Types.String },
      direccion: { type: mongoose.Schema.Types.String },
      avatarUrl: { type: mongoose.Schema.Types.String },
      miembroDesde: { type: mongoose.Schema.Types.String },
      mascotas: [
        {
        _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
        nombre: { type: mongoose.Schema.Types.String, required: true },
        especie: { type: mongoose.Schema.Types.String, required: true, enum: ['perro', 'gato', 'conejo', 'ave'] },
        raza: { type: mongoose.Schema.Types.String },
        edadMeses: { type: mongoose.Schema.Types.Number, min: 0 },
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

/* Reserva con datos del cuidador, mascota y usuario para volcar la información en las tarjetas */
const reservaSchema = new mongoose.Schema (
    {
     _id: { type: mongoose.Schema.Types.ObjectId , auto : true },
     fechaInicio: { type: mongoose.Schema.Types.String, required: true },
     fechaFin: { type: mongoose.Schema.Types.String, required: true },
     tipoServicio: { type: mongoose.Schema.Types.String, required: true, enum: ['cuidadoDiario', 'largaEstancia', 'paseador', 'peluqueria'] },
     estado: { type: mongoose.Schema.Types.String, required: true, enum: ['Pendiente', 'Confirmada'] },
     coste: { type: mongoose.Schema.Types.Number, required: true, min: 0 },
     comentario: { type: mongoose.Schema.Types.String },
     /* Conversación entre usuario y cuidador sobre la reserva. Cada uno borra solo de su lado:
     borradoPor, guarda quién la ha eliminado y el otro sigue viéndola */
     mensajes: [
        {
          autor: { type: mongoose.Schema.Types.String, required: true, enum: ['usuario', 'cuidador'] },
          texto: { type: mongoose.Schema.Types.String, required: true },
          fecha: { type: mongoose.Schema.Types.String, required: true },
          borradoPor: [{ type: mongoose.Schema.Types.String, enum: ['usuario', 'cuidador'] }]
        }
     ],
     /* Copias del cuidador, la mascota y el usuario para volcar en la tarjeta sin más consultas */
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
