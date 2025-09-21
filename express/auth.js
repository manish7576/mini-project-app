
import usersData from './usersDB.json' with {type: "json"}
import cookieParser from "cookie-parser";


export default function checkAuth(req,res,next){
    console.log(req.cookies.uid,"uid-from auth.js");
  const uid=req.cookies.uid
  const validId=usersData.find(user=>user.id===uid)
  if(!validId ){
    return res.status(401).json({error:"User not loggedIn"})
  }
   next() 
}