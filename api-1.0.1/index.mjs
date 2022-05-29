import express from 'express' 
import cors from 'cors'
import mongodb from 'mongodb'
import {Server} from 'socket.io'
import {createServer} from 'http'
import {config} from 'dotenv'
//[env]
config()
console.clear()
const app = express()
//[setup web socket]
const httpServer = createServer(app)
const io = new Server(httpServer,{cors:{origin:'*'}})
//[setup mongodb]
const {MongoClient} = mongodb
//const uri = 'mongodb+srv://ary:komang@cluster0.91nmd.mongodb.net/zonabaca?retryWrites=true&w=majority'
const uri = 'mongodb://127.0.0.1:27017'
console.log(uri)
const client = new MongoClient(uri)
const dbName = 'zonabaca'
//**[connect mongodb]
await client.connect(()=>{
  app.listen(process.env.PORT || 8888,()=>{
    httpServer.listen(process.env.PORT || 3000,()=>{
    console.log("your apps already running in port 8888")
    })
  })
})
const users = client.db(dbName).collection('User')
const globalData = client.db(dbName).collection('globalData1')
const bigData = client.db(dbName).collection('bigdata1')
//await globalData.insertOne({category:'information',title:'hapes',owner:"joe",content:['hape itu ga bahaya ya adik adik cuma bisa bahaya kalo kamu pake kelamaan...','pisum']})
//[middlewere]
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.static('./public/'))
//[router]
app.get('/',(req,res)=>{
  res.sendFile('/index.html')
})
app.post('/login',async(req,res)=>{
  const {username,password} = req.body
  //console.log(username)
  //if(user.find(item => item.username == username ) != undefined && user.find(item => item.password == password) != undefined){
  const user = await users.find({username}).toArray()
  //console.log(user)
  try{
    if(user[0].password == password){
      res.json(true)
    }else{
      res.json(false)
    }
    res.end()
  }catch(e){
    res.json(false)
    res.end()
  }
})
app.post('/signup',async(req,res)=>{
  const {username,password,email} = req.body
//if(user.find(item => item.username == username ) == undefined && user.find(item => item.password == password) == undefined && user.find(item => item.email == email) == undefined){
  const check = await users.find({username}).toArray()
  if(check.length == 0){
    await users.insertOne({username,password,email})
    res.json(true)
  }else{
    res.json(false)
  }
  res.end()
})
app.post('/getData',async(req,res)=>{
 // console.log(req.body)
  const data = req.body
  const {category,start,end} = req.body
  //console.log(start,end)
  //console.log(category,1)
  const alldata = await globalData.find({}).toArray()
  if(data.category === 'all'){
   // console.log('send all data')
    res.json([alldata.slice(start,end),alldata.length])
    res.end()
  }else{
    //console.log('send category',data.category)
    const dataIncategory = await globalData.find({category}).toArray()
    res.json([dataIncategory.slice(start,end),dataIncategory.length])
    res.end()
  }
  //console.log(data.category)
})
app.post('/findData',async(req,res)=>{
  const title = req.body.query
  if(title == ''){
    const findData = await globalData.find({}).toArray()
    res.json(findData)
    res.end()
 }else{
    const findData = await globalData.find({title}).toArray()
    res.json(findData)
    res.end()
  }
})
app.post('/addData',async(req,res)=>{
  let {title,category,owner,like,people} = req.body
  const dataToSubmit = req.body
  const id = Date.now() + owner + 'xfc' + 'encrypt'
  dataToSubmit.idToken = id
  console.log(dataToSubmit)
  const data = {
    title,category,owner,content:dataToSubmit.content[0],idToken:id,like,people
  }
  await bigData.insertOne(dataToSubmit)
  await globalData.insertOne(data)
  res.json(true)
  //console.log(data)
  res.end()
})
app.get('/viewHandle/:id',async(req,res)=>{
  const id = req.params.id
  //console.log(id)
  if(id == undefined){
    //console.log('cannot send request')
    res.end()
  }
  const viewContent = await bigData.find({idToken:id}).toArray()
  res.json(viewContent)
  res.end()
})
io.on('connection',async(socket)=>{
  //console.log('hi')
  socket.on('update',async()=>{
    const globalDataNew = await globalData.find({}).toArray()
    let nglobalData = globalDataNew.slice(0,10)
    io.emit('dataUpdate',nglobalData)
  }) 
  socket.on('like',async(data)=>{
    //expected like and comment
    console.log(data)
    const {id,indexIs,username,type} = data
    const idToken = id
    const category = indexIs.category
    const start = indexIs.length[0]
    const end = indexIs.length[1]
    const like = data.like
    const comment = data.comment
    const updateOneB = await globalData.find({idToken}).toArray()
    //console.log(updateOneB[0].people.find(e => e != username))
    if(updateOneB[0].people.find(e => e == username) == undefined){
      updateOneB[0].people.push(username)
      updateOneB[0].like = updateOneB[0].people.length
    }else if(updateOneB[0].people.find(e => e == username) != undefined){
      updateOneB[0].people = updateOneB[0].people.filter(e => e != username)
      updateOneB[0].like = updateOneB[0].people.length
      //console.log(updateOneB)
    }
    await globalData.updateOne({idToken},{$set:updateOneB[0]})
    //console.log(updateOneB)
    if(category == 'all'){
      const findAlldata = await globalData.find({}).toArray()
      const dataInIndex = {data:findAlldata.slice(start,end),indexIs} 
      io.emit('likeData',dataInIndex)
    }else{
      const findAlldata = await globalData.find({category}).toArray()
      const dataInIndex = {data:findAlldata.slice(start,end),indexIs}
      io.emit('likeData',dataInIndex)
    }
  })
})
