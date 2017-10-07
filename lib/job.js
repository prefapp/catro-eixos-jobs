const {Tarea} = require("catro-eixos-js");
const acciones = require("./acciones.js");

const uuidv4 = require('uuid/v4');

const debug = require("debug")("catro-eixos-jobs:job");

class Job{

    static getJobDeStore(id){

      return Job.store.getState()["jobs"].getIn(

        ["jobs", id]

      ).toJS()

    }

    static setStore(store){

        Job.store = store;

        console.log("HEMOS INICALIZADO EL STORE");
    }

    static accion(a){

        Job.store.dispatch(a);
    }

    constructor(args = {}, resultados = {}){


        this.id = uuidv4();

        console.log(`NUEVO JOB CON ID ${this.id}`);

        this.args = args;
        this.resultados = resultados;

        this.meta = {
            id_tarea: undefined,
            almacenado: false,
            status: "WAITING",
            completado: 0,
            hito: "",
            finalizado: "-", 
            creacion_t: new Date(),
            inicio_procesado_t : undefined,
            finalizacion_procesado_t: undefined,
        };

        this.fDesinstalado = false;

        debug(`Creando job para proceso ${args.proceso}`)

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

    ID_TAREA(id){
      this.meta.id_tarea = id;
    }

    HITO(hito){
      this.meta.hito = hito;
    }

    PORCENTAJE(porcentaje){
      this.meta.completado = porcentaje;
    }

    PROCESANDO(){
        this.meta.status = "PROCESSING";
        this.meta.inicio_procesado_t = new Date();
    }

    FINALIZAR(estado){
        this.meta.status = "FINISHED";
        this.meta.finalizacion_procesado_t = new Date();
        this.meta.completado = 100;
        this.meta.finalizado = estado;
    }

    esperarPorJobAlmacenado(){
    
      return (async () => {

        let ok = false;

        while(!ok){

          ok = Job.getJobDeStore(this.id).meta.almacenado;

          if(!ok){
            let e = await new Promise(c => setTimeout(c, 10))
          }

        }
    
        return this;

      })();

    }

    desinstalar(){

      this.fDesinstalado = true;

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

        o[clave] = valor;

        if(this.fDesinstalado) return;

        let a = acciones.CAMBIO_META(this.id, clave, valor);

        Job.accion(a);

    }

    __cambioEnResultados(o, clave, valor){

        o[clave] = valor;

        if(this.fDesinstalado) return;

        let a = acciones.CAMBIO_RESULTADOS(this.id, clave, valor);

        Job.accion(a);

    }

    __nuevoJob(){

        let a = acciones.NUEVO_JOB(this);

        Job.accion(a);
    }
}

module.exports = Job;
