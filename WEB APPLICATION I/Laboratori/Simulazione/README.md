# Exam 0 : "Exam Simulation (Study Plan)"
## Student: s318952 Molinatto Sylvie 

## React Client Application Routes

- Route `/`: display the list of available courses
- Route `/login`: display a form to execute login
- Route `/studyplan`: display the studyplan of the logged in user :id000
- Route `#`: default route
- ...

## API Server

- GET `/api/sessions/current`
  - request parameters: credentials for passport authentication
  - response body: user info
  - response status: 200 success, 401 not authenticated

- POST `/api/sessions`
  - request parameters: credentials for passport authentication, content-type application/json
  - request body: credentials
  - response body: user info
  - response status: 201 successfull login, 401 wrong credentials

- DELETE `/api/sessions/current`
  - request parameters:  credentials for passport authentication
  - response body: none
  - response status: 200 successfull logout

- GET `/api/courses`
  - request parameters and request body content:  ```none```
  - response body content:
  ```
  Exam {
    id: '010TWWOV'
    name: 'Computer network technologies and services',
    credits: 6,
    maxStudents: 3,
    preparatoryCourse: null,
    incompatible: [ '02GRSOV'],
    enrolled: 1
  },
  Exam {
    id: '01NYHOV'
    name: 'System and devide programming',
    credits: 6,
    maxStudents: 3,
    preparatoryCourse: null,
    incompatible: [ '02KPNOC'],
    enrolled: 1
  } ...
  ```

- GET `/api/students/:id/studyplan`
  - no request parameters (authentication needed) 
  - response body content:
    code: 200
   ```
  [
    {
      userId: 1,
      courseId: '01NYHOV'
    },
    {
      userId: 1,
      courseId: '01OTWOV'
    },
    ...
  ]
  ```
  - Empty list if no already available study plan
    code: 204 (no content)
   ```
   []
   ```
  - code: 401 (if not logged in)
  - code: 404 (not found)

- DELETE `/api/students/:id/studyplan`
  - request parameters: credentials for passport authentication
  - response body: success message
  - response status: 204 success in deletion or study plan already not existing, 401 wrong credentials, 503 database error

- POST `/api/students/:id/studyplan`
  - request parameters: credentials for passport authentication, content-type application/json
  - request body: list of course codes of user new study plan
  ```
  {
    coursesId: ['01NYHOV','01NYHOV',...]
  }
  ```
  - response body: success message
  - response status: 204 success in deletion or study plan already not existing, 401 wrong credentials, 503 database error


## Database Tables

- Table `users` - contains id email name HASHEDPassword Salt  SPType
- Table `courses` - contains  Id  Name  Credits  Pre-Requirements  Incompatibility  Enrolled  MaxStudents
- Table `studyPlan` - contains  userId  courseId

## Main React Components

- `NavBar` (in `NavBar.jsx`): render the login button and eventually a welcome message (if user logged-in)
- `FormLogin` (in `FormLogin.jsx`): render the login form
- `CourseList` (in `CourseList.jsx`): render the list of available courses (composed by `CourseRow`)
- `StudyPlanView` (in `View.jsx`): the sudyPlanView allow to compose your study plan (it is composed by `CourseList` and `StudyPlanList` )
- `Footer` (in `Footer.jsx`): to render copyright and contract information
- `DefaultView` in (`Views.jsx`): to render a default layout when no route is matched
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
