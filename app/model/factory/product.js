const db = require('../../../config/connection');

const Product = function(){
	this.id;
	this.name;
	this.type;
	this.color;
	this.size;
	this.amount = 0;
	this.pictures = [];
};

Product.save = async (product) => {
	return new Promise(async (resolve) => {
		let query = "INSERT INTO lfsdb.products (cod, name, type, color, size) VALUES ('"+product.cod+"', '"+product.name+"','"+product.type+"','"+product.color+"','"+product.size+"');";
		let user = await db(query);
		resolve(user);
	});
};

module.exports = Product;