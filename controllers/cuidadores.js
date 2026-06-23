
const { Cuidador } = require('../models')


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

        res.status(200).json({
            message: `Mostrando al cuidador con id ${_id}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

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

const getCuidadoresByUbicacion = async (req, res, next) => {
    try{
        const { ubicacion } = req.params

        const data = await Cuidador.find({ ubicacion })

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

const putCuidador = async (req, res, next) => {
    try{
      const { _id } = req.params
      const { body } = req

      await Cuidador.findByIdAndUpdate(_id, body)

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