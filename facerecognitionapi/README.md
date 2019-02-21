# Backend of the project.

**The dependencies for successfully running the server are-**
* express.js(framework for node.js)
* bodyParser.js(access the contents of request.body)
* cors.js(to get rid of "access control origin" problem)
* knex.js(connect the database to the server)
* nodemon(prevents restarting the server everytime we make a change)

**The database used is PostgreSQL.** We need to have PostgreSQL installed and an instance running locally at port 127.0.0.1(you can change the port in server.js)

After successfully installing all the dependenies and creating an instance of the database,open a new console in the current directory and execute ````npm start````. The server should start running on the port number as specified on server.js.
