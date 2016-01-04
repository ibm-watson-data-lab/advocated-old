# Advocated Service

A simple Node.js App that records CDS Developer Advocate activity in a Cloudant database.

It: 

1. Responds to `POST /slack` commands which create entries in the tokens database
2. Responds to `GET /auth/:id` commands which redeem tokens
3. Responds to `POST /doc` API commands which creates an entry into the database
4. GET /menu which renders the single-page web app
5. GET /events which returns the list of events in newest-first order

See [spec.md](spec.md) for the working spec.

## POST /slack

A "slash command" integration with Slack can be used to make a call to `<yoururl>/slack`. The app reads the value of the environment variable `SLACK_TOKEN`. If it matches the incoming token provided by slack, then the "text" field is used stored, together with the user that generated the request in the 'tokens' database in Cloudant.
  
A URL is forumulated e.g. /auth/45eb326c52907e2b9d2a81ca000037cc, where '45eb326c52907e2b9d2a81ca000037cc' is the id of the token document.

The API call then returns the URL of where the user can go to login to the Advocated portal.

## GET /auth/:id

When the user visits the URL, the token document is retrieved which gives the app

* the user document
* the provisional title of the event

The above items are stored in session and then the browser is bounced to `/menu`.


## GET /menu

Only accessible to logged-in users. 

Renders a form with two options

* I attended an event
* I presented an event

Click on each button reveals the respective forms, the submission of which causes "POST /doc" calls to be made

## POST /doc

Only accessible to logged-in users. 

The posted form elements are saved as a new event document. The user id is added from session and some fields are tidied up before saving (i.e. integers are parsed as integeres etc)


## GET /events

Only accessible to logged-in users. 

Get a list of events. This is used to populate the event list on the "Presented" form.