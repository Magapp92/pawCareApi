
const notFound = ( req , res , next ) => {
    const error = new Error(`Endpoint no existe`)
            error.status = 404
    next(error)
}


const errorHandler = ( error , req , res , next )=>{
    let { status , message } = error
        status  = status  || 500
        message = message || `Error interno`

    res.status(status).json({ message , data : null })
}

module.exports = {
    notFound,
    errorHandler
}
