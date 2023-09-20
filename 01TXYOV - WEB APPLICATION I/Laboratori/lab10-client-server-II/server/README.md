# Lab 10 - Complete APIs Integration

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

### Film Management

#### Get all films

* HTTP method: `GET`  URL: `/api/films`
* Description: Get the full list of films or the films that match the query filter parameter
* Request body: _None_
* Request query parameter: _filter_ name of the filter to apply (filter-all, filter-favorite, filter-best, filter-lastmonth, filter-unseen)
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one film:

``` json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2023-03-11",
    "rating": 5,
    "user": 1
  },
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2023-03-17",
    "rating": 4,
    "user": 1
  },
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get film by id

* HTTP method: `GET`  URL: `/api/films/:id`
* Description: Get the film corresponding to the id 
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing the required film:

``` JSON
[
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2023-03-17",
    "rating": 4,
    "user": 1
  }
]
```

* Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

#### Add a new film

* HTTP method: `POST`  URL: `/api/films`
* Description: Add a new film to the films of user 1
* Request body: description of the object to add (user property, if present, is ignored and substituted with the value 1, film id value is not required and is ignored)

``` JSON
{
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2023-03-17",
    "rating": 4,
    "user": 1
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses: `503 Service Unavailable` (database error)

#### Update an existing film

* HTTP method: `PUT`  URL: `/api/films/:id`
* Description: Update values of an existing film, except the id (user property, if present, is ignored and substituted with the value 1)
* Request body: description of the object to update

``` JSON
{
    "id": 2,
    "title": "The Matrix",
    "favorite": 1,
    "watchDate": "2023-03-31",
    "rating": 5,
    "user": 1
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses: `503 Service Unavailable` (database error)

#### Delete an existing film

* HTTP method: `DELETE`  URL: `/api/films/:id`
* Description: Delete an existing film 
* Request body: _None_

* Response: `200 OK` (success)
* Response body: an empty object

* Error responses:  `503 Service Unavailable` (database error)

#### Update favorite property of an existing film 

* HTTP method: `PUT`  URL: `/api/films/:id/favorite`
* Description: Update favorite property value of an existing film 
* Request body: value of the favorite property

``` JSON
{
    "id": 2,
    "favorite": 1,
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses: `503 Service Unavailable` (database error)

#### Update rating property of an existing film 

* HTTP method: `PUT`  URL: `/api/films/:id/rating`
* Description: Update rating property value of an existing film 
* Request body: value of the rating property

``` JSON
{
    "id": 2,
    "rating": 5,
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses: `503 Service Unavailable` (database error)
