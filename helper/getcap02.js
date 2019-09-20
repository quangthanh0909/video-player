const VideoModel = require('../models/video');
const Cap2Model = require ('../models/cap2');
const multer = require('multer');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addvideo = (req,res) =>{
  Cap2Model.find().then((data) => {
    console.log(data);
    res.render('addvideo',{data})
  })
}
// Setting UP Multer 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()  + "-" + file.originalname)
  }
});  
var upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
      console.log(file);
      if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" ){
          cb(null, true)
      }else{
          return cb(new Error('Only image are allowed!'))
      }
  }
}).single("avatar");

// End setup multer 

// Save videoId into menu cap 2 
const savevideoid = (_id,videoid) => {
    Cap2Model.findByIdAndUpdate(
       _id,
       {$push:{mangvideos:videoid}}
       ).then((res) => {
         console.log("save data video thanh cong",res);
        }).catch((err) => {
          console.log("Get Error",err);
          
       })
}

const xuly = (req,res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading."); 
    } else if (err) {
      console.log("An unknown error occurred when uploading." + err);
      res.json({OK:false});
    }else{
        console.log("Upload is okay");
        console.log(req.body);
        const idcap02 = req.body.cap2;
        const videoid = req.body.videoid;
        const imageUrl = req.file.filename;
        const video = new VideoModel({videoid,imageUrl});
        video.save().then((video) => {
           savevideoid(idcap02,video._id);
           res.redirect('/admin/addvideo')
        });
    }
    
});  
}
// Get Videos of ID_cap02
const getvideosByCap2 = (req,res) => {
   const id = req.params.id;
     
   Cap2Model.aggregate([
     {
       $match:{_id:ObjectId(id)}
     },
     {$lookup:{
       from:      "videos",
       localField:"mangvideos",
       foreignField:"_id",
       as:"danhsachvideo"

     }}
   ],(err,data) => {
    if(err){ 
      console.log("List Cap1 error: " + err); 
      res.json({kq:0});
  }
    else{ 
      console.log("List Cap1 successfully."); 
      res.json({kq:1,data});
  }
   })
}

module.exports =  {addvideo,xuly,getvideosByCap2}
    