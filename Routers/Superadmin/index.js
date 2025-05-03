import getuserspagination from "./Students/getStudents.js";
import getadminpagination from "./Students/getAdmin.js";
import addadmin from "./AdminEdit/addadmin.js";
import editadmin from "./AdminEdit/Editadmin.js";

import addbuild from "./Builds/addBuild.js";
import editbuild from "./Builds/editbuild.js"


const routers = [
    {path : "/getusers", router : getuserspagination},
    {path : "/getadmin", router : getadminpagination},
    {path : "/addadmin", router : addadmin},
    {path : "/editadmin", router : editadmin},

    {path : "/addbuild", router : addbuild},
    {path : "/editbuild", router : editbuild}
    
    

];



export default routers;