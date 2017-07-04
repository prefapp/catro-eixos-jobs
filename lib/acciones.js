module.exports = {

    "CAMBIO_RESULTADOS": (id, clave, valor) => {

        return {
            type: "CAMBIO_RESULTADOS",
            id: id,
            clave: clave,
            valor: valor
        }

    },

    "CAMBIO_META": (id, clave, valor) => {

        return {
            type: "CAMBIO_META",
            id: id,
            clave: clave,
            valor: valor
        }

    },

    "NUEVO_JOB": (job) => {

        return {
            type: "NUEVO_JOB",
            job: job 
        }
    }
}
