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

        creation_t: Date(),

        inicio_procesado_t: Date(),

        finalizacion_procesado_t: Date()        

    },

    resultados: {

        //lo definido por el proceso


    }


}



```
