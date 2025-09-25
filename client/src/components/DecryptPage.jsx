import  { useEffect, useRef, useState } from "react";
// import CryptoJS from "crypto-js";


const DecryptPage = ( {BASE_URL}) => {
   const [done,setdone]=useState(false)
   const runOnce=useRef(false)  //for preventing twice loading 
  
    
  useEffect(() => {
    if(runOnce.current) return;// it returns in second time
    runOnce.current=true;
    
    console.log("decription started");
   async function fetchAndDecrypt() {
      // Extract params from URL
      const urlParams = new URLSearchParams(window.location.search);
      const keyHex = urlParams.get("key");
      const ivHex = urlParams.get("iv");
      const fileId = window.location.pathname.split("/").pop();

    console.log(fileId);
      if (!keyHex || !ivHex) {
        alert("Missing decryption key or IV!");
        return;
      }

      try {
        // 1. Fetch encrypted file from backend
        const response = await fetch(`${BASE_URL}/sharing/download/${fileId}`,{
           credentials: "include"
        });
      const encryptedBuffer = await    response.arrayBuffer();
     
   
   // 2. Convert hex to ArrayBuffer
   function hexToBuffer(hex) {
          const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
          return bytes.buffer;
        }

        const keyBuffer = hexToBuffer(keyHex);
        const ivBuffer = hexToBuffer(ivHex);

        // 3. Import AES key   windowAPI
        const cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-CBC" },
          false,
          ["decrypt"]
        ); 
       console.log(cryptoKey);

        // 4. Decrypt  
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: "AES-CBC", iv: new Uint8Array(ivBuffer) },
          cryptoKey,
          encryptedBuffer
        );
        
        
        //filename form headers 
        const disposition = response.headers.get("Content-Disposition");
          
           let fileName="downloaded_file"
           if (disposition && disposition.includes("filename=")) {
             fileName = disposition
                  .split("filename=")[1]
                  .replace(/"/g, ""); // remove quotes
                  console.log("filename:",fileName);
           }
         

      // Decrypt function

// 

// Convert ArrayBuffer → WordArray (crypto-js format)
// function arrayBufferToWordArray(ab) {
//   const u8 = new Uint8Array(ab);
//   const words = [];
//   for (let i = 0; i < u8.length; i++) {
//     words[(i / 4) | 0] |= u8[i] << (24 - 8 * (i % 4));
//   }
//   return CryptoJS.lib.WordArray.create(words, u8.length);
// }

// Convert WordArray → Uint8Array
// function wordArrayToUint8Array(wordArray) {
//   const len = wordArray.sigBytes;
//   const u8_array = new Uint8Array(len);
//   let offset = 0;
//   for (let i = 0; i < wordArray.words.length; i++) {
//     const word = wordArray.words[i];
//     for (let j = 3; j >= 0; j--) {
//       if (offset < len) {
//         u8_array[offset++] = (word >> (j * 8)) & 0xff;
//       }
//     }
//   }
//   return u8_array;
// }


// function decryptAES(encryptedBuffer, keyBuffer, ivBuffer) {
  // const encryptedWA = arrayBufferToWordArray(encryptedBuffer);
  // const keyWA = arrayBufferToWordArray(keyBuffer);
  // const ivWA = arrayBufferToWordArray(ivBuffer);

  // const decryptedWA = CryptoJS.AES.decrypt(
  //   { ciphertext: encryptedWA },
  //   keyWA,
  //   { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  // );

  // return wordArrayToUint8Array(decryptedWA); // Uint8Array (decrypted buffer)
// }

// Usage
// const decryptedBuffer = decryptAES(encryptedBuffer, keyBuffer, ivBuffer);

        // 5. Auto-download decrypted file
        const blob = new Blob([decryptedBuffer]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName; // original filename can be sent in API
        link.click();    
        setdone(true)

        // alert("File decrypted and downloaded!");
      } catch (err) {
        console.error("Decryption failed", err);
        alert("Error decrypting file");
      }
    } 
   
    fetchAndDecrypt();
  }, []);

  return <>
  {done?<h3 style={{textAlign:"center"}}>  <div>  Successfully File Downloaded</div>
    <p style={{margin:"5px"}}><button  onClick={()=>{window.history.back()}}>Go Back</button></p>
  </h3>:(<h2>Decrypting your file...</h2>)}
  </>
};

export default DecryptPage;
