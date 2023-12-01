// init-mongo.js

const adminUser = process.env.MONGO_INITDB_ROOT_USERNAME || 'admin';
const adminPassword = process.env.MONGO_INITDB_ROOT_PASSWORD || 'adminPassword';
const database = process.env.MONGO_INITDB_DATABASE || 'task-manager-api';

db.createUser({
  user: adminUser,
  pwd: adminPassword,
  roles: [
    {
      role: 'readWrite',
      db: database,
    },
  ],
}); 

//default connection string from above: mongodb://myuser:mypassword@localhost:27017/task-manager-api