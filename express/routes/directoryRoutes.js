import express from "express";
import cookieParser from "cookie-parser";
import { rm, writeFile } from "fs/promises";
import directoriesData from '../directoriesDB.json' with {type: "json"}
import usersData from '../usersDB.json' with {type: "json"}
import filesData from '../filesDB.json' with {type: "json"}

 
const router = express.Router();

// fetching  directories
router.get("/:id?", async (req, res) => {
  const userId=req.cookies.uid
  //finding username 
  const userdata=usersData.find(user=>user.id===userId)
  const username=userdata.name
  console.log(userdata);
  //finding valid users dirs
  const onlyLoginDir=directoriesData.filter((dir)=>dir.userId===userId)
  const rootDir = onlyLoginDir.find(d => d.parentDirId === null)

  const id  = req.params.id ||rootDir?.id
  console.log(id,"fetching id");
  //directories belonging to user current page 
  const directoryData = onlyLoginDir.find((directory) => directory.id === id)
  if(!directoryData) return res.status(404).json({message: "Directory not found!"})
    //files belonging to user 
  const files = directoryData.files.map((fileId) =>filesData.find((file) => file.id === fileId && file.userId===userId))
  .filter(Boolean)
// console.log(files,"lofin");
   // find subdirectories belonging to user
   const directories = directoryData.directories.map((dirId) => onlyLoginDir.find((dir) => dir.id === dirId)
  ).filter(Boolean) //for filtering undefined
  .map((({ id, name }) => ({ id, name })))
   
    // console.log(directories);
    console.log("DirData served to user: ",rootDir.name);
    //finding email of user  
 const email=rootDir.name.split("-")[1] 
  return res.status(200).json({ ...directoryData, files, directories,email,username })
});


//  creating directories
router.post("/:parentDirId?", async (req, res, next) => {
  const [rootDir] = directoriesData.filter(d => d.parentDirId === null && d.userId===req.cookies.uid) //filter return an array so we have to array destructure
  //parent id for folder creation
  const parentDirId = req.params.parentDirId || rootDir.id
  console.log(rootDir ,"parentid for creation");
  const dirname = req.headers.dirname || 'New Folder'
  const id = crypto.randomUUID()
  const parentDir = directoriesData.find((dir) => dir.id === parentDirId)
  if(parentDir.userId!==req.cookies.uid){
   return res.status(401).json({message:"can't CreateDir invalid user"})
  }  
  if(!parentDir) return res.status(404).json({message: "Parent Directory Does not exist!"})

  parentDir.directories.push(id)
  directoriesData.push({
    id,
    name: dirname,
     userId:rootDir.userId,
    parentDirId,
    files: [],
    directories: []
  })
  try {
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesData,null,2))
    return res.status(200).json({ message: "Directory Created!" })
  } catch (err) {
    next(err)
  }
});
// rename folder
router.patch('/:id', async (req, res, next) => {
  const {id} = req.params
  const {newDirName} = req.body
  const dirData = directoriesData.find((dir) => dir.id === id)
  if(!dirData) return res.status(404).json({message: "Directory not found!"})

  if(dirData.userId!==req.cookies.uid){
   return res.status(401).json({message:"Unathorized can't rename"})
  }
  dirData.name = newDirName
  try {
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesData,null,2))
    res.status(200).json({message: "Directory Renamed!"})
  } catch(err) {
    next(err)
  }
})
// delete request
router.delete("/:id", async (req, res, next) => {
  const {id} = req.params
  const dirIndex = directoriesData.findIndex((directory) => directory.id === id)
  const directoryData = directoriesData[dirIndex]
  if(directoryData.userId!==req.cookies.uid){
   return res.status(401).json({message:"Unathorized can't delete dir"})
  }
  try {
    directoriesData.splice(dirIndex, 1)
    for await (const fileId of directoryData.files) {
      const fileIndex = filesData.findIndex((file) => file.id === fileId)
      const fileData = filesData[fileIndex]
      await rm(`./storage/${fileId}${fileData.extension}`);
      filesData.splice(fileIndex, 1)
    }
    for await (const dirId of directoryData.directories) {
      const dirIndex = directoriesData.findIndex(({id}) => id === dirId)
      directoriesData.splice(dirIndex, 1)
    }
    const parentDirData = directoriesData.find((dirData) => dirData.id === directoryData.parentDirId)
    parentDirData.directories = parentDirData.directories.filter((dirId) => dirId !== id)
    await writeFile('./filesDB.json', JSON.stringify(filesData,null,2))
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesData,null,2))
    res.status(200).json({ message: "Directory Deleted!" });
  } catch (err) {
    next(err)
  }
});

export default router;
