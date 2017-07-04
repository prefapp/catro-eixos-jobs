const Driver = require("./driver.js");

class DriverMemoria extends Driver{

    getJob(id){

        return new Promise((cumplida, falla) => {

            let j = this.store.store.getState()["jobs"]

                        .getIn(["jobs", id]);

            if(j) j = j.toJS();

            return cumplida(j);
        });
    }

}

module.exports = DriverMemoria;
