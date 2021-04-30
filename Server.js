const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/PROJECT2',{ useUnifiedTopology: true },(err, database) => {
    if(err) return console.log(err)
    db = database.db('PROJECT2')
    app.listen(5050,() => {
        console.log('Listening at port number 5050')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req,res) =>{
    db.collection('NIKE').find().toArray( (err,result) => {
        if(err) return console.log(err)
    console.log(result);
    res.render('homepage.ejs', {data : result})
    })
})

app.get('/create',(req,res)=> {
    res.render('add.ejs')
})

app.get('/update-Stock',(req,res)=> {
    res.render('update.ejs')
})

app.get('/deleteproduct',(req,res)=> {
    res.render('delete.ejs')
})

app.post('/AddData',(req,res) => {
db.collection('NIKE').save(req.body, (err,result) => {
    if(err) return console.log(err)
res.redirect('/')

})
})

app.post('/update',(req,res) => {
    db.collection('NIKE').find().toArray((err,result) => {
		if (err)
			return console.log(err)
		for(var i=0;i<result.length;i++)
		{
			if(result[i].pid==req.body.pid)
			{
				s = result[i].pstock
				break
			}
		}
    db.collection('NIKE').findOneAndUpdate({pid:req.body.pid},{$set:{pstock: parseInt(s) + parseInt(req.body.pstock)}},
		(err,result) =>{
		if(err)
			return res.send(err)
		console.log(req.body.pid +' stock updated')
    res.redirect("/");
		})
    })
})


app.post('/delete',(req,res) => {
    db.collection('NIKE').findOneAndDelete({pid:req.body.pid},(err,result)=>{
        if(err)
        return console.log(err)
        res.redirect('/')
    })
})



