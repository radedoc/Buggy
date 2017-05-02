    app.post('/save', function(req, res){
    var email = req.body.email
    var fileName = req.body.fileName
    var contents = req.body.contents
    saveFile(email, fileName, contents, savetoDatabase, res)
  })

    app.post('/deleteFile', function(req, res){
    var email = req.body.email
    var fileName = req.body.fileName
    deleteFile(email, fileName, removeFile, res)
  })

    app.post('/downloadFile', function(req, res){
    var email = req.body.email
    var fileName = req.body.fileName
    console.log(email);
    download(email, fileName, sendToDown, res);
  })



/************** function that OPENS a file from a users account ***************/
function openFile(username, filename, callbackSucc, req) {
    // Connect to the Server
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Database connection established');
      }

        var userDB = db.collection('users')
        //CHECK IF DB CONTAINS ACCOUNT WITH THAT EMAIL BEFORE CREATING NEW ACCOUNT
        userDB.find({'username' : username}).toArray(function(err, result) {
          if (err) {
              console.log(err);
          } else if (result.length) {
            console.log("Found account" + username)
            var dictionary = result[0]["files"];
            var file = dictionary[filename]
            //send code so that the it can be set into the editor
          } else {
                console.log("no files available of that name")
                return 0
            }
          })
      });
    console.log("sorry, you are currently not logged into an account :(")
}

/********************************************************************************/



/*********************** SAVE FUNCTIONS HERE *****************************************/
function saveFile(email, filename, contentString, callbackSucc, res) {
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
            console.log("Found account" + email)
              callbackSucc(result[0]["files"], filename, contentString, userDB, email)
          } else {
                console.log("no files available of that name")
                return 0
            }
          })
      });
    console.log("sorry, you are currently not logged into an account :(")
    return 0;
}

/********** send to downloads link (HTML5 solution) *****************/
function savetoDatabase(fileDict, filename, contentString, userDB, email) {
  var dictionary = fileDict;
  dictionary[filename] = contentString;

  userDB.update(
    {'email' : email},
    {'$set' : 
      {
        'files' : dictionary
      }
    }
  )

}

/*********************************************************************************/

/************** function that DELETES a file from a users account ***************/
function deleteFile(email, filename, callbackSucc, req) {
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
            console.log("Found account" + email)
              callbackSucc(result[0]["files"], filename, userDB, email)
          } else {
                console.log("no files available of that name")
                return 0
            }
          })
      });
    console.log("sorry, you are currently not logged into an account :(")
}

/**************** call back function for deleting file **************/
function removeFile(fileDict, filename, userDB, email) {
  var dictionary = fileDict;
  delete dictionary[filename]
  userDB.update(
    {'email' : email},
    {'$set' : 
      {
        'files' : dictionary
      }
    }
  )
}

/********************** DOWNLOAD FILES *********************************/

/************** function that downloads a file from a users account ***************/
function download(email, filename, callbackSucc, req) {
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
            console.log("Found account" + email)
              callbackSucc(result[0]["files"], filename, userDB, email)
          } else {
                console.log("no files available of that name")
                return 0
            }
          })
      });
    console.log("sorry, you are currently not logged into an account :(")
}

/********** send to downloads link (HTML5 solution) *****************/
function sendToDown(fileDict, filename, userDB, email) {
  var dictionary = fileDict;
  var contents = dictionary[filename];
  return contents;
}
