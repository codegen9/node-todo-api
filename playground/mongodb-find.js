const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server', err);
	}
	console.log('Connected to MongoDB server');

	db.collection('Users').find({name: 'Sahil Badhan'}).toArray().then((users) => {
		console.log(users);
	}, (err) => {
		console.log('Users could not be fetched', err);
	});

	// db.collection('Users').find({name: 'Sahil Badhan'}).toArray((err, users) => {
	// 	if (err) {
	// 		return console.log('Users could not be fetched', err);
	// 	}
	// 	console.log(users);
	// });

	db.close();
});