# Advocated Service

A simple Node.js App that records CDS Developer Advocate activity in a Cloudant database.

It: 

1. Responds to `POST /slack` commands which create provisional entries in the database
2. Responds to `GET /doc?id=xxx` commands which fetch a single entry
3. Responds to `POST /doc?id=xxx` API commands which updates an entry

See [spec.md](spec.md) for the working spec.

## POST /slack

A "slash command" integration with Slack can be used to make a call to `<yoururl>/slack`. The app reads the value of the environment variable `SLACK_TOKEN`. If it matches the incoming token provided by slack, then the "text" field is used to populate the "title" of the event and a template event is created in Cloudant.
  
The API call then returns the URL of where the user can go to edit the event in full.

## GET /doc?id=xxx

To be done

## POST /doc?id=xxx

To be done
