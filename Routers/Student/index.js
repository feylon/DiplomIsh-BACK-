import genarateQrcode from "./QRcode/genarateQrcode.js";


const routers = [
    {path : "/getqr", router : genarateQrcode},
]
export default routers;