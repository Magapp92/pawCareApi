
const { Perfil } = require('../models')

/* Perfil del usuario con sus mascotas para Mi perfil y reservar */
const getPerfilById = async (req, res, next) => {
    try {
        const { _id } = req.params

        const data = await Perfil.findById(_id)
        /* 404 si el id no existe */
        if (!data) {
            return res.status(404).json({
                message: `No existe el perfil con id ${_id}`,
                data: null
            })
        }

        res.status(200).json({
            message: `Mostrando el perfil ${_id}`,
            data
        })
    } catch (error) {
        next(error)
    }
}

const patchPerfil = async (req, res, next) => {
    try{
        const { _id } = req.params

        const { body } = req

        const actualizado = await Perfil.findByIdAndUpdate( _id, body )
        /* 404 si el id no existe */
        if (!actualizado) {
            return res.status(404).json({
                message: `No existe el perfil con id ${_id}`,
                data: null
            })
        }

        const data = await Perfil.find()

         res.status(200).json({
            message: `Perfil actualizado correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}

const postMascota = async (req, res, next) => {
    try{
         const { _id } = req.params

        const { body } = req

        const perfil = await Perfil.findById( _id )

        if (!perfil) {
            return res.status(404).json({
                message: `No existe el perfil con id ${_id}`,
                data: null
            })
        }

        perfil.mascotas = [...perfil.mascotas, {...body}]

        await perfil.save()

        const data = await Perfil.find()

         res.status(201).json({
            message: `Mascota añadida correctamente`,
            data
        })
    } catch (error) {
        next(error)
    }
}

const deleteMascota = async (req, res, next) => {
    try{
        const { _id, mascotaId } = req.params

        const perfil = await Perfil.findById( _id )

        if (!perfil) {
            return res.status(404).json({
                message: `No existe el perfil con id ${_id}`,
                data: null
            })
        }

        perfil.mascotas = perfil.mascotas.filter( mascota => `${mascota._id}` !== mascotaId )

        await perfil.save()
        
        const data = await Perfil.find()

         res.status(200).json({
            message: `Mascota eliminada correctamente`,
            data
        })
    }catch (error) {
        next(error)
    }
}

/* Edita una mascota localizando el subdocumento por su _id */
const patchMascota = async (req, res, next) => {
    try{
        const { _id, mascotaId } = req.params

        const { body } = req

        const perfil = await Perfil.findById( _id )
        const mascota = perfil && perfil.mascotas.id( mascotaId )

        /* 404 tanto si no existe el perfil como si la mascota no está en su array */
        if (!mascota) {
            return res.status(404).json({
                message: `No existe el perfil ${_id} o la mascota ${mascotaId}`,
                data: null
            })
        }

        mascota.set( body )
        await perfil.save()

         res.status(200).json({
            message: `Mascota actualizada correctamente`,
            data: perfil
        })
    } catch (error) {
        next(error)
    }
}



module.exports= {
    getPerfilById,
    patchPerfil,
    postMascota, 
    deleteMascota,
    patchMascota
}