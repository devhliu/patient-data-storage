# Patient data storage
Um aplicativo que salva dados de pacientes para terapeutas

# Tecnologias usadas
<b>Backend</b>
- Flask: https://flask.palletsprojects.com/en/2.1.x/
- PostgreSQL: https://www.postgresql.org

<b>Frontend</b>
- React: https://reactjs.org

<b>Styling</b>
- Material UI: https://mui.com/

# Como rodar
- Abra o arquivo ```credentials.json``` no diretório raíz e coloque os valores de ```SECRET_KEY``` e ```DATABASE_URL```

- Você pode colocar o que quiser na secret key
- Para conseguir o database url, você precisa criar uma instância de postgreSQL da maneira que preferir e escrever o url manualmente da seguinte forma: ```postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]```

- Rode a api digitando: ```python app.py``` em um terminal
- Rode o cliente abrindo outro terminal e indo até o diretório client: ```cd client``` e digitando ```npm start```
