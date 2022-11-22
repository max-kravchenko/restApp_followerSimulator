# REST додаток-симулятор Соціальної Мережі

[eng version => HERE](./Readme.en.md)

Це REST-додаток, який генерує випадкових користувачів у базі данних та випадкові підписки між ними. По запиту до сервера можна отримувати інфо про а) всіх користувачів з підпиками б) індивідуального юзера з друзями в) топ-5 фоловлячих користувачів тощо. Для створення додатку використовувася Node.js, Express.js, Postgresql, Sequelize. Деплой на HerokuApp.

## Інструкції з використання

1. Склонуйте проект на локальний компʼютер, використовуючи HTMl чи SSH лінку

```sh
HTML
$ git clone https://github.com/max-kravchenko/restApp_socialNetworkSimulator.git 
SSH
$ git clone git@github.com:max-kravchenko/restApp_socialNetworkSimulator.git
```

2. Відкрийте проект в редакторі коду та встановіть всі залежності
```sh
$ npm i
```

3. Для подальшої роботи необхідно підключити базу даних (у прикладі це Postgresql). Для цього у папці config треба створити файл config.json, де внести відповідну персональну інфу: Username, Password (ваші юзернейм та пароль у Postgresql), Database(назву бази даних, яку ви створили), host та діалект (postgres або щось інше)
```sh
{
  "development": {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "",
    "password": "",
    "database": "",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

4. Після того, як база підключена, потрібно наповнити її шаблонами таблиць (згенеровані у migrations/20221118153417-init.js). User - таблиця з користувачам (імʼя, гендер). Subscription - таблиця з підписками користувачів(user_id (foreign key для звʼязку з першою таблицею, followingUserId (id користувача, якого фоловить користувач з таблиці 1))).

```sh
$ npm migrate
```

5. Що ж за база даних без користувачів? Для цього давайте наповнимо таблиці рандомними користувачами та звʼязками між ними (скрипти для сідерів знаходиться в папці seeders)

```sh
$ npm seed
```

6. Наша база готова, тепер можна переходити до серверу. Для початку запускаємо сервер (по замовчуванню порт 4000)

```sh
$ npm start
```

## Endpoints (з скриншотами)

* **/users** видає всіх користувачів, які зробили мінімум 1 підписку
* [DEMO LINK](https://restapp-sn-simulator.herokuapp.com/users)

![alt text](./imgs/users.png "users_endpoint")


* **:USERid/friends?order_by=:collumn_name&order_type=:direction** видає користувача з друзями (там де є взаємна підписка), кількість друзів, їхній список (який можна сортувати за назвою колонки та DESC/ASC)
* [DEMO LINK](https://restapp-sn-simulator.herokuapp.com/1/friends?order_by=name&order_type=desc)

![alt text](./imgs/getUser.png "single_user_endpoint")


* **/max-following** видає топ-5 юзерів за кількістю зроблених підписок.
* [DEMO LINK](https://restapp-sn-simulator.herokuapp.com/max-following)

![alt text](./imgs/top_five.png "top-five_endpoint")


* **/not-following** видає юзерів, які не зробили жодної підписки
* [DEMO LINK](https://restapp-sn-simulator.herokuapp.com/not-following)

![alt text](./imgs/not_following.png "no_fol_endpoint")