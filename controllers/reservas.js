
const { Reserva, Cuidador, Perfil } = require('../models')


/* Reservas de un usuario filtrando por el id, usuario.perfilId */
const getReservasByPerfil = async (req, res, next) => {
    try {
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

const getReservaByCuidador = async (req, res, next) => {
    try{
      const { _id } = req.params

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

        const nuevaReserva = new Reserva(body)

        await nuevaReserva.save()

        perfil.reservas = [...perfil.reservas, {...body}]

        await perfil.save()

        cuidador.reservado = [...cuidador.reservado, {...body}]
          
        await cuidador.save()

        const data = await Reserva.find()
        
          res.status(201).json({
            message: `Reserva creada correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}

const patchReserva = async (req, res, next) => {
    try{
        const { _id } = req.params

        const { body } = req

        const actualizada = await Reserva.findByIdAndUpdate( _id, body )
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

        const reserva = await Reserva.findByIdAndDelete( _id )

        /* 404 si no existe (evita romper al leer reserva.cuidador) */
        if (!reserva) {
            return res.status(404).json({
                message: `No existe la reserva con id ${_id}`,
                data: null
            })
        }

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


module.exports = {
getReservasByPerfil,
getReservaById,
getReservaByCuidador, 
postReserva,
patchReserva,
deleteReserva
}