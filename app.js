
const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//npm i handlebars consolidate --save
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/insert', (req,res)=>{
    res.render('insert');
})
app.get('/addorEdit', (req,res)=>{
    res.render('addorEdit');
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://180720:180720@cluster0.pwhx8.mongodb.net/productDB";

app.post('/doInsert',async (req,res)=>{
    let inputId = req.body.id;
    let inputName = req.body.name;
    let inputPrice = req.body.price;
    let inputEvaluate = req.body.Evaluate;
    let newProduct = {id : inputId, name:inputName, price:inputPrice, Evaluate:inputEvaluate};


    let client= await MongoClient.connect(url);
    let dbo = client.db("productDB");
    await dbo.collection("Product").insertOne(newProduct);
    res.redirect('/');
})


//localhost:300
app.get('/',async function(req,res){
    let client= await MongoClient.connect(url);
    let dbo = client.db("productDB");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render('indext',{model:result});
})

app.get('/remove', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("productDB");
    await dbo.collection("Product").deleteOne({_id:ObjectID(id)});
    res.redirect('/');

})

const PORT = process.env.PORT || 3000;
app.listen(PORT);