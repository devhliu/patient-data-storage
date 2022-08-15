# patient-data-storage
A web app that stores patient data for a therapist

# Technologies used
<b>Backend</b>
- Flask: https://flask.palletsprojects.com/en/2.1.x/
- PostgreSQL: https://www.postgresql.org

<b>Frontend</b>
- React: https://reactjs.org

<b>Styling</b>
- Material UI: https://mui.com/

# How to run
- Open the ```credentials.json``` file in the root directory and fill the ```SECRET_KEY``` and ```DATABASE_URL``` values

- You can put whatever you want in the secret key
- To get the database url, you need to create a postgreSQL instance the way you prefer and write the url manually this way: ```postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]```

- Run the api by typing ```python app.py``` in a terminal
- Run the client by opening another terminal and going to the client directory: ```cd client``` and typing ```npm start```
