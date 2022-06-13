const express = require("express")
const mongoose = require("mongoose")
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//connection
const connection = mongoose.connect("mongodb://localhost:27017/News_app")

//Schema
const NewsSchema = new mongoose.Schema({
  Title:String,
  Description:String,
  Date:Date,
  Auhor:{
    type:String,
    enum:["Mathias Newburn", "Rey Rutty", "Magdaia Shellard", "Kathrine Faichney"]
  },
  Location:{
    type:String,
    enum:["London","New York"]
  },
  Tags:{
     type:String,
     enum:["politics", "crime", "tech", "sports", "health"]
  },
  Total_views:Number,
  category:{
    type:String,
    enum:[ "trending", "top", "new"]
  }
})
const news = mongoose.model("new",NewsSchema)

app.get("/",(req,res)=>{
  res.send("Welcome to homepage")
})

app.post("/news/new",async(req,res)=>{
  await news.insertMany({...req.body})
  return res.send("New news added")
})

app.get("/news/get",async(req,res)=>{

  if(req.query.Location){
    let loc = await news.find({Location:req.query.Location})
    return res.json(loc)
  }
  if(req.query.author){
    let aut = await news.find({Author:req.query.author})
    return res.json(aut)
  }
  if(req.query.tag){
    let tag = await news.find({Tags:req.query.tag})
    return res.json(tag)
  }
  if(req.query.title){
    let t = await news.find({Title:req.query.Title})
    let view = t[0].Total_views+1
    await news.updateOne({Title:t},{$set:{Total_views:view}})
    t = await news.find({Title:t})
    return res.json(t)
  }
  if(req.query.id){
    let t = await news.find({_id:req.query.id})
    let view = t[0].Total_views+1
    await news.updateOne({_id:req.query.id},{$set:{Total_views:view}})
    t = await news.find({_id:req.query.id})
    return res.json(t)
  }

})

const PORT = process.env.PORT || 8080

app.listen(PORT,async()=>{
  try {
    await connection;
    console.log("Connected");
  } catch (error) {
    console.log("error");
  }
  console.log("Server started")
})