const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const sql = new Sequelize({
	dialect: 'sqlite',
	storage: './mydb.sqlite',
});

const Books = sql.define('Book', {
	title: DataTypes.STRING,
	price: DataTypes.INTEGER,
	}, 
	// {
	// freezeTableName: true, // DataBase-i anuny hognaki chsarqel ev toxnel mer dracy
	// timestamps: false, // Chi stexcum createdAt ev updatedAt dashtery
 	//}
);

sql.sync()
	.then(() => {
		console.log('Sync is done');
	});

app.post('/', async (req, res) => {
	const { title, price } = req.body;
	const book = await Books.create({ title, price });
	res.send(book);
});

app.get('/', async (req, res) => {
	const { minprice } = req.query;

	const result = await Books.findAll({
		where: { price: {
				[Op.gte]: minprice
			} 
		}, // gte === greater or equal
	});
	
	res.send(result);
});

app.get('/:id', async (req, res) => {
	const { id } = req.params;
	const result = await Books.findByPk(id)

	if(!result) {
		return res.send({});
	}
	res.send(result);
});


app.delete('/:id', async (req, res) => {
	const { id } = req.params;
	const result = await Books.findByPk(id);
	await result.destroy();
	res.send('Successfully');
});

app.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const result = await Books.findByPk(id);
	result.title = req.body.title;
	result.price = +req.body.price;

	result.save();

	res.send(result);
});

app.listen(3000, () => {
	console.log('Server is running on 3000 port');
});
