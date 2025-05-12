import enterstudent from './Build/Enter.js';
import exitstudent from './Build/exit.js';
import statistics from './Build/statistics.js';
import student from './Student/student.js';




export default [
    {path : "/enterstudent", router : enterstudent},
    {path : "/exitstudent", router : exitstudent},
    {path : "/statistics", router : statistics},
    {path : "/student", router : student},


]