const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOne, 
    userTwo, 
    taskOne, 
    taskTwo,
    taskThree,
    setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'        
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should not create task with invalid completed field', async () => {
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'My test task',
        completed: '102'
    })
    .expect(400)
})

test('Should not create task with invalid description field', async () => {
    await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: ''
    })
    .expect(400)
})

test ('Should return all tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should be able to delete user task', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        const task = await Task.findById(taskOne._id)
        expect(task).toBeNull()
})

test('Should not be able to delete tasks if unathenticated', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
})

test('Should not be able to delete tasks of other users', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})