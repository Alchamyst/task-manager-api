const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOne, 
    userTwo, 
    taskOne, 
    taskTwo,
    taskThree,
    taskFour,
    taskFive,
    taskSix,
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
    expect(response.body.length).toEqual(5)
})

test ('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(1)
    expect(response.body[0].completed).toEqual(true)
})

test ('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(4)
    expect(response.body[0].completed).toEqual(false)
})

test ('Should return tasks sorted by description', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=description:asc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const sortedTasks = await Task.find({owner: userOne._id}).sort('description')
    expect(JSON.stringify(response.body)).toMatch(JSON.stringify(sortedTasks))
})

 test ('Should return tasks sorted by completed', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=completed:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const sortedTasks = await Task.find({owner: userOne._id}).sort('-completed')
    expect(JSON.stringify(response.body)).toMatch(JSON.stringify(sortedTasks))
    expect(sortedTasks[0]._id).toEqual(taskTwo._id)
 })

test ('Should return tasks sorted by createdAt', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=createdAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const sortedTasks = await Task.find({owner: userOne._id}).sort('-createdAt')
    expect(JSON.stringify(response.body)).toMatch(JSON.stringify(sortedTasks))
    expect(sortedTasks[0]._id).toEqual(taskSix._id)
})

test ('Should return tasks sorted by updatedAt', async () => {
    const task = await Task.findOne({_id: taskTwo._id})
    task.description = 'Recently updated task'
    await task.save()

    const response = await request(app)
        .get('/tasks?sortBy=updatedAt:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const sortedTasks = await Task.find({owner: userOne._id}).sort('-updatedAt')

    expect(JSON.stringify(response.body)).toMatch(JSON.stringify(sortedTasks))
    expect(sortedTasks[0]._id).toEqual(taskTwo._id)
    expect(sortedTasks[0].description).toEqual('Recently updated task')  
})

test ('Should fetch a page of tasks', async () => {
    const response = await request(app)
        .get('/tasks?limit=2&skip=2')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(2)
    expect(response.body[0]._id).toMatch(taskFour._id.toString())
    expect(response.body[1]._id).toMatch(taskFive._id.toString())  
})

test('Should fetch user task by id', async () => {
    const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(JSON.stringify(task)).toMatch(JSON.stringify(response.body))
})

test('Should not fetch user task by id if unathenticated', async () => {
    const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

test('Should not fetch other users task by id', async () => {
    const response = await request(app)
    .get(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)  
})

test ('Should update users task by id', async () => {
    const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ "description": "Test my tasks are updating by id" })
    .expect(200)
    const task = await Task.findById(taskOne._id)
    expect(JSON.stringify(task)).toMatch(JSON.stringify(response.body))
    expect(task.description).toEqual('Test my tasks are updating by id')
})

test ('Should not update other users tasks', async () => {
    const response = await request(app)
        .patch(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            completed: true
        })
        .expect(404)
    const task = await Task.findById(taskThree._id)
    expect(task.completed).toEqual(false)
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