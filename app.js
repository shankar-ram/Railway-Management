//jshint esversion:6
const express=require("express");
const path=require("path");
const mysql=require("mysql");
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");

dotenv.config({path:'./.env'});

const app=express();
const db=mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})



const publicDirectory=path.join(__dirname,"./public");
app.use(express.static(publicDirectory));

//for parsing the object thats received after submitting the form
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.set("view engine","ejs");

db.connect(function(error){
    if(error){
        console.log(error);
    }
    else{
        console.log("MYSQL connected");
    }
})

// trains.sync({force:true}).then(() => {
//     console.log('table created');
// });

app.use("/",require("./routes/pages"));
app.use("/auth",require("./routes/auth"));

app.listen(3000,function(){
    console.log("Server started on port 3000");
})