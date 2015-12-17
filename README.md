# Advocated Service

A simple Node.js App that records CDS Developer Advocate activity in a Cloudant database.

It: 

1. Responds to `POST /slack` commands which create provisional entries in the database
2. Responds to `GET /doc/:id` commands which fetch a single entry
3. Responds to `POST /doc/:id` API commands which updates an entry


