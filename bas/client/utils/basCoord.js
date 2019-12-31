import CryptoJS from 'crypto-js';
import Coordtransform from 'coordtransform';
export function coordOffsetDecrypt(x, y){
   const X_MAGIC = 35000.0;
   const Y_MAGIC = 27000.0;
   const percision = 1000000;
   x = parseFloat(x)*100000%36000000;
   y = parseFloat(y)*100000%36000000;

   const x1 = parseInt(-(((Math.cos(y/100000))*(x/X_MAGIC))+((Math.sin(x/100000))*(y/Y_MAGIC)))+x);
   const y1 = parseInt(-(((Math.sin(y/100000))*(x/X_MAGIC))+((Math.cos(x/100000))*(y/Y_MAGIC)))+y);

   const x2 = parseInt(-(((Math.cos(y1/100000))*(x1/X_MAGIC))+((Math.sin(x1/100000))*(y1/Y_MAGIC)))+x+((x>0)?1:-1));
   const y2 = parseInt(-(((Math.sin(y1/100000))*(x1/X_MAGIC))+((Math.cos(x1/100000))*(y1/Y_MAGIC)))+y+((y>0)?1:-1));
  return Coordtransform.gcj02tobd09(x2/100000.0, y2/100000.0);
}

function xaddrDecrypt(addr) {
   let key = "3XR05RC4hxW9wMYi";
   return CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(addr.substring(32))},
                               CryptoJS.enc.Hex.parse(CryptoJS.SHA1(key).toString().substring(0,32)),
                               { iv: CryptoJS.enc.Hex.parse(addr.substring(0,32)),}).toString(CryptoJS.enc.Utf8)
}
