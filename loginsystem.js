/***************** ONLY ADDED THIS (BELOW) **********************************************/
  app.get('//', function(req, res, next) {
    var loggedIn = checkLoginStatus(req);
    if (loggedIn) res.sendFile(__dirname + '/main.html');
    else res.sendFile(__dirname + '/about.html');;
  });

  app.get('/!', function(req, res, next) {
    res.cookie("user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC")
    res.redirect("/")
  });

  app.post('/newlog', function(req, res){
    var email = req.body.email
    var password = req.body.password
    loginAccount(email, password, redirectHome, redirectEmailCollision, res)
  })

  app.post('/create', function(req, res){
    var email = req.body.email
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var password = req.body.password
    createAccount(email, password, firstName, lastName, redirectHome, redirectEmailCollision, res)
  })

/***************** ONLY ADDED THIS (ABOVE)**********************************************/


/***************** ONLY ADDED THIS (BELOW)**********************************************/

function createAccount(email, password, firstName, lastName, callbackSucc, callbackFail, res) {

  var salt = bcrypt. genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);

  // Connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Database connection established');
    }

      var userDB = db.collection('users')
      //CHECK IF DB CONTAINS ACCOUNT WITH THAT EMAIL BEFORE CREATING NEW ACCOUNT
      userDB.find({'email' : email}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            callbackFail(res)
        } else {
              var userJSON = {"email": email, "password": hash, "firstName": firstName, "lastName": lastName, "files": []}
            userDB.insert(userJSON, function(err, result) {
            if (err) {
                console.log(err);
                } else {
                  console.log(firstName + " was added!")
                  callbackSucc(res, email)
                }
            })
          }
        })
    });
}

function loginAccount(email, password, callbackSucc, callbackFail, res) {

  // Connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Database connection established');
    }

      var userDB = db.collection('users')
      userDB.find({'email' : email}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            if (bcrypt.compareSync(password, result[0]["password"]) != true) {
              console.log("uh oh")
              console.log(result[0]["password"])
              callbackFail(res)
            }
            else callbackSucc(res, email)
            
        } else {
            callbackFail(res)
          }
        })
    });

}

function redirectHome(res, email) {
  if (email.length == 0) {
    res.send("error") 
  }
  else {
    var cookie = "user_email=" + email + ";"
    res.cookie(cookie);
    res.redirect("/main.html")
  }
}

function redirectEmailCollision(res) {
  console.log("here")
  var link = "/login"
  res.redirect(link)
}

function checkLoginStatus(req) {
  var cookie = req.cookies;
  if (cookie["user_email"] == undefined) return false
  if (cookie["user_email"].length == 0) return false
  else return true
}

/***************** ONLY ADDED THIS (ABOVE)**********************************************/