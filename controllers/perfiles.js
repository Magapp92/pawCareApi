
const { Perfil } = require('../models')

const getPerfilById = async (req, res, next) => {
    try {
        const { _id } = req.params

        const data = await Perfil.findById(_id)

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

        await Perfil.findByIdAndUpdate( _id, body )
        
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

const patchMascota = async (req, res, next) => {
    try{
        const { _id, mascotaId } = req.params

        const { body } = req

        const perfil = await Perfil.findById( _id )
        perfil.mascotas.id( mascotaId ).set( body )
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