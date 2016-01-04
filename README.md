# Advocated Service

A simple Node.js App that records CDS Developer Advocate activity in a Cloudant database.

It: 

1. Responds to `POST /slack` commands which create provisional entries in the database
2. Responds to `GET /auth/:id` commands which fetch a single entry
3. Responds to `POST /doc` API commands which creates an entry

See [spec.md](spec.md) for the working spec.

## POST /slack

A "slash command" integration with Slack can be used to make a call to `<yoururl>/slack`. The app reads the value of the environment variable `SLACK_TOKEN`. If it matches the incoming token provided by slack, then the "text" field is used to populate the "title" of the event and a token document is created in the 'tokens' database in Cloudant.
  
A URL is forumulated e.g. /doc/45eb326c52907e2b9d2a81ca000037cc, where '45eb326c52907e2b9d2a81ca000037cc' is the id of the token document.

The API call then returns the URL of where the user can go to edit the event in full.

## GET /auth/:id

When the user visits the URL, the token document is retrieved which gives the app

* the user document
* the provisional title of the event

The above items are stored in session and then the page is bounced to `/menu`.


## GET /menu

Only accessible to logged-in users. 

Renders a form with two options

* I attended an event
* I presented an event

Click on each button reveals a form.

## POST /doc

Only accessible to logged-in users. 

The posted form elements are saved as a new event document.


## GET /events

Only accessible to logged-in users. 

Get a list of events. 