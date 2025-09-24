
import express from "express"
import crypto from 'node:crypto'
import {createWriteStream,createReadStream} from "fs"
import { rm, writeFile } from "fs/promises";
import path from 'path';
import filesData from '../filesDB.json' with {type: "json"}
import encryptFD from '../encryptDB.json' with {type: "json"}
import { fstat } from "node:fs";
              
const router=express.Router()

 router.get('/:fileId', async (req,res,next) =>{
    const { fileId } = req.params;
  
  const fileData = filesData.find((file) => file.id === fileId);
   if (!fileData) return res.status(404).json({ error: "File not found" });
  //Generate the encryption key 
  const key=  crypto.randomBytes(32) //AES-256 
   
   const iv=crypto.randomBytes(16,)

   const cipher = crypto.createCipheriv("aes-256-cbc", key, iv); 

  const input=createReadStream(`./storage/${fileId}${fileData.extension}`)//it read chunk by chucnk to low memory uses 

  const output=createWriteStream(`./encryptFiles/${fileId}.enc`)
  // Pipe data: read → encrypt → write
  input.pipe(cipher).pipe(output);

  output.on('finish', async ()=>{
   console.log("Encryption Finished ");
   encryptFD.push({
      id:fileId,
      name:fileData.name,
      encryptPath:`./encryptFiles/${fileId}.enc`,
      key:key.toString("hex"),
      iv:iv.toString("hex"),
   })
 
   await writeFile("./encryptDB.json", JSON.stringify(encryptFD,null,2));

   console.log("Sever shared ",fileData);
 const share_obj={
    download_link: `http://localhost:5173/decrypt/${fileId}`,
      key: key.toString("hex"),
      iv: iv.toString("hex")
   }
   res.json(share_obj)
  }) 
})


router.get("/download/:fileId",(req,res)=>{
   const {fileId}=req.params
   console.log(fileId);
   // const fileData = filesData.find((file) => file.id === fileId);
   const encryptFileData=encryptFD.find((file)=> file.id===fileId)
   // const extname=encryptFileData.extension
   
 if (!encryptFileData) {
    return res.status(404).json({ error: "File not found or not encrypted" });
  }

  res.download(encryptFileData.encryptPath,encryptFileData.name);
  console.log("File send to receiver");
  

});

export default router