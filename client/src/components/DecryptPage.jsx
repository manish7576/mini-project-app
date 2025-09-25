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
