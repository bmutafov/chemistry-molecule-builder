# mutafow.github.io
## Chemistry idea prototypes for Open Inno

## API Routes
Every route starts with the `/api/` prefix.

### POST /api/users/register
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

### POST /api/users/login
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
  "base": "H", // For element Hydrogen
  "connections": [
    {
      "valency": 1, // How many connections the element has (valency)
      "el": "O", // For connected element Oxygen
    },
    ...
  ]
}
```
