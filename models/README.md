This file explains in details how the three models (Users, Categories, Notes) are related.
All APIs are authenticated and require the user to be logged in, except for the Signup and Login process of course.

## Users:

### Sign up:

The user is asked to provide us with his email and a password of his choice, which are validated and sanitized afterwards.
Just like any normal application, the email should not match any other email already existing in the database.
The password is hashed using the "bcryptjs" package with a salt of 12, and safely stored with the email in the "Users" collection.
Finally, an email is sent to the user to welcome him.

### Login:

The user is asked to enter his email and password which should already be existing in the database.
The email and password should both match for a successful login operation.
A json web token is then generated and stored on the client-side, so that the user is authenticated for other routes.

## Categories:

1. Create:
   The name of the category is the only field required to create a new category for a logged in user.
   However, it would be unecessary to create duplicate category names, so the categories should vary for the SAME user.
   The user is used as a reference in the newly created category, so that each user has access to his own categories.

2. Read:
   The user can perform a get request to view all categories he has created.

3. Update:
   Category names can be updated as long as the new name provided does not already exist.

4. Delete:
   Since a note should be linked to exactly 1 category, the deletion of a category is restricted as long as at least 1 note is linked to it.
   In this manner, the user is asked either to delete all notes related to a category, or just move the notes to another category.
   Setting such rule is very crucial to keep all notes linked to a valid category, without having to delete any note.

## Notes:

1. Create:

   - Required fields: Title, content, category
   - Optional field: Tags
   - Reference: "User" model

2. Read:
   The notes are sorted by update date. They can be filtered by category or search for notes containing a certain Tag, if any.

3. Update:
   Notes can be updated only by their creator (user who created the note).

4. Delete:
   Notes can be deleted only by their creator (user who created the note).
