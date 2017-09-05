
const UtilesJobs = require("./utiles_jobs.js");

class BuscarJobs extends UtilesJobs{

  buscar(consulta){
    
    let driver = UtilesJobs.getDriverJobs();

    return driver.findJobs(consulta)

  }
  

}


module.exports = BuscarJobs;
