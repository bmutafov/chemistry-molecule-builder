# mutafow.github.io
## Chemistry idea prototypes for Open Inno

## API Routes
Every route starts with the `/api/` prefix.

### /api/users/register
- Method: **POST**
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

### /api/users/login
- Method: **POST**
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

