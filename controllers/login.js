
const { Login } = require ('../models')

const postLogin = async ( req, res, next ) => {
    try {

        const { email, password, rol } = req.body

        const data = await Login.findOne({ email, password, rol })

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