const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images"});


mongoose.connect("mongodb+srv://apacicco:Amp08282003@webapps242db.oexqnxf.mongodb.net/").then(() => console.log("connected to mongodb")).catch((err)=> console.err("could not connect", err));


const jewelSchema = new mongoose.Schema({
    name: String,
    description: String,
    materials: [String],
    
    /*_id: mongoose.SchemaTypes.ObjectId*/
});



const Jewel = mongoose.model("Jewel", jewelSchema);


app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/index.html");
});

app.get("/reviews.html", (req, res)=> {
    res.sendFile(__dirname + "/reviews.html");
});

const getJewels = async(res)=>{
    const jewels = await Jewel.find();
    res.send(jewels)
};

app.get("/api/comments", (req, res)=>{
    //res.send(jewels)
    getJewels(res);
});



app.listen(3001, ()=>{
    console.log("listening server.js");
});



const validateThings = (jewel) => {
    const schema = Joi.object({
        _id:Joi.allow(""),//nothing
        materials:Joi.allow(""),
        name:Joi.string().min(1).required(),//needs to be a string at least 3 characters
        description:Joi.string().min(3).required()
    });
    return schema.validate(jewel);
};


app.post("/api/comments", upload.single("img"),(req, res) =>{
    console.log("in post");
    const result = validateThings(req.body);
    
    if(result.error)
    {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    console.log(req.body);
   

    const jewel = new Jewel({
        name:req.body.name,
        description:req.body.description,
        materials:req.body.materials.split(",")
    });


    if(req.file){
        jewel.img = "images/" + req.file.filename;
    }

    createJewel(jewel, res);
   // jewels.push(jewel);
    
    //res.send(jewel);
});


const createJewel = async(jewel, res) => {
    const result = await jewel.save();
    res.send(jewel);
}

app.put("/api/comments/:id", upload.single("img"), (req, res) => {
    console.log("put");
    const id = parseInt(req.params.id);
 

   const result = validateThings(req.body);




   if(result.error){
    res.status(400).send(result.error.details[0].message);
    return;

   };


   updateJewel(req,res);

});


const updateJewel = async(req,res) => {
  

let fieldsToUpdate = {
  name: req.body.name,
  description:req.body.description,
  materials:req.body.materials.split(",")///THIS IS THE PROBLEM
   //console.log("below jewel.materials");
  };

  if(req.file){
    fieldsToUpdate.img = "images/" + req.file.filename;
    console.log("in if");
  }

  const result = await Jewel.updateOne({_id: req.params.id }, fieldsToUpdate);
  const jewel = await Jewel.findById(req.params.id);
  res.send(jewel);
};

app.delete("/api/comments/:id", upload.single("img"), (req, res) => {
   removeJewel(res, req.params.id);
});

const removeJewel = async(res, id)=>{
    console.log("id to delete " + id);
    const jewel = await Jewel.findByIdAndDelete(id);
    res.send(jewel);
}