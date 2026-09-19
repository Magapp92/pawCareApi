
const jwt = require('jsonwebtoken')

/* Middleware 404: se ejecuta cuando ninguna ruta del router coincide */
const notFound = ( req , res , next ) => {
    const error = new Error(`Endpoint no existe`)
            error.status = 404
    next(error)
}


/* Middleware centralizado de errores: recibe los next(error); sin status responde 500.
Los errores de validación de Mongoose y los ids mal formados son culpa de la petición: 400 */
const errorHandler = ( error , req , res , next )=>{
    let { status , message } = error

    if (error.name === 'ValidationError' || error.name === 'CastError') {
        status = 400
    }

        status  = status  || 500
        message = message || `Error interno`

    res.status(status).json({ message , data : null })
}

/* Control de acceso de las rutas de escritura: exige un token válido en la cabecera
Authorization (Bearer <token>) y deja en req.usuario el id y el rol que lleva dentro */
const verificarToken = ( req , res , next ) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Necesitas iniciar sesión', data: null })
    }

    try {
        req.usuario = jwt.verify( token, process.env.JWT_SECRET )
        next()
    } catch {
        res.status(401).json({ message: 'Sesión caducada o inválida, vuelve a entrar', data: null })
    }
}

module.exports = {
    notFound,
    errorHandler,
    verificarToken
}
