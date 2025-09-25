import express from "express";
import { writeFile } from "fs/promises";
import directoriesData from '../directoriesDB.json' with {type: "json"}
import usersData from '../usersDB.json' with {type: "json"}

const router = express.Router();


router.post('/register', async (req, res, next) => {
  const {name, email, password} = req.body

  const foundUser = usersData.find((user) => user.email === email)
  console.log(foundUser);
  if(foundUser) {
    return res.status(409).json({
      error: "User already exists",
      message: "A user with this email address already exists. Please try logging in or use a different email."
    })
  }

  const dirId = crypto.randomUUID()
  const userId = crypto.randomUUID()
 
  directoriesData.push({
    id: dirId,
    name: `root-${email}`,
    userId,
    parentDirId: null,
    files: [],
    directories: []
  })

  usersData.push({
    id: userId,
    name,
    email,
    password,
    rootDirId: dirId
  })

  try {
    await writeFile('./directoriesDB.json', JSON.stringify(directoriesData,null,2))
    await writeFile('./usersDB.json', JSON.stringify(usersData,null,2))
    res.status(201).json({message: "User Registered"})
  } catch(err) {
    next(err)
  }

})


router.post('/login',async (req,res,next)=>{
  console.log(req.body);
  const {email,password}=req.body
  const userExist=usersData.find(user=>user.email===email)
  if(!userExist){
    return res.status(404).json({error:"Invalid Credentials"})
  }
  if(userExist.password!==password){
   return res.status(404).json({error:"Wrong password"})
  }
  res.cookie("uid",userExist.id,{
    httpOnly:true,
  
  //  sameSite:"none",
    maxAge:1000*3600*24  //for 24 hrs
  })
  res.json("Logged In")

})

router.post("/logout", (req, res) => {
  res.clearCookie("uid", { path: "/" });
  res.send({ message: "Logged out" });
});

export default router;
