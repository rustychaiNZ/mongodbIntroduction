# MongoDB Introduction
## How To Set Up
1. Clone into www folder of a local host of your choosing
2. Next, you will need to navigate to the file using gitbash or terminal
3. Once you have CDed into your directory, in the terminal, type **npm i** to install all of the npm packages
4. Create a **config.json** file and in that file copy across config-copy.json 
5. Go to https://www.mongodb.com/ and get the URI connection and enter your username, password and mongo_cluster_name into the appropriate fields
6. Type in your terminal **nodemon -L index.js** in vagrant or **nodemon index.js** in a non-vagrant set up to boot up the server
7. Next, you will want to open the file on your browser by either going to https://localhost:3000 **or** 192.168.33.10:3000
  * As long as you are on port 3000 then you should be able to view the app
8. Endpoints:

Endpoints    |Description                     |Method|
-------------|--------------------------------|------|
/registerUser|**post** the new user to db     |POST  |
/allUsers    |**get** all users from db       |GET   |
/loginUser   |check for existing user to login|Post  |