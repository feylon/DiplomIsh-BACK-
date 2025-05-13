import genarateQrcode from "./QRcode/genarateQrcode.js";
import GetBio from "./GetBio.js";
import gethisory from "./HIstory/genarateQrcode.js";

const routers = [
    {path : "/getqr", router : genarateQrcode},
    {path : "/getbio", router : GetBio},
    {path : "/gethistory", router : gethisory},
]
export default routers;