# `react-qa-server`

The `react-qa-server` is the server-side app companion of HeapOverrun (i.e., `react-qa`). It presents some APIs to perform some CRUD operations on questions and their answers.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __List all films__

URL: `/api/films`

HTTP Method: GET.

Description: Get all the available films.

Request body: None.

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite" : "true",
    "watchDate": "2023-02-07",
    "rating" : 5,
    "user" : 1
  },
  ...
]

```

### __Get a single film__

URL: `/api/films/<id>`

HTTP Method: GET.

Description: Get the film represented by the `<id>`.

Request body: None.

Response: `200 OK` (success), `404 Not Found` (wrong id), or `500 Internal Server Error` (generic error).

Response body:
```
{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite" : "true",
    "watchDate": "2023-02-07",
    "rating" : 5,
    "user" : 1
}

```

### __Get films filtered__

URL: `/api/films/<filterLabel>`

HTTP Method: GET.

Description: Get the films filtered by `<filterLabel>`.

Request body: None.

Response: `200 OK` (success), `500 Internal Server Error` (generic error).

Response body:
```
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite" : "1",
    "watchDate": "2023-02-07",
    "rating" : 5,
    "user" : 1
  },
  ...
]
```

### __Create a new film__

URL: `/api/films/new`

HTTP Method: POST.

Description: Create a new film.

Request body: A JSON object representing a new film.

```
{
  "title": "Rambo",
  "favorite": 0,
  "watchdate": "2021-05-25",
  "rating": 2,
  "user": 1
}

```

Response: `201 Created` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### __Update an existing film__

URL: `/api/films/<id>/edit`

HTTP Method: PUT.

Description: Update a film identified by `<id>`.

Request body: A JSON object representing the film.

```
{
    "title": "Pulp Fiction",
    "favorite" : 1,
    "watchdate": "2022-02-07",
    "rating" : 5,
    "user" : 1
}

```

Response: `200 OK` (success), `404 Not Found` (wrong id), or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: edited film

```
{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite" : 1,
    "watchdate": "2022-02-07",
    "rating" : 5,
    "user" : 1
}
```

### __Update rating of a film__

URL: `/api/films/<id>/rating`

HTTP Method: PUT.

Description: Update rating for an existing film (identified by its `<id>`).

Request body: A JSON object representing the action.
```
{
  "rating": 3
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: edited film
```
{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite" : 1,
    "watchdate": "2022-02-07",
    "rating" : 3,
    "user" : 1
}
```

### __Mark a film as favourite/unfavourite__

URL: `/api/films/<id>/favorite`

HTTP Method: PUT.

Description: Update 'favorite' attribute for an existing film (identified by its `<id>`).

Request body: A JSON object representing the action.
```
{
  "favorite": 0
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: edited film
```
{
    "id": 1,
    "title": "Pulp Fiction",
    "favorite" : 0,
    "watchdate": "2022-02-07",
    "rating" : 5,
    "user" : 1
}
```

### __Delete an existing film__

URL: `/api/films/<id>/delete`

HTTP Method: DELETE.

Description: Delete an existing film (identified by its `<id>`).

Request body: None.

Response: `204 No content` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_