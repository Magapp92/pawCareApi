
/* Controlador de reservas. Cada reserva se guarda en su colección y deja un resumen
en el perfil del usuario y en el cuidador; todas las respuestas siguen la forma { message, data } */
const { Reserva, Cuidador, Perfil } = require('../models')


/* Reservas de un usuario filtrando por el id, usuario.perfilId */
const getReservasByPerfil = async (req, res, next) => {
    try {
        /* Recogemos el id del usuario de la URL y buscamos sus reservas */
        const { _id } = req.params 
        const data = await Reserva.find({ 'usuario.perfilId': _id })

        res.status(200).json({
            message: `Mostrando las reservas del usuario ${_id}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

/* Una reserva concreta por su _id */
const getReservaById = async (req, res, next) => {
    try {
        const { _id } = req.params

        const data = await Reserva.findById(_id)
        /* 404 si el id no existe */
        if (!data) {
            return res.status(404).json({
                message: `No existe la reserva con id ${_id}`,
                data: null
            })
        }

        res.status(200).json({
            message: `Mostrando la reserva ${_id}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

/* Reservas que le han hecho a un cuidador: pendientes, confirmadas y con mensaje las separa el front */
const getReservaByCuidador = async (req, res, next) => {
    try{
      const { _id } = req.params

      /* Buscamos las reservas cuyo cuidador es el de la URL */
      const data = await Reserva.find({'cuidador.cuidadorId': _id })

      res.status(200).json({
            message: `Mostrando las reservas del cuidador ${_id}`,
            data
        })
    } catch (error) {
      next(error)
    }
}

/* Crea la reserva y además guarda un resumen en el perfil del usuario
y en el array reservado del cuidador para que ambos la vean */
const postReserva = async (req, res, next) => {
    try{
        const { body } = req

        /* Validamos que el perfil y el cuidador existan antes de crear nada */
        const perfil = await Perfil.findById(body.usuario?.perfilId)
        const cuidador = await Cuidador.findById(body.cuidador?.cuidadorId)

        if (!perfil || !cuidador) {
            return res.status(404).json({
                message: `El perfil o el cuidador de la reserva no existen`,
                data: null
            })
        }

        /* Creamos la reserva con los datos del formulario */
        const nuevaReserva = new Reserva(body)

        await nuevaReserva.save()

        /* Copiamos un resumen en el perfil del usuario */
        perfil.reservas = [...perfil.reservas, {...body}]

        await perfil.save()

        /* Y las fechas en el array reservado del cuidador */
        cuidador.reservado = [...cuidador.reservado, {...body}]
          
        await cuidador.save()

        /* Devolvemos todas las reservas actualizadas */
        const data = await Reserva.find()
        
          res.status(201).json({
            message: `Reserva creada correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}

/* Cambia el estado, las fechas, el comentario o el mensaje; el enum del schema
solo admite Pendiente o Confirmada como estado */
const patchReserva = async (req, res, next) => {
    try{
        const { _id } = req.params

        const { body } = req

        const actualizada = await Reserva.findByIdAndUpdate( _id, body, { new: true, runValidators: true } )
      /* 404 si el id no existe */
        if (!actualizada) {
            return res.status(404).json({
                message: `No existe la reserva con id ${_id}`,
                data: null
            })
        }

        const data = await Reserva.find()

         res.status(200).json({
            message: `Reserva actualizada correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}

/* Borra la reserva y también su copia en el array reservado del cuidador */
const deleteReserva = async (req, res, next) => {
    try{
        const { _id } = req.params

        /* Borramos la reserva y nos quedamos con sus datos para limpiar la copia del cuidador */
        const reserva = await Reserva.findByIdAndDelete( _id )

        /* 404 si no existe (evita romper al leer reserva.cuidador) */
        if (!reserva) {
            return res.status(404).json({
                message: `No existe la reserva con id ${_id}`,
                data: null
            })
        }

        /* Quitamos también la copia que tenía el cuidador en reservado */
        const cuidador = await Cuidador.findById( reserva.cuidador.cuidadorId )
        cuidador.reservado = [... cuidador.reservado.filter( reserva => `${reserva.bookingId}` !== `${ _id }` ) ]
        await cuidador.save()
        
        const data = await Reserva.find()

         res.status(200).json({
            message: `Reserva cancelada correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}


/* Exportamos los controllers para el router */
module.exports = {
getReservasByPerfil,
getReservaById,
getReservaByCuidador, 
postReserva,
patchReserva,
deleteReserva
}