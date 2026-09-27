
/* jsonwebtoken firma el token de sesión; Login es el modelo con las credenciales */
const jwt = require('jsonwebtoken')
const { Login } = require ('../models')

/* Comprueba las credenciales buscando un documento que coincida
con el email, la contraseña y el rol elegido en el formulario */
const postLogin = async ( req, res, next ) => {
    try {

        /* Recogemos lo que envía el formulario de login */
        const { email, password, rol } = req.body

        const data = await Login.findOne({ email, password, rol })
        /* 401 si las credenciales no coinciden */
        if (!data) {
            return res.status(401).json({
                message: 'Credenciales incorrectas',
                data: null
            })
        }

        /* Token firmado con el id y el rol que caduca en 8 horas; la contraseña no se devuelve */
        const token = jwt.sign({ 
            _id: data._id, 
            rol: data.rol 
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: '8h' 

        })

        /* Devolvemos los datos de la sesión y el token, sin la contraseña */
        res.status(200).json({
            message: 'Login correcto',
            data: 
            {
            _id: data._id,
            email: data.email, 
            rol: data.rol, 
            token 
            }
        })
    } catch (error) 
    {
      next(error)
    }
}

/* Exportamos el controller para el router */
module.exports = {
    postLogin
}