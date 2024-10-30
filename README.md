# API for forum application

This application provides an API for the forum application.

## Installing

- **Clone the repository:**

  ```bash
    ssh://git@git.attractor-school.com:30022/abulkanov.madi/homework-92.git
  ```

- **Set up the database:**
  - Create a database and configure the connection in a file `DataSource.ts`.

- **Launch the application:**
  ```bash
    npm run start
  ```

## Endpoints

### Posts

- **GET /posts**
  - Description: Вывести список постов.
    ```json
    {
      "id": 1,
      "title": "Post-1",
      "description": "desc",
      "image": "1db19503-95df-4954-b3b7-9abfee1395ed.png",
      "datatime": "2024-08-19T06:04:04.400Z",
      "userId": 1
    }
    ```

- **GET /posts/:id**
  - Description: Вывести определенный пост по id.
    ```json
    {
      "id": 1,
      "title": "Post-1",
      "description": "desc",
      "image": "1db19503-95df-4954-b3b7-9abfee1395ed.png",
      "datatime": "2024-08-19T06:04:04.400Z",
      "userId": 1
    }
    ```

- **POST /posts**
  - Description: Создать пост.
  - Headers: Authorization: 6819a371-10a0-4f2f-8589-80b83df3a7b4
    ```json
    {
      "title": "Post-1",
      "description": "desc",
      "image": "1db19503-95df-4954-b3b7-9abfee1395ed.png",
    }
    ```

- **DELET /posts/:id**
  - Description: Удалить пост.

### Comments

- **GET /comments**
  - Description: Получить все комментарии.
    ```json
    {
      "id": 4,
      "userId": 2,
      "postId": 1,
      "datatime": "2024-08-19T14:23:00.974Z",
      "comments": "comment",
    }
    ```

- **GET /comments?post_id=1**
  - Description: Получить список комментариев для определенного поста.
    ```json
    {
      "id": 4,
      "userId": 2,
      "postId": 1,
      "datatime": "2024-08-19T14:23:00.974Z",
      "comments": "comment",
    }
    ```

- **POST /comments**
  - Description: Добавить комментарий.
  - Headers: Authorization: 6819a371-10a0-4f2f-8589-80b83df3a7b4
    ```json
    {
      "postId": 1,
      "comments": "comment",
    }
    ```

- **DELET /comments/:id**
  - Description: Удалить комментарий.

### Users

- **GET /users**
  - Description: Получить всех зарегистрированных пользователей.
    ```json
    {
      "id": 1,
      "username": "Oliver",
      "password": "$2b$10$1sf.yWTIUgVMAnIlc6AEzOwHjni6DQDIQCPxX1Lxxskw0WqIt3jLW",
      "token": "1309305f-1520-42cc-b035-85e3a1fbedb3"
    }
    ```

- **GET /users/:id**
  - Description: Получить определенного пользователя по id.
    ```json
    {
      "id": 1,
      "username": "Oliver",
      "password": "$2b$10$1sf.yWTIUgVMAnIlc6AEzOwHjni6DQDIQCPxX1Lxxskw0WqIt3jLW",
      "token": "1309305f-1520-42cc-b035-85e3a1fbedb3"
    }
    ```

- **POST /users**
  - Description: Регистрация (создание) нового пользователя.
    ```json
    Request:
    {
      "username": "John",
      "password": "123"
    }
    ```

    ```json
    Response:
    {
      "id": 1,
      "username": "John",
      "password": "$2b$10$.Qp8PekIs.SeWQJejVox3uKIHxMQ2DmBXwm0BYS8kxJq1GS.VSK0i",
      "token": null
    }
    ```

- **POST /users/sessions**
  - Description: Логин пользователя.
    ```json
    Request:
    {
      "username": "John",
      "password": "123"
    }
    ```
    
    ```json
    Response:
    {
      "id": 3,
      "username": "John",
      "token": "6819a371-10a0-4f2f-8589-80b83df3a7b4"
    }
    ```