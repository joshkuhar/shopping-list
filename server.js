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
        this.items.splice(id, 1);
      }
    }
};

Storage.prototype.edit = function(name, id) {
    var item = {name: name, id: id};
    this.delete(id);
    this.items.push(item);
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
	if (!request.body) {
		return response.sendStatus(400);
	}
	var item = storage.add(request.body.name);
	response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    storage.delete(request.params.id);
    response.json(storage.items);
    console.log(storage.items);
});

app.put('/items/:id', jsonParser, function(request, response){
    var name = storage.items[request.params.id].name;
    storage.edit(name, request.params.id);
    console.log(storage.items);
});

app.listen(8080);