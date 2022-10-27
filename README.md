# Notes-NodeJS

The aim of this NodeJS application is to serve as a backend for a note taking application.
This application was developped with the help of the Express JS Framework.
It allows the user to add notes, link them to a category, and tag them.
Each note is linked exactly to 1 category, but can have any number of tags.
Therefore, the user can view, edit and delete his notes, as well as filter by category, search by tags and sort them by update date.

Taking all these into consideration, the application exposes REST APIs and uses MongoDB to store the data.

### MongoDB Database structure:

The data is distributed across 3 major collections: 
* Users (where users and their credentials are safely stored)
* Categories (Each user can "CRUD" his own categories)
* Notes (Each user can "CRUD" his own notes)

For more details about how the relations between these collections are set, kindly read the README file in the "models" folder.

### Packages used:
* Express JS v4.18.2
* Express-Validator v6.14.2
* Mongoose v6.6.7
* Body-Parser v1.20.1
* Jsonwebtoken v8.5.1
* nodemailer v6.8.0
* nodemailer-sendgrid-transport v0.2.0
