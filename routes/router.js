
const express = require('express')
const { notFound, errorHandler } = require('../middlewares')
const { postLogin } = require('../controllers/login')
const { getCuidadores, getCuidadoresById, getCuidadoresByUbicacion, getCuidadoresByServicio,
     getCuidadoresByAnimal, putCuidador } = require('../controllers/cuidadores')
const { getReservaById, postReserva, patchReserva, deleteReserva, getReservasByPerfil,
    getReservaByCuidador } = require('../controllers/reservas')
const { getPerfilById, postMascota, patchPerfil, patchMascota,
    deleteMascota } = require('../controllers/perfiles')
const router = express.Router()

/* Rutas agrupadas por recurso con .route() para encadenar los verbos de cada endpoint */
router.route('/login')
.post( postLogin )

router.route('/cuidadores')
.get( getCuidadores )

router.route('/cuidadores/:_id')
.get( getCuidadoresById )
.put( putCuidador )

router.route('/cuidadores/servicios/:servicio')
.get( getCuidadoresByServicio )

router.route('/cuidadores/ubicacion/:ubicacion')
.get( getCuidadoresByUbicacion )

router.route('/cuidadores/animalesQueAtiende/:animal')
.get( getCuidadoresByAnimal )

router.route('/reservas')
.post( postReserva )

router.route('/reservas/:_id')
.get( getReservaById )
.patch( patchReserva )
.delete( deleteReserva)

router.route('/reservas/usuario/:_id')
.get( getReservasByPerfil )

router.route('/reservas/cuidador/:_id')
.get( getReservaByCuidador )

router.route('/perfiles/:_id')
.get( getPerfilById )
.patch( patchPerfil )

router.route('/perfiles/:_id/mascotas')
.post( postMascota )

router.route('/perfiles/:_id/mascotas/:mascotaId')
.patch( patchMascota )
.delete( deleteMascota )

/* Los middlewares de error van al final: notFound atrapa rutas no definidas
y errorHandler responde a los next(error) de los controllers */
router.use( notFound )
router.use( errorHandler )

module.exports = {
    router
}