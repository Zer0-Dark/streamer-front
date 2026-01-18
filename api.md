# Backend API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Login
*   **URL**: `/users/login`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "password": "your_password"
    }
    ```
*   **Response**: Returns user object and `token`.
    ```json
    {
      "_id": "...",
      "name": "...",
      "token": "ey..." 
    }
    ```
*   **Note**: Save the `token`. You need to send it in the header for protected routes: `Authorization: Bearer <token>`.
*   **Expiration**: The token expires in **10 minutes**. Handle 401 errors by redirecting to login.

---

## User Profile

### Get Profile
*   **URL**: `/users`
*   **Method**: `GET`
*   **Response**: Returns the single user profile.

### Update Profile
*   **URL**: `/users`
*   **Method**: `PUT`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**: (All fields are optional)
    ```json
    {
      "name": "New Name",
      "info": "Bio...",
      "socialLinks": [{"platform": "twitter", "url": "..."}],
      "photoUrl": "...",
      "password": "newPassword"
    }
    ```

---

## Calendar (Schedule)

### Get All Events (Public)
*   **URL**: `/calendar`
*   **Method**: `GET`
*   **Response**: Array of event objects sorted by day.

### Create Event (Protected)
*   **URL**: `/calendar`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**:
    ```json
    {
      "streamTitle": "Stream Name",
      "day": "2024-01-01",  // Date string
      "startTime": "20:00",
      "description": "Optional description"
    }
    ```

### Update Event (Protected)
*   **URL**: `/calendar/:id`
*   **Method**: `PUT`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**: Same as Create.

### Delete Event (Protected)
*   **URL**: `/calendar/:id`
*   **Method**: `DELETE`
*   **Headers**: `Authorization: Bearer <token>`

---

## Votes (Polls)

### Get All Polls (Public)
*   **URL**: `/votes`
*   **Method**: `GET`
*   **Response**: JSON Array of all poll objects.

### Cast Vote (Public)
*   **URL**: `/votes`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "voteId": "poll_id_here",
      "elementId": "option_id_here"
    }
    ```

### Create Poll (Protected)
*   **URL**: `/votes/create`
*   **Method**: `POST`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body**:
    ```json
    {
      "title": "Poll Question?",
      "startDate": "2024-01-01",
      "endDate": "2024-01-02",
      "elements": [
        { "label": "Option A" },
        { "label": "Option B" }
      ]
    }
    ```
# streamer-backend
# streamer-backend
# streamer-backend
