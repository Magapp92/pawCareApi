
const { Login } = require ('../models')

/* Comprueba las credenciales buscando un documento que coincida
con el email, la contraseña y el rol elegido en el formulario */
const postLogin = async ( req, res, next ) => {
    try {

        const { email, password, rol } = req.body

        const data = await Login.findOne({ email, password, rol })
        /* 401 si las credenciales no coinciden */
        if (!data) {
            return res.status(401).json({
                message: 'Credenciales incorrectas',
                data: null
            })
        }

        res.status(200).json({
            message: 'Login correcto',
            data
        })
    } catch (error) {
      next(error)
    }
}

module.exports = {
    postLogin
}