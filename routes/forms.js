var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo;

  
var server = new Server('localhost', 27017, {auto_reconnect: true});
/* Todo change the database name & collection */
var db = new Db('app', server);
var CollectionName  = 'forms';

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'app' database");
        db.collection(CollectionName, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The "+CollectionName+" collection doesn't exist. Creating it with sample data...");                
            }
        });
    }
});


exports.home = function(req, res) {
   res.send("Welcome to CURD API");
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving '+CollectionName+': ' + id);
    db.collection(CollectionName, function(err, collection) {
        if (err) {
            throw err;
        }
        else {
          collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
              res.send(item);
          });
        }
    });
};

exports.findAll = function(req, res) {
    db.collection(CollectionName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addForm = function(req, res) {
    var form_data = req.body;
    console.log('Adding From: ' + JSON.stringify(form_data));
    db.collection(CollectionName, function(err, collection) {
        collection.insert(form_data, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {                
                console.log('Success: ' + JSON.stringify(result.result.ok));
                res.send(result);
            }
        });
    });
}

exports.updateForm = function(req, res) {
    var id = req.params.id;
    var form_data = req.body;
    console.log('Updating '+CollectionName+': ' + id);
    console.log(JSON.stringify(form_data));
    db.collection(CollectionName, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, form_data, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating '+CollectionName+': ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(form_data);
            }
        });
    });
}

exports.deleteForm = function(req, res) {
    var id = req.params.id;
    console.log('Deleting '+CollectionName+': ' + id);
    db.collection(CollectionName, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}