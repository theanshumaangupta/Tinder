import express from 'express'
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json())
const prisma = new PrismaClient()

app.get('/', async (req, res) => {
    const users = await prisma.user.findMany({}) 
    res.send(users);
});

app.get("/user", async (req, res)=>{
    const { id } = req.query
    const user = await prisma.user.findFirst({
      where : {
        id: Number(id)
      },
      include: {
        Profile: {
          select: {
            private: true
          }
        }
      }
    })
    if (!user) {
      return res.status(400).json({
        message: "User Not Found!"
      })
    }    
    return res.json(user)
})

app.post("/", async (req, res) => {
  const {username, name, password} = req.body
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
  
  res.json(user)
})

app.put("/user", async (req, res) => {
  const { id, data } = req.body
  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: data
  })
  res.json(user)
})

app.delete("/user", async (req, res) => {
  const { id } = req.body
  await prisma.user.delete({
    where: {
      id: Number(id),
    }
  })
  res.json({
    message: "Success!"
  })
})

app.listen(3000);
