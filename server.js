const express  = require("express")
const MongoClient =  require('mongodb').MongoClient
const bodyParser = require('body-parser')
const app  = express()

MongoClient.connect('mongodb+srv://webhwmongodb:mongodbhw@webhwcluster.s63kzgv.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db= client.db('test_quotes')
    const quotesCollection = db.collection('quotes')

    app.set('view engine', 'ejs')

    app.listen(8000,()=>{
        console.log("Server started on port 8000")
    })
    
    app.get('/',(req,res)=>{
        db.collection('quotes')
        .find()
        .toArray()
        .then(result=>{
            res.render('index2.ejs',{quotes: result})
        })
        .catch()
    })
    
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())
    
    app.post('/quotes',(req,res)=>{
        quotesCollection
        .insertOne(req.body)
        .then(result=>{
            res.redirect('/')
        })
        .catch(error=>console.log(error))
    })

    app.put('/quotes',(req,res)=>{
        quotesCollection.findOneAndUpdate(
            {name:'HanChu'},
            {
                $set: {
                    name:req.body.name,
                    quote: req.body.quote,
                },
            },
            {
                upsert:true,
            }
        )
        .then(result=>{
            res.json('Success')
        })
        .catch(error=>console.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne({ name: req.body.name })
        .then(result => {
            if(result.deletedCount === 0){
                return res.json('No quote to delete')
            }
            res.json("Deleted Darth Vader's quote")
        })
        .catch(error => console.error(error))
    })
    
  })
  .catch(error => console.error(error))
