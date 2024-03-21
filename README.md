# caliban-schema
create a caliban server that the queries are generated from the schema 

use the following curl/postman calls to see results 

### get all books
```bash
curl --location 'http://localhost:8088/api/graphql' \
--header 'token: hello' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    books {\n        id\n        title\n        ... @defer(label: \"authordelay\"){\n            author\n        }\n    }\n}","variables":{}}'
```

### get specific book 
```bash
curl --location 'http://localhost:8088/api/graphql' \
--header 'token: hello' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    books(title: \"1984\") {\n        id\n        title\n        ... @defer(label: \"authordelay\"){\n            author\n        }\n    }\n}","variables":{}}'
```

### book not found error
```bash
curl --location 'http://localhost:8088/api/graphql' \
--header 'token: hello' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query {\n    books(title: \"19841\") {\n        id\n        title\n        ... @defer(label: \"authordelay\"){\n            author\n        }\n    }\n}","variables":{}}'
```


