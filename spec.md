
##

* Events:
* * Name of the event
* * Description of the event
* * Number of attendees at the event (can be estimated or approximated)
* * Optionally, some free form tags for the event (e.g. "hackathon", "PHP")
* Sessions (not all events will have sessions, for example hackathons are often attended but no presentation is given):
* * Associated event
* * Name of the session you delivered at the event
* * Description of the session you delivered at the event
* * Number of attendees at the session (can be estimated or approximated)
* * Optionally, some free form tags for the session

## Event

```js
{
  _id: "24b838abb04210cee2bece8d5af363cf",
  collection: "event", // Value can be "user", "event", or "session" (each has its own schema)
  attendee: "c15e95d877e4e23363c579c0a1654fcd", // The _id of the user who indicated attendance at this event (i.e. the user creating this entry)
  title: "CodeMash", // The name of the event
  dtstart: "2016-01-05", // The date the event began
  dtend: "2016-01-08", // The date the event ended
  description: "CodeMash is a unique event that will educate developers on current practices, methodologies, and technology trends in a variety of platforms and development languages such as Java, .NET, Ruby, Python and PHP.", // The official description of the event (can be unofficial if no canonical description is available)
  attendees: 2500, // An estimated number of attendees at the event
  categories: ["Conference"], // Can be one or more of "Conference", "Meetup", "Hackathon", or left empty of if non of these fit
  sponsored: true, // Did IBM sponsor this event?
  tags: ["Java", ".NET", "Ruby", "Python", "PHP"], // Optional free form tags
  comments: "It was fun!" // Optional comments
}
```

## Session

```js
{
  _id: "02312c0dc2ccb447926361aaaa82a97d",
  collection: "session",
  event: "24b838abb04210cee2bece8d5af363cf", // User will have to select from one of their previously-entered events (optional)
  presenter: "c15e95d877e4e23363c579c0a1654fcd", // The _id of the user who indicated presenting this session (i.e. the user creating this entry)
  title: "Domain-Driven Data", // The name of the session
  dtstart: "2016-01-08", // The date of the session
  description: "There are many types of databases and data analysis tools from which to choose today. Should you use a relational database? How about a key-value store? Maybe a document database? Or is a graph database the right fit for your project? What about polyglot persistence? Help! Applying principles from Domain-Driven Design, this presentation will help you choose and apply the right data layer for your application's model or models.", // The description of the session
  attendees: 30, // An estimated number of attendees at the session
  categories: ["Conference"], // Can be one or more (or none) of "Conference", "Meetup", "Hackathon", or "Webinar". Will use the same category as the associated event, if applicable
  sponsored: false, // Was this an IBM sponsored session?
  tags: ["Domain-Driven Design", "data"], // Optional free form tags
  comments: "First time giving this talk." // Optional comments
}
```

##  User

```js
{
  _id: "c15e95d877e4e23363c579c0a1654fcd",
  collection: "user",
  display_name: "Steve",
  identifiers: {
    slack: {
      team_id: "T0001",
      user_id: "U2147483697",
      user_name: "Steve"
    }
  }
}
```

## Blog

{
   "_id": "39e7a45f904ffe701e1fe0bce3006ddd",
   "_rev": "1-0a4b5d352a6cd008a472a10a06096eb1",
   "collection": "blog",
   "title": "Block chain, smart contracts and ethereum",
   "dtstart": "2015-09-09",
   "url": "https://developer.ibm.com/clouddataservices/2016/05/19/block-chain-technology-smart-contracts-and-ethereum/",
   "tags": [
       "a",
       "b",
       "c"
   ],
   "comments": "123",
   "sponsored": false,
   "author": "b7b12408c2b7059433eb0e87670038a3"
}

## Press

{
   "_id": "39e7a45f904ffe701e1fe0bce3006ddd",
   "_rev": "1-0a4b5d352a6cd008a472a10a06096eb1",
   "collection": "press",
   "outlet": "NYT",
   "title": "Block chain, smart contracts and ethereum",
   "dtstart": "2015-09-09",
   "url": "https://developer.ibm.com/clouddataservices/2016/05/19/block-chain-technology-smart-contracts-and-ethereum/",
   "tags": [
       "a",
       "b",
       "c"
   ],
   "comments": "123",
   "sponsored": false,
   "author": "b7b12408c2b7059433eb0e87670038a3"
}