const {Tarea} = require("catro-eixos-js");
const acciones = require("./acciones.js");

const uuidv4 = require('uuid/v4');

class Job{

    static setStore(store){

        Job.store = store;
    }

    static accion(a){

        Job.store.dispatch(a);
    }

    constructor(args = {}, resultados = {}){

        this.id = uuidv4();
        this.args = args;
        this.resultados = resultados;

        this.meta = {
            status: "WAITING",
            creacion_t: new Date(),
            inicio_procesado_t : undefined,
            finalizacion_procesado_t: undefined,
        };

        this.__instalar();

        this.__nuevoJob();
    }

    RAW(){
        return {
            id: this.id,
            meta: this.meta,
            args: this.args,
            resultados: this.resultados,
        }
    }

    PROCESANDO(){
        this.meta.status = "PROCESSING";
        this.meta.inicio_procesado_t = new Date();
    }

    FINALIZAR(){
        this.meta.status = "FINISHED";
        this.meta.finalizacion_procesado_t = new Date();
    }

    __instalar(){

        this.__instalarMeta();
        this.__instalarResultados();

    }

    __instalarMeta(){
        
        let meta = this.meta;

        this.meta = new Proxy(meta, {

            "set": (o, clave, valor) => {

                this.__cambioEnMeta(o, clave, valor);

                return true;
            }

        })
    }

    __instalarResultados(){

        let resultados = this.resultados;

        this.resultados = new Proxy(resultados, {

            "set": (o, clave, valor) => {

                this.__cambioEnResultados(o, clave, valor);

                return true;
            }


        });

    }

    __cambioEnMeta(o, clave, valor){

        let a = acciones.CAMBIO_META(this.id, clave, valor);

        Job.accion(a);

        o[clave] = valor;
    }

    __cambioEnResultados(o, clave, valor){

        let a = acciones.CAMBIO_RESULTADOS(this.id, clave, valor);

        Job.accion(a);

        o[clave] = valor;
    }

    __nuevoJob(){

        let a = acciones.NUEVO_JOB(this);

        Job.accion(a);
    }
}

module.exports = Job;