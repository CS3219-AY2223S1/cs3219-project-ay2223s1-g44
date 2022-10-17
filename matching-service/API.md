# Matching Service

## APIs

### 1. Getting an Active Match

```http
GET /match/:username
```

| Parameter  | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `username` | `string` | **Required**. Current username |

### Responses

```javascript
{
    "_id": string,
    "matchId": string,
    "username1": string,
    "username2": string,
    "isActive": true,
    "__v": 0
}

OR

{
    message: 'Could not find an existing match!'
}
```

If the current user has an active match, the reponse will contain the match object with the relavant infomation.

If the current user does not have any active matches, the response will contain a message, indicating that there is no match.

### Status Codes

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |

### 2. Ending an Active Match

```http
PUT /end/:username
```

| Parameter  | Type     | Description                    |
| :--------- | :------- | :----------------------------- |
| `username` | `string` | **Required**. Current username |

### Responses

```javascript
{
    "_id": string,
    "matchId": string,
    "username1": string,
    "username2": string,
    "isActive": true,
    "__v": 0
}

OR

{
    message: 'Could not find an existing match!'
}
```

If the current user has an active match, the reponse will contain the match object with the relavant infomation **after** it has been ended.

If the current user does not have any active matches, the response will contain a message, indicating that there is no match.

## Status Codes

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 500         | `INTERNAL SERVER ERROR` |
