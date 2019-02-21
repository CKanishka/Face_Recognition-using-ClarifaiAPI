const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '12345678',
      database : 'facerecognition'
    }
  });

  
const app = express()

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password:'cookies',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name: 'Sally',
            password:'bananas',
            email:'sally@gmail.com',
            entries:0,
            joined: new Date()
        }
    ] 
}

app.use(cors());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send(database.users);
})

app.post('/signin',(req,res)=>{
   db.select('email','hash').from('login')
   .where('email','=',req.body.email)
   .then(dbresponse => {
       if(dbresponse[0].hash==req.body.password){
           return db.select('*').from('users')
           .where('email','=',req.body.email)
           .then(user => {
               res.json(user[0])
           })
           .catch(err=>res.status(400).json('Unable to get user'))
       }else {
           res.status(400).json('Wrong credentials')
       }
   })
})

app.post('/register',(req,res)=>{
    const {email,password,name}=req.body;
    
    db.transaction(trx => {
        trx.insert({
            hash:  password,
            email: email
        })
        .into('login')
        .returning('email')
            .then(loginemail => {
             return trx('users').insert({
                email: loginemail[0],
                name: name,
                joined: new Date() 
            })
            .returning('*')  
                .then(dbresponse => {
                    res.json(dbresponse[0])
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)  
    })
    .catch(err => res.status('400').json(err))
})

app.put('/image',(req,res)=>{
    const {id} = req.body;
    db('users').where('ID','=',id)
    .increment('entries',1)
    .returning('entries')
        .then(dbresponse => {
            res.json(dbresponse[0])
        })
        .catch(err => res.status(400).json(err))
})

app.get('/profile/:id',(req,res) => {
    const {id} = req.params;
    db.select('*').from('users').where({ID:id})
        .then(dbresponse => {
            if(dbresponse.length){
                res.json(dbresponse[0])
            } else{
                res.status('400').json('Not found')
            }
        })
        .catch(err => res.status('400').json(err))
})
app.listen(3001,()=>{
    console.log('app is running on port 3001');
})

