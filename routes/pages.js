const express=require("express");
const app=express();
const authController=require('../controllers/auth');
const router=express.Router();
const mysql=require("mysql");
const convert=require("./date");

app.use(express.json);
app.use(express.urlencoded({extended:true}));

app.set("view engine",'ejs');
const db=mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
})



router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('home', {
      user: req.user
    });
  });

router.get("/",function(req,res){
    res.render("home");
})

router.get("/register",function(req,res){
    res.render("register");
})

router.get("/login",function(req,res){
    res.render("login");
})

router.get('/profile', authController.isLoggedIn, (req, res) => {
    console.log(req.user);
    if( req.user ) {
      res.render('profile', {
        user: req.user
      });
    } else {
      res.redirect('/login');
    }
    
  })

  //for train details
  router.post('/info_form', (req, res) => {
    let {  date,source, destination } = req.body;
    let errors = [];
    console.log(date);
    // Validate Fields
    
    // if(!date) {
    //   errors.push({ text: 'Please enter Date' });
    // }
    // if(!source) {
    //   errors.push({ text: 'Please enter source' });
    // }
    // if(!destination) {
    //   errors.push({ text: 'Please enter destination' });
    // }
    if(!date && !source && !destination){
      res.status(401).render("info_form",{message:'Enter credentials'});
    }
    if(!date ){
      res.status(401).render("info_form",{message:'Enter the date'});
    }
    else if(!source){
      res.status(401).render("info_form",{message:'Enter the source'});
    }
    else if(!destination){
      res.status(401).render("info_form",{message:'Enter the destination'});
    }
    
    // Check for errors
    // if(errors.length > 0) {
    //   res.send( {
    //     errors,
    //     date,
    //     source,
    //     destination
    //   });

    // } 
    else {

      res.redirect("/info/"+date+","+source+","+destination); // these parameters are displayed in the url and they are stored in array
    
    }



    });
  //For entering source, destination and date
   router.get('/info_form',authController.isLoggedIn,(req,res)=>{
    console.log(req.user);
    if(req.user){
      res.render('info_form',{user:req.user});
    }
    else{
      res.redirect('/login');
    }
  }
)
    
  //Display all the trains that area available for the specified info   
  router.get("/info/:info",(req,res)=>{
        let info=req.params.info;

        var arr=info.split(",");
        
        // trains.findAll({
        //   where:
        // })
        var date=arr[0];
        var source=arr[1];
        var destination=arr[2];
        
        db.query('SELECT * FROM trains  WHERE source= ? AND destination= ? ',[source,destination], async (error,results)=>{
          if(error){
            console.log(error);
          }
          else{
            console.log(results);
            
            return res.render("train_details",{results:results});

          }
        // res.send(arr);

    })
    // Enter number of tickets to book
    router.get("/ticket/booking",function(req,res){
    
      res.render("booking",{numOfTickets:x})
    
    })

    var x,y;
   router.post("/ticket/booking",function(req,res){
     console.log(req.body.numOfTickets);
     console.log(req.body.trainId);
     y=req.body.trainId;
     x=req.body.numOfTickets;
     res.redirect("/ticket/booking")
   })
   

   router.get("/ticket/booking/success",function(req,res){
    res.render("book")
  })
  
  //Insert passenger info into the database
  router.post("/ticket/booking/success",function(req,res){
    // console.log(req.body);
    var name=req.body.name;
    var gender=req.body.gender;
    var age=req.body.age;
    // console.log(name);
    // console.log(date);
    var ticket_num=Math.floor(Math.random() * 1000001); //choose a random number as ticket number and store in db
    db.query('INSERT INTO ticket SET ?',{ticket_num:ticket_num},function(error,ticketEntry){
      if(error){
        console.log(error);
      }
      else{
        console.log(ticketEntry);
      }
    } 
    );

    for(var i=0;i<name.length;i++){
      db.query('INSERT INTO booked SET ?', { name:name[i],train_id: y, date:date, gender:gender[i],age:age[i], ticket_num:ticket_num }, function (error, entries) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(entries);
  
            // return res.render("register", { message: 'User registered' });
        }
      });
    }
    
    res.redirect("/ticket/booking/success")
  })
   
  });
  //display all the bookings done 
  router.get("/booked/confirmedBookings",function(req,res){
    
    db.query('SELECT DISTINCT A.train_id,A.train_name,B.ticket_num,B.date,A.source,A.destination,A.departure_time FROM trains A , booked B  WHERE A.train_id=B.train_id ', async (error,dbBookings)=>{
        if(error){
          console.log(error);
        }
        else{
          console.log(dbBookings);
        
          for(var i=0;i<dbBookings.length;i++){
            dbBookings[i].date=convert(dbBookings[i].date);
          }
          
        return res.render("confirmedBookings",{dbBookings:dbBookings});
    
      }
    // res.send(arr);

  })
      
   
})
   
// cancel tickets
 router.get("/ticket/cancel",function(req,res){
   res.render("cancel")
 })

 router.post("/ticket/cancel",function(req,res){
    var num=req.body.cancelTicket;
    db.query('DELETE from ticket where ticket_num= ?',num, async (error,results)=>{
      if(error){
        console.log(error);
      }
      else{
        console.log(results);
        
        res.redirect("/ticket/cancel");

      }
    })

 })

module.exports=router;