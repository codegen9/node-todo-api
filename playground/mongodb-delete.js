const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server', err);
	}
	console.log('Connected to MongoDB server');

	db.collection('Users').findOneAndDelete({name: 'Sahil Badhan'}).then((result) => {
		console.log(result);
	}, (err) => {
		console.log('User could not be deleted', err);
	});

	// db.collection('Users').deleteMany({name: 'Sahil Badhan'}).then((result) => {
	// 	console.log(result);
	// }, (err) => {
	// 	console.log('Users could not be deleted');
	// });

	db.close();
});