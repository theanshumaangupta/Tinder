import express from 'express'
import { PrismaClient } from '@prisma/client';
import cors from 'cors'
import jwt from 'jsonwebtoken'


const app = express();
app.use(express.json())
app.use(cors())
const prisma = new PrismaClient()
let secret_key = process.env.JWT_SECRET

// Creating Middleware
function protectedRoute(req, res, next){
  const Authorization = req.headers.authorization
  if (!Authorization) {
    return res.status(401).json({
      message: "Unauth!"
    })
  }
  const token = Authorization.split(" ")[1]
  const payload = jwt.verify(token, secret_key)
  if (!payload) {
      res.status(401).json({
          message: "Unauthorised Access!"
      })
  }
  req.user = payload.id
  next()
}

function main() {
  app.get('/', protectedRoute, async (req, res) => {
    const id = req.user
    const user = await prisma.user.findFirst({
      where : {
        id: Number(id)
      },
      include: {
        Profile :true
      }
    })
    if (!user) {
      return res.status(400).json({
        message: "User Not Found!"
      })
    }    
    return res.json(user)

  });
  
  app.post('/login', async (req, res)=>{
    const body = req.body.data
    const existingUser = await prisma.user.findFirst({
      where : {
        username : body.username
      },
    })
    // There is a new user 
    if(existingUser == null){
      res.json({ message: "Need to go on Signup Page", token: 0})
    }
    else{ 
      const passwordCompare = (existingUser.password == body.password)
      console.log("exist",existingUser);
      console.log("body", body);
      if (passwordCompare){
          const token = jwt.sign({id: existingUser.id}, secret_key)
          res.json({ message: "Successfully Logged in", token })
      }
      else{
          res.json({ message: "Incorrect Password", token: 0})
      }
    }
    
  })
  
  app.post('/register', async (req, res)=>{
    const body = req.body.data
    const existingUser = await prisma.user.findFirst({
      where : {
        username : body.username
      },
    })
  
    // There is a new user 
    if(existingUser){
      res.json({ message: "Need to go on Login Page", token: 0})
    }
    else{ 
      const {username, name, password} = body
      const user = await prisma.user.create({
        data: {
          username: username,
          name: name,
          password: password,
    
          Profile: {
            create: {
              bio: "Hey there! I am using Tiner!",
            }
          }
    
        },
        select: {
          id: true
        }
      })
      const token = jwt.sign({id: user.id}, secret_key)
      res.json({ message: "Successfully Logged in", token })
    }
    
  })

  app.get('/profile', protectedRoute, async (req, res)=>{
    const id = req.user
    const user = await prisma.profile.findFirst({
      where : {
        userId: Number(id)
      }
    })
    res.json(user)
  })

  app.get("/data", protectedRoute, async (req, res)=>{
    const id = req.user
    // const alreadySwiped = await prisma.swipe.findMany({
    //   where : {
    //     fromUserId : id
    //   },
    //   select: {
    //     toUser : true
    //   }
    // })
    // console.log(alreadySwiped);
    // it will send all users data for swipe on home page excluding self 
    const users = await prisma.user.findMany({
        where: {
          NOT: {
            OR : [
              {
                id: id // Exclude the user with id = 1
              },
              {
                swipedBy : {
                  some: {
                    fromUserId: id
                  }
                }
              }
            ]
          }
        }
    }) 
    console.log(users);
    res.send(users);
  })

  app.post("/swipe", protectedRoute, async (req, res)=>{
    const id = req.user
    const body = req.body
    body.fromUserId = id
    // If it is Swiped Right (body.like == true)
    if (body.like) {
      // it will check ..the person i swiped .... is the same person am i swipedBy?
      const checkingMatch = await prisma.swipe.findFirst({
        where:{
          fromUserId : body.toUserId,
          toUserId: id
        }
      })
      // if the person i liked already liked me .....then checkingMatch will be true .....and  it will create entry in Match table
      if(checkingMatch){
        await prisma.match.create({
          data : {
            userOneId : body.toUserId,
            userTwoId : id
          }
        })
      }
    }
    // Now it will create entry in Swipe table
    const newSwipe = await prisma.swipe.create({
      data : body
    })
    res.json(newSwipe)
  })

  app.get('/match', protectedRoute, async (req, res)=>{
    const id = req.user
    // Finding Entry from Match Table by ID and using include for calling User table for name related to id
    const isMatch = await prisma.match.findMany({
      where: {
        OR :[
          {userOneId : id},
          {userTwoId : id}
        ]
      },
      include: {
        userOne: {
          select: {
            name: true,
            id: true
          }
        },
        userTwo: {
          select: {
            name: true,
            id:  true
          }
        }
      }
    });
    
    // Creating Array of Matched Users from Entry
    const MatchedUsers = []
    isMatch.forEach(element => {
      if(element.userOneId == id){
        MatchedUsers.push(element.userTwo.name)
      }
      else{
        MatchedUsers.push(element.userOne.name)
      }
    });

    // console.log("IsMAtch", isMatch, MatchedUsers);
    res.json(MatchedUsers)
  })
  app.listen(3000);
  
}

main()
