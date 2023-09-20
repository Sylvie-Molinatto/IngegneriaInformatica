# Exercise 16: Exam Simulation (Stydy Plan)

_Goal: Understanding how to approach the development of a "complete" web application from scratch._

Starting from a repository template (similar to the one provided you for the exam calls), we are going to structure a possible solution.

## General consideration

- read carefully the exam text
- read REALLY carefully the exam text
  - rember to be compliant to the exam requirements
- define the main functional requirements
- define the main non-functional requirements
- know what are you using!
  - try to be more compliant as possible with what we explained you during the course
  - you must know what is the main purpose of the component you are including
- define the API's

## Server Side

- design the database
  - do not store plain-text password!
- decide which APIs require to be protected with Authentication
- store username and plain-text password in the readme file
  - **never** do something like that in real life!
- remember to enable CORS
- install necessary packages

## Client Side

- define the application's routes
- define the main React components
- call and retrieve data ccording to the implemented APIs
  - remmeber to forward the cookie for authentication in the related APIs
- install necessary packages

## Conclusions
- Remember to test your application in a new folder
  - you can also consider to test in in a different computer
- Add the `final` tag
