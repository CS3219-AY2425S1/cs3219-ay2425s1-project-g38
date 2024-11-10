# Matching Service API Guide

The matching service uses socket.io to establish a real-time connection between the client and server. The service provides endpoints for creating and joining rooms, sending and receiving messages, and matching users based on their preferences.

## Authentication

All endpoints require the client to include a JWT (JSON Web Token) under socket.io "auth" object for authentication. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token with the user-service to ensure that the client is authorized for matchmaking.

## Client Events

### Register For Matching

- This event allows a user to register for matching by providing their preferences.
- socket event: `registerForMatching`
- Parameters:
    - `{difficulty: string[], category: string[]}`
    - Example:
        ```json
        {
            "difficulty": ["easy", "medium"],
            "category": ["science", "math"]
        }
        ```
    ```
    socket.emit('registerForMatching', {difficulty: ["easy", "medium"], category: ["science", "math"]})
    ```
- Responses:
  - Success (Match Found)
      - socket event: `matchFound`
      - Data:
          - `{ matchedWith : string }`
  - Success (Registered)
      - socket event: `registrationSuccess`
      - Data:
          - `{ message : string }`
  - Error
      - socket event: `error`
      - Data:
          - `error: string`

### Deregister For Matching

- This event allows a user to deregister from the matching service.
- socket event: `deregisterForMatching`
- Parameters: None
- Example:
    ```
    socket.emit('deregisterForMatching')
    ```
- Responses: None

### Disconnect

- This event is triggered when a user disconnects from the socket.
- socket event: `disconnect`
  - The user will be automatically deregistered from the matching service when they disconnect.

## Server Events

### Match Found

- This event is triggered when the matching service finds a match for the user.
- socket event: `matchFound`
- Data:
    - `{ matchedWith : string }`
    - Example:
        ```json
        {
            "matchedWith": "user123"
        }
        ```

### Redirect To Session

- This event is triggered when the session is done setting up and is ready to receive the user.
- socket event: `redirectToSession`
- Data:
    - `{ sessionId : string }`
    - Example:
        ```json
        {
            "sessionId": "session123"
        }
        ```

### Registration Success

- This event is triggered when the user successfully registers for matching.
- socket event: `registrationSuccess`
- Data:
    - `{ message : string }`
    - Example:
        ```json
        {
            "message": "Successfully registered for matching"
        }
        ```
- Note: This event is not triggered if a match is found immediately after registration. In such cases, the `matchFound` event is triggered instead.

### Error

- This event is triggered when an error occurs during the matching process.
- socket event: `error`
- Data:
    - `error: string`
    - Example:
        ```json
        {
            "error": "Invalid preferences"
        }
        ```

### Timeout

- This event is triggered when the matching service is unable to find a match within the specified timeout.
- socket event: `matchingTimeout`
- Data: None

