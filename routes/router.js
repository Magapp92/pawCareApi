
/* Importamos los controllers de cada recurso y los middlewares de error y de token */
const express = require('express')
const { notFound, errorHandler, verificarToken } = require('../middlewares')
const { postLogin } = require('../controllers/login')
const { getCuidadores, getCuidadoresById, getCuidadoresByUbicacion, getCuidadoresByServicio,
     getCuidadoresByAnimal, putCuidador } = require('../controllers/cuidadores')
const { getReservaById, postReserva, patchReserva, deleteReserva, getReservasByPerfil,
    getReservaByCuidador } = require('../controllers/reservas')
const { getPerfilById, postMascota, patchPerfil, patchMascota,
    deleteMascota } = require('../controllers/perfiles')
/* Creamos el router que index.js monta en /pawcare */
const router = express.Router()

/* Rutas agrupadas por recurso con .route() para encadenar los verbos de cada endpoint */
/* Autenticación: el único POST público, devuelve el token que exigen las escrituras */
router.route('/login')
.post( postLogin )

/* Cuidadores: lectura pública para el buscador; solo el PUT del panel exige token */
router.route('/cuidadores')
.get( getCuidadores )

router.route('/cuidadores/:_id')
.get( getCuidadoresById )
.put( verificarToken, putCuidador )

/* Filtros del buscador: por servicio, por ubicación y por animal */
router.route('/cuidadores/servicios/:servicio')
.get( getCuidadoresByServicio )

router.route('/cuidadores/ubicacion/:ubicacion')
.get( getCuidadoresByUbicacion )

router.route('/cuidadores/animalesQueAtiende/:animal')
.get( getCuidadoresByAnimal )

/* Reservas: crear, cambiar estado o borrar exige token; las lecturas son públicas */
router.route('/reservas')
.post( verificarToken, postReserva )

router.route('/reservas/:_id')
.get( getReservaById )
.patch( verificarToken, patchReserva )
.delete( verificarToken, deleteReserva )

/* Reservas de un usuario y de un cuidador, para Mis reservas y el panel */
router.route('/reservas/usuario/:_id')
.get( getReservasByPerfil )

router.route('/reservas/cuidador/:_id')
.get( getReservaByCuidador )

/* Perfiles y sus mascotas: cualquier cambio exige token */
router.route('/perfiles/:_id')
.get( getPerfilById )
.patch( verificarToken, patchPerfil )

/* Las mascotas se añaden, editan o borran dentro del perfil */
router.route('/perfiles/:_id/mascotas')
.post( verificarToken, postMascota )

router.route('/perfiles/:_id/mascotas/:mascotaId')
.patch( verificarToken, patchMascota )
.delete( verificarToken, deleteMascota )

/* Los middlewares de error van al final: notFound atrapa rutas no definidas
y errorHandler responde a los next(error) de los controllers */
router.use( notFound )
router.use( errorHandler )

/* Exportamos el router para index.js */
module.exports = {
    router
}