const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server', err);
	}
	console.log('Connected to MongoDB server');

	db.collection('Users').findOneAndUpdate({
		name: 'Sahil Badhan'
	}, {
		$set: {
			name: 'Avinash Kaushik'
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	}, (err) => {
		console.log('Users could not be updated', err);
	});

	db.close();
});