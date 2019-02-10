const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {ToDo} = require('../models/todo');

const firstToDo = {
    _id: new ObjectID,
    text: 'first to-do'
};
const secondToDo = {
    _id: new ObjectID,
    text: 'second to-do'
};

beforeEach((done) => {
    ToDo.remove({}).then(() => {
        ToDo.create(firstToDo, secondToDo, (err) => {
            if (err) done(err);
            done();
        })
    });
});

describe('SERVER', () => {

    describe('POST /todos', () => {

        it('should create a new todo', (done) => {
            var text = 'Random text';
            
            request(app)
                .post('/todos')
                .send({text})
                .expect((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.text).toBe(text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    ToDo.find().then((todos) => {
                        expect(todos.length).toBe(3);
                        expect(todos[2].text).toBe(text);
                        done();
                    }).catch(err => done(err));
                });
        });

    });

    describe('Update /todos/:id', () => {

        it('should update a todo', (done) => {
            var new_text = 'some new text';
            var id = firstToDo._id.toHexString();
            request(app)
                .patch(`/todos/${id}`)
                .send({
                    completed: true,
                    text: new_text
                })
                .expect((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.toDo.text).toBe(new_text);
                    expect(res.body.toDo.completed).toBe(true);
                    expect(res.body.toDo.completedAt).toBeA('number');
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    ToDo.findById(id).then((toDo) => {
                        expect(toDo.text).toBe(new_text);
                        expect(toDo.completed).toBe(true);
                        expect(toDo.completedAt).toBeA('number');
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });
        });

        it('should clear completedAt when todo is not completed', (done) => {
            var new_text = 'some new text';
            var id = firstToDo._id.toHexString();
            request(app)
                .patch(`/todos/${id}`)
                .send({ completed: false, text: new_text })
                .expect((res) => {
                    expect(res.body.toDo.text).toBe(new_text);
                    expect(res.body.toDo.completed).toBe(false);
                    expect(res.body.toDo.completedAt).toNotExist();
                })
                .end(done);
        });

    });

    describe('Delete /todos/:id', () => {

        it('should delete a todo', (done) => {
            var id = firstToDo._id.toHexString();
            request(app)
                .delete(`/todos/${id}`)
                .expect((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.toDo.text).toBe(firstToDo.text);
                })
                .end((err, res) => {
                    if (err) return done(err);

                    ToDo.findById(id).then((toDo) => {
                        expect(toDo).toNotExist();
                        done();
                    }).catch((err) => done(err));
                });                
        });

        it('should not delete a non-existent todo', (done) => {
            random_id = new ObjectID().toHexString();
            request(app)
                .delete(`/todos/${random_id}`)
                .expect(404)
                .end(done);
        });

        it('should not return 404 if id is invalid', (done) => {
            request(app)
                .delete(`/todos/1234abcd`)
                .expect(404)
                .end(done);
        });

    } );

    describe('GET /todos', () => {

        it('should fetch all todos', (done) => {
            request(app)
                .get('/todos')
                .expect((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.toDos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
        });

    });

    describe('GET /todos/:id', () => {

        it('should fetch all todos', (done) => {
            var id = firstToDo._id.toHexString();
            request(app)
                .get(`/todos/${id}`)
                .expect((res) => {
                    expect(res.status).toBe(200);
                    expect(res.body.toDo.text).toBe('first to-do');
                    done();
                }).catch((err) => done(err));
        });

        it('should throw a 404 error for invalid id', (done) => {
            request(app)
                .get('/todos/123')
                .expect((res) => {
                    expect(res.status).toBe(404);
                    done();
                }).catch((err) => done(err));
        });

        it('should throw a 404 error for non-existent id', (done) => {
            var id = new ObjectID;
            request(app)
                .get(`/todos/${id.toHexString()}`)
                .expect((res) => {
                    expect(res.status).toBe(404);
                    done();
                }).catch((err) => done(err));
        });

    });

});