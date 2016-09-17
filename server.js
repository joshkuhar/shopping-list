var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
    for (var itemId in this.items){
      if (id == this.items[itemId].id){
        this.items.splice(itemId, 1);
      }
    }
};

Storage.prototype.edit = function(name, id) {
    for (var itemId in this.items){
      if (id == this.items[itemId].id){
        this.items[itemId].name = name;
      }
    }
    return this.items[itemId];
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    //console.log(response);
    response.status(200).json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
	if (!request.body) {
		return response.sendStatus(400);
	}
	var item = storage.add(request.body.name);
	response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    if (isNaN(parseInt(request.params.id))) {   
        return response.status(404).send("No dice");
    }
    storage.delete(request.params.id);
    //console.log(response);
    response.status(200).json(storage.items);
    //response.json(storage.items);
});

app.put('/items/:id', jsonParser, function(request, response){
    var name = request.body.name;
    storage.edit(name, request.params.id);
    //console.log(storage.items);
});
app.listen(8080);
//app.listen(process.env.PORT);

exports.app = app;
exports.storage = storage;
