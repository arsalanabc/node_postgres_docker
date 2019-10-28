# Project Description
Create a service to collect different sizes for the shoes and calculate their TrueToSize. TrueToSize for a shoe is an average of all the sizes available in that shoe model.

This app is developed with NODE.JS and uses Postgres as the database. Also, I have containized the app to run on any machine with docker-compose.

## Setup: 
NOTE: Your machine must have Node:10, docker and docker-compose installed.
- Create .env and .evn.test files in root app directory with the following variables
  - POSTGRES_USER=user
  - POSTGRES_PASSWORD=password
  - POSTGRES_DB=db
  - PORT=3000
  - DB_PORT=5432
    * add the following to .env.test file
    * APP_URL=http://localhost:3001 
- ### Test the app in dev mode
- Download the project
- Cd into the app/test directory
- Run `docker-compose up` to setup testing database
- Run `npm install` to install dependencies
- Run the app in dev mode with `npm run dev`
- For unit/integration test, run `npm test` from app folder
- Once the db and app are running, run `npm run test-e2e` for E2E tests
- App should be running at `http://127.0.0.1:3001/`
- ### Run in production mode
- Download the project
- Cd into the app directory
- Run `docker-compose build app` to build the docker image
- Run `docker-compose up` to setup testing database
- App should be running at `http://127.0.0.1:8080/`

*You can also some the app in a container*

# End points
- `/get` to show all the inserted shoes
- `/shoe/insert/:shoeName` to insert a new shoe model *shoeName*
- `/:shoeName/addsize/5` to add size 5 for shoe model *shoeName*
- `/:shoeName/truetosize`to get TrueToSize for mode *shoeName*

# LOGS
- Logs from the containers are bind to in app/var/log 