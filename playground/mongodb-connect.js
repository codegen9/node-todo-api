const MongoClient = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to the MongoDB server');

	// db.collection('ToDos').insertOne({text: 'Do something, do anything'}, (err, result) => {
	// 	if (err) {
	// 		return console.log('Insertion failed', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	db.collection('Users').insertOne({name: 'Sahil Badhan', age: 26}, (err, result) => {
		if (err) {
			return console.log('Some error occurred', err);
		}
		console.log('User created: ', JSON.stringify(result.ops[0], undefined, 2));
	});

	db.close();
});