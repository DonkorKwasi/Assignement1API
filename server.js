	/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ____kwasi Donkor__________________ Student ID: ______103434171________ Date: ____1/21/2023____________
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 



const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config(); 
const app = express();
app.use(cors());
app.use(express.json());
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`server listening on: ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});



app.get('/', function(req,res){
    res.json({message: "API Listening"});
})

app.post('/api/movies',  async function(req,res) {
    try{
        console.log(req.body);
 await db.addNewMovie(req.body);
res.status(201);


    res.json({message: "success"});

    }
    catch(error)
    { 
    
        console.log(error);
        res.status(500);
    }
})
app.get('/api/movies', async function(req,res){
    console.log(req.query.page);
    console.log(req.query.perPage);
    if(req.query.page === undefined)
    {
     res.status(500)
     res.json({message: "Error page required"});
    }
    else if(req.query.perPage  === undefined)
    {
        res.status(500)
        res.json({message: "Error perPage required"});
    }
    else{
        var movie;
        if(req.query.title === undefined)
        {
            try{
         movie = await db.getAllMovies(req.query.page,req.query.perPage );
         if(movie == undefined)
            {
                res.status(204)
            }
            else{
         res.json(movie);
         res.status(201)
            }
            }
            catch(err)
            {
                console.log(err);
                res.status(500)
            }

        }
        else
        {
            try {

            movie = await db.getAllMovies(req.query.page,req.query.perPage, req.query.title);
            if(movie == undefined)
            {
                res.status(204)
            }
            else{
            res.json(movie);
            res.status(201)
            }
                    } 
                    catch(err)
                    {
                        console.log(err);
                        res.status(500)
                    }
                
                
                }


    }

})

app.get('/api/movies/:id',  async function(req,res){

    try{
  var movie=   await db.getMovieById(req.params.id)
    }
    catch(err)
    {
        res.json({message: "No valid Id given"});
    }
    if(movie == undefined)
    {
        res.status(204)
        res.json({message: "No valid Id given"});
    }
    else{
        res.json(movie);
        res.status(201);
    }
})

app.put('/api/movies/:id',  async function(req,res){
    try{
    var movie=   await db.updateMovieById(req.body,req.params.id)
    }
    catch(err)
    {
        res.json({message: "update failed"});
    }
  console.log(movie);
      if(movie.acknowledged == false)
      {
        res.json({message: "update failed"});
          res.status(204)
      }
      else{
          res.json({message: "success"});
          res.status(201);
      }
  })
  

app.delete('/api/movies/:id',  async function(req,res){
    var movie=  await db.deleteMovieById(req.params.id);
    console.log(movie);
    if(movie.deletedCount == 0)
    {
      res.json({message: "delete failed, no such movie exists"});
        res.status(204)
    }
    else{
        res.json({message: "success"});
        res.status(201);
    }
    
})
