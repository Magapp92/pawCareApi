
const { Reserva, Cuidador, Perfil } = require('../models')


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

const postReserva = async (req, res, next) => {
    try{
        const { body } = req

        const nuevaReserva = new Reserva(body)

        await nuevaReserva.save()

        const perfil = await Perfil.findById(body.usuario.perfilId)
        perfil.reservas = [...perfil.reservas, {...body}]

        await perfil.save()

        const cuidador = await Cuidador.findById(body.cuidador.cuidadorId)
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

        await Reserva.findByIdAndUpdate( _id, body )
        
        const data = await Reserva.find()

         res.status(200).json({
            message: `Reserva actualizada correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}

const deleteReserva = async (req, res, next) => {
    try{
        const { _id } = req.params

        const reserva = await Reserva.findByIdAndDelete( _id )

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