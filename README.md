## Chemistry molecule builder prototype for Open Innovation
This is the API responsible for handling the back-end of the idea for chemistry molecule builder by Boris Mutafov. 

## Set up
To start the API, clone this repository and `git checkout API`.

Set up a *.env* file with the following key value pairs in it:
- **DB_STRING** - connection string to a MongoDB
- **TOKEN_SECRET** - Secret random string for signing and verifying JWTs

When ready, `npm install` into the terminal and then `npm run dev` for development nodemon start or `npm run start` for production start of the server.

## API Routes
Every route starts with the `/api/` prefix.

### POST /api/user/register
- Request headers: *none*
- Response headers: `auth-token` = JWT  
- Body: **JSON**

| Key            | Value         | Required | Comment                            |
| -------------  |:-------------:| :-------:| :--------------------------------- |
| username       | string        |✓         | Minimum 4 characters long         |
| email          | string        |✓         | Valid email address               |
| password       | string        |✓         | Minimum 6 characters long         |
| confirmPassowrd| string        |✓         | Equal to `password`               |
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | JWT if successfull ; error info if unsucessfull    |

--- 

### POST /api/user/login
- Request headers: *none*
- Response headers: `auth-token` = JWT
- Body: **JSON**

| Key            | Value         | Required | Comment                            |
| -------------  |:-------------:| :-------:| :--------------------------------- |
| username       | string        |✓         | Minimum 4 characters long         |
| password       | string        |✓         | Minimum 6 characters long         |
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | JWT if successfull ; error info if unsucessfull    |

---

### GET /api/molecule
- Request headers: *none*
- Response headers: *none*
- Body: *none*
- Response: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; List of all molecule entries if successfull |

---

### POST /api/molecule
- Request headers: `auth-token` = JWT
- Response headers: *none*
- Body: **JSON**

| Key            | Value         | Required | Comment                              |
| -------------  |:-------------:| :-------:| :----------------------------------- |
| name           | string        |✓         | The name with words for the molecule |
| formula        | string        |✓         | The chemical formula for the molecule|
| solution       | Array*        |✓         | An array containing the solution     |
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; Molecule object if succesfull|
- `Array*` - the structure of the array should be: *(for every element in the molecule)*
```js
{
  "el": "H", // For element Hydrogen
  "connections": [
    {
      "valency": 1, // The type of connection (valency) between the "base el" and "connected el" (how many lines are drawn to connect them)
      "el": "O", // For connected element Oxygen
    },
    ...
  ]
}
```
---

### PUT /api/molecule/:id
- Request headers: `auth-token` = JWT
- Response headers: *none*
- Body: **JSON**

| Key            | Value         | Required | Comment                              |
| -------------  |:-------------:| :-------:| :----------------------------------- |
| name           | string        |          | The name with words for the molecule |
| formula        | string        |          | The chemical formula for the molecule|
| solution       | Array*        |          | An array containing the solution     |
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; Updated object if succesfull |

---

### DELETE /api/molecule/:id
- Request headers: `auth-token` = JWT
- Response headers: *none*
- Body: *none*
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; deleteCount if succesfull    |

---

### GET /api/molecule/:formula
- Request headers: *none*
- Response headers: *none*
- Body: *none*
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; Formula and name of the found molecule|

---

### GET /api/molecule/elements/:formula
- Request headers: *none*
- Response headers: *none*
- Body: *none*
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; Elements used in the molecule if successful|

---

### POST /api/molecule/check
- Request headers: *none*
- Response headers: *none*
- Body: **JSON**

| Key            | Value         | Required | Comment                              |
| -------------  |:-------------:| :-------:| :----------------------------------- |
| formula        | string        |     ✓    | The chemical formula for the molecule|
| solution       | Array*        |     ✓    | An array containing the solution of the user     |
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; Formula and name of the found molecule|

---

### POST /api/element
- Request headers: `auth-token` = JWT
- Response headers: *none*
- Body: **JSON**

| Key            | Value         | Required | Comment                              |
| -------------  |:-------------:| :-------:| :----------------------------------- |
| name           | string        |     ✓    | The name of the molecule (e.g Water) |
| sign           | string        |     ✓    | The formula of the molecule (e.g H2O)|
| bgColor        | string        |     ✓    | Hex color for the background         |
| labelColor     | string        |     ✓    | Hex color for the label              |
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; Element if succesfull|

---

### GET /api/element
- Request headers: `auth-token` = JWT
- Response headers: *none*
- Body: *none*
- Returns: **JSON**

| Key            | Value         |  Comment                                           |
| -------------  |:-------------:| :------------------------------------------------- |
| error          | boolean       | If there was an error processing the request       |
| data           | Object        | Error data if error ; List of existing Elements if succesfull|

---
