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

    describe('GET /todos', () => {

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