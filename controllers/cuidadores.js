
const { Cuidador } = require('../models')

/* Lista completa de cuidadores para la página de inicio */
const getCuidadores = async (req, res, next) => {
    try {
        const data = await Cuidador.find()

        res.status(200).json({
            message: 'Buscando a todos los cuidadores',
            data: data
        })
    } catch (error) {
        next(error)
    }
}

const getCuidadoresById = async (req, res, next) => {
    try {
        const { _id } = req.params

        const data = await Cuidador.findById(_id)
        /* 404 si el id no existe */
        if (!data) {
            return res.status(404).json({
                message: `No existe el cuidador con id ${_id}`,
                data: null
            })
        }

        res.status(200).json({
            message: `Mostrando al cuidador con id ${_id}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

/* Filtra por servicio activo usando la clave dinámica del subdocumento servicios */
const getCuidadoresByServicio = async (req, res, next) => {
    try{
        const { servicio } = req.params

        const data = await Cuidador.find({ [`servicios.${servicio}`]: true })
       
        res.status(200).json({
            message: `Mostrando los cuidadores con el servicio ${servicio}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

/* $regex acepta coincidencias parciales sin distinguir mayusculas */
const getCuidadoresByUbicacion = async (req, res, next) => {
    try{
        const { ubicacion } = req.params

        const data = await Cuidador.find({ ubicacion: { $regex: ubicacion, $options: 'i' } })

        res.status(200).json({
            message: `Mostrando cuidadores en ${ubicacion}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

const getCuidadoresByAnimal = async (req, res, next) => {
    try{
        const { animal } = req.params

        const data = await Cuidador.find({ animalesQueAtiende: animal })

        res.status(200).json({
            message: `Mostrando cuidadores que atienden ${animal}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

/* Actualiza el perfil completo del cuidador desde su panel */
const putCuidador = async (req, res, next) => {
    try{
      const { _id } = req.params
      const { body } = req

      const actualizado = await Cuidador.findByIdAndUpdate(_id, body)
      /* 404 si el id no existe */
      if (!actualizado) {
          return res.status(404).json({
              message: `No existe el cuidador con id ${_id}`,
              data: null
          })
      }

      const data = await Cuidador.find()

      res.status(200).json({
            message: `Perfil de cuidador actualizado`,
            data
        })
    } catch (error) {
      next(error)
    }
}


module.exports = {
getCuidadores,
getCuidadoresById,
getCuidadoresByServicio,
getCuidadoresByUbicacion,
getCuidadoresByAnimal, 
putCuidador
}