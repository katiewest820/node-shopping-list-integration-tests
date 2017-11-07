const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe ('recipes', function(){
	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});
	it('should check to see if GET requests are successful', function(){
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.length.should.be.above(0);
			res.body.forEach(function(item){
				item.should.be.a('object');
				item.should.have.all.keys(
					'id', 'name', 'ingredients');
			});
		});
	});
	it('should check to see if POST requests are successful', function(){
		const newItem = {name: 'ice cream', ingredients: ['milk', 'sugar', 'ice']};
		return chai.request(app)
		.post('/recipes')
		.send(newItem)
		.then(function(res){
			res.should.have.status(201);
			res.should.be.json;
			res.body.id.should.not.be.null;
			res.body.should.be.a('object');
			res.body.should.include.keys(
					'id','name', 'ingredients');
			res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
			});
		});
	
	it('should check to see if PUT requests are successful', function(){
		const newVal= {
			name: 'boiled white brown',
			ingredients: ['1 cup white brown', '2 cups water', 'pinch of salt']
		}
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			newVal.id = res.body[0].id
		});
		return chai.request(app)
		.put(`/recipes${newVal.id}`)
		.then(function(res){
			res.should.have.status(204);
			res.should.be.json;
		});
	});	
	it('should check to see if DELETE reqeuests are successful', function(){
		const deleteVal = {
			name: 'milkshake'
		}
		return chai.request(app)
		.get('/recipes')
		.then(function(res){
			deleteVal.id = res.body.id;
		});

		return chai.request(app)
		.delete(`/recipes/${deleteVal.id}`)
		.then(function(res){
			res.should.have.status(204);
		});
	});	
});
 