var express = require('express')
var app = express();
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var MongoClient =mongodb.MongoClient
app.set("view engine","pug")
app.get("/table",function(req,res){
	var connection = new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
	if(err){
		console.log("connection err ::",err);
	}
	else{		
		var db = con.db('westagile');
		// var key ='623d54a2ae5f13355ad56b9a'
		db.collection('unicorns').find().toArray(function(err,data){
			if(err){
				console.log("err :: ",err)
			}
			else{
				res.render("unicorntable",{items:data});
				con.close();
			}
		})
	}
})
app.get("/update/:key",function(req,res)
{
	console.log("req body",req.query);
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('westagile');
            db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    var ind=req.params.key;
                    var temp={name:data[ind].name};
                    var a=req.query.loves;
                    var t=a.split(",");
                    var newdetails={$set:{name:req.query.name,dob:req.query.dob,loves:t,weight:req.query.weight,gender:req.query.gender,vampires:req.query.vampires}};
                     db.collection('unicorns').updateOne(temp,newdetails,function(err,data)
                    {
                        if(err)
                        {
                            console.log("update error::",err);
                        }
                        else{
                            res.redirect("/table");
                            con.close();
                        }
                    })
                }
            })
        }
    })
})
app.get("/edit/:key",function(req,res){
	console.log(req.params.key)
	console.log("into edit")
	var connection = new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
		if(err){
			console.log("err :: ",err);
		}
		else{
			var db= con.db('westagile');
			db.collection('unicorns').find().toArray(function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    //res.json(data);
                    res.render("edittable",{unicorns:data,index:req.params.key})
                    con.close();
                }
            })


		}
	})
})

})
app.get("/delete/:key",function(req,res){
	console.log(req.params.key)
	var connection= new MongoClient("mongodb://127.0.0.1:27017");
	connection.connect(function(err,con){
		if(err){
			console.log("err ",err);
		}
		else{
			var db = con.db("westagile");
			db.collection('unicorns').deleteOne({_id: new mongodb.ObjectID(req.params.key.toString())},function(req,res){
				console.log("deleted");
				
			})	
		res.redirect("/table")
		}
	})
})
app.get("/add",function(req,res)
{
    res.render("insert");
})
app.get("/insert",function(req,res)
{
    var connection=new MongoClient("mongodb://127.0.0.1:27017");

    connection.connect(function(err,con)
    {
        if(err)
        {
            console.log("Connection err::",err)
        }
        else{
            var db=con.db('westagile');
            var a=req.query.loves;
            console.log(a);
            var t=a.split(",");
            var temp={name:req.query.name,dob:req.query.dob,loves:t,weight:req.query.weight,gender:req.query.gender,vampires:req.query.vampires}
            db.collection('unicorns').insertOne(temp,function(err,data)
            {
                if(err)
                {
                    console.log("err::",err);
                }
                else{
                    res.redirect("/table");
                    con.close();
                }
            })
        }
    })
})
app.listen(3400)