import getuserspagination from "./Students/getStudents.js";
import getadminpagination from "./Students/getAdmin.js";
import addadmin from "./AdminEdit/addadmin.js";
import editadmin from "./AdminEdit/Editadmin.js";
import getadmin from "./AdminEdit/getadmin.js";

import addbuild from "./Builds/addBuild.js";
import editbuild from "./Builds/editbuild.js"
import getbuild from "./Builds/GetBuid.js";

const routers = [
    {path : "/getusers", router : getuserspagination},
    {path : "/getadmin", router : getadminpagination},
    {path : "/addadmin", router : addadmin},
    {path : "/editadmin", router : editadmin},
    {path : "/getadmin", router : getadmin},

    {path : "/addbuild", router : addbuild},
    {path : "/editbuild", router : editbuild},
    {path : "/getbuild", router : getbuild},
    
    

];



export default routers;