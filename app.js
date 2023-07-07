const express = require('express');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');

const itemsSchema = new mongoose.Schema({
    name:{
        type:String
    }
});

// mongoose.connect('mongodb://127.0.0.1:27017/todolistDB').then(()=>console.log("MongoDb connected"))
// .catch(err => console.log("mongo error",err));

mongoose.connect('mongodb+srv://maharshsoni3:sPcoDEDy63351VIQ@cluster0.ivsptca.mongodb.net/todolistDB').then(()=>console.log("MongoDb connected"))
.catch(err => console.log("mongo error",err));

const Item = mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Eat food"
});


const defaultItems=[item1];


const app=express();



app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));




let day=new Date();
let options={
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
}

let today=day.toLocaleDateString("en-US",options);


app.get("/",function(req,res){
    

Item.find({})
  .then(foundItems => {
    if (foundItems.length === 0) {
      insertDefaultItems()
        .then(() => {
          res.redirect('/');
        })
        .catch(err => {
          console.error(err);
          // Handle the error, such as sending an error response
          res.status(500).send('An error occurred');
        });
    } else {
      res.render('todo', { CurrentDate: today, newListItem: foundItems });
    }
  })
  .catch(err => {
    console.error(err);
    // Handle the error, such as sending an error response
    res.status(500).send('An error occurred');
  });

function insertDefaultItems() {
  return Item.insertMany(defaultItems)
    .then(() => {
      console.log('Successfully saved items to DB');
    });
}

});

app.post("/",function(req,res){
    newItem=req.body.task;
    

    const item=new Item({
        name:newItem
    });
    defaultItems.push(item);
    console.log(item);

    Item.create(item);
    console.log(defaultItems);

    

    res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
  .then(() =>{
      console.log("Successfully deleted checked Item");
      res.redirect("/");
    })
    .catch(err=>{console.log(err)})
});



app.listen(2700,function(){
    console.log("Server started at port number 2700");
});