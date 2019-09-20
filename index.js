var express = require("express");
var app = express();
const handleRequest = require('./helper/getcap02');

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://quangthanh0909:mypassword@cluster0-hvfpj.mongodb.net/videos?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Mongodb connect error!!! " + err);
    }else{
        console.log("Mongodb connected successfully.");
    }
});

app.get("/", function(req, res){
    Cap1.aggregate([{
        $lookup: {
            from:           'cap2',
            localField:     'mang',
            foreignField:   '_id',
            as: 'danhsach'
        }
    }], function(err, data){
        if(err){ 
            console.log("List Cap1 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            res.render("trangchu",{data});
        }
    });
});

app.get("/admin", function(req, res){
    res.render("admin");
});

app.get("/admin/addvideo",handleRequest.addvideo);

app.post('/xuly',handleRequest.xuly);

app.get('/:id',handleRequest.getvideosByCap2);

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var Cap1 = require("./models/cap1");
var Cap2 = require("./models/cap2");
const VideoModel = require('./models/video')

app.post("/cap1", function(req, res){
    var TheThao = new Cap1({
        name: req.body.name,
        mang: []
    });
    TheThao.save(function(err){
        if(err){ 
            console.log("Save Cap1 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("Saved Cap1 successfully."); 
            res.json({kq:1});
        }
    });
});

app.post("/cap2", function(req, res){

    var BongDa = new Cap2({
        name: req.body.name
    });

    BongDa.save(function(err){
        if(err){ 
            console.log("Save Cap2 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("Saved Cap2 successfully."); 
            Cap1.findOneAndUpdate(
                {_id: req.body.id1}, 
                { $push: {mang:BongDa._id} }, 
                function(err){
                    if(err){ 
                        console.log("Update mang Cap1 error: " + err); 
                        res.json({kq:0});
                    }
                    else{ 
                        console.log("Updated mang Cap1 successfully."); 
                        res.json({kq:1});
                    }
                }
            );
        }
    });

});

app.post("/list/cap1", function(req, res){

    Cap1.aggregate([{
        $lookup: {
            from:           'cap2',
            localField:     'mang',
            foreignField:   '_id',
            as: 'danhsach'
        }
    }], function(err, mang){
        if(err){ 
            console.log("List Cap1 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("List Cap1 successfully."); 
            res.json({kq:1, ds:mang });
        }
    });

});

app.post("/list/cap2", function(req, res){

    Cap1.aggregate([{
        $lookup: {
            from:           'video',
            localField:     'mang',
            foreignField:   '_id',
            as: 'danhsach'
        }
    }], function(err, mang){
        if(err){ 
            console.log("List Cap1 error: " + err); 
            res.json({kq:0});
        }
        else{ 
            console.log("List Cap1 successfully."); 
            res.json({kq:1, ds:mang });
        }
    });

});

app.get('/xulyvideo',(req,res) => {
    
})


