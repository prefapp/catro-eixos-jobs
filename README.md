# CatroEixosJobs

## Estructura de un job


```js

{
    id: "asf",

    args: {
        //tal y como llegan a la tarea  
    },

    meta: {

        almacenado: true|flase, // de uso interno

        status: "WAITING|PROCESSING|FINISHED",

        porcentaje: 42.8, //de completado de la tarea

        finalizado: "OK|KO|-", 

        creation_t: Date(),

        inicio_procesado_t: Date(),

        finalizacion_procesado_t: Date()        

    },

    resultados: {

        //lo definido por el proceso


    }


}



```
