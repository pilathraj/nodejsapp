var express = require('express'),
  bodyParser = require("body-parser"),
  forms = require('./routes/forms');
 
 
var app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies     
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
 
 /* Allow Cross  Origin*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 

app.get('/', forms.home);
app.get('/forms', forms.findAll);
app.get('/forms/type/:typeid', forms.findAllByTypeId);
app.get('/forms/:id', forms.findById);
app.post('/forms', forms.addForm);
app.put('/forms/:id', forms.updateForm);
app.delete('/forms/:id', forms.deleteForm);


app.listen(3000);
console.log('Listening on port 3000...');