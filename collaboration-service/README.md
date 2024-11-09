# Collaboration Service API Guide

The collaboration service uses socket.io to establish a real-time connection between the client and server. The service provides endpoints for the creation of sessions, sending and receiving messages, and collaboration features.

## Authentication

### HTTP Endpoints
The endpoint for the creation of the session must include a valid API key for authentication. The server verifies this key with the key stored within the .env file to ensure that the service request is authorized.
All other HTTP related endpoints require the client to include a JWT (JSON Web Token) under the "Authorization" header for authentication. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token with the user-service to ensure that the client is authorized for collaboration.

### Socket Endpoints
Socket Related endpoints require the client to include a JWT (JSON Web Token) under the socket.io "auth" object for authentication. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token with the user-service to ensure that the client is authorized for collaboration.

## Client Events

### Update Collaborative Document

- This event is propagates changes to the collaborative document to all connected clients.
- socket event: `update`
- Parameters:
    - `{ update: Uint8Array }`
    - Example:
        ```
        socket.emit('update', { update: Uint8Array })
        ```
- Responses: 
    - Document Update Propagation (io.to(roomId).emit(...))
        - socket event: `updateContent`
        - Data:
            - `{ update: Uint8Array }`

### Update Selected Language

- This event is used to update the selected language for the collaborative document.
- socket event: `selectLanguage`
- Parameters:
    - `{ language: string }`
    - Example:
        ```
        socket.emit('selectLanguage', { language: "python" })
        ```
- Responses:
    - Language Propagation (socket.to(roomId).emit(...))
        - socket event: `updateLanguage`
        - Data:
            - `{ language: string }`

### Propagate Code Output

- This event is used to propagate the output of the code execution to all connected clients.
- socket event: `codeExecution`
- Parameters:
    - `{ result: codeOutputInterface }`
    - Example:
        ```json
        {
            "stdout": "Hello, World!",
            "stderr": "",
            "output": "Ok",
            "code": 200,
            "signal": null
        }
        ```
        ```
        socket.emit('codeExecution', {stdout: "Hello, World!", stderr: "", output: "Ok", code: 200, signal: null})
        ```
- Responses:
    - Code Output Propagation (socket.to(roomId).emit(...))
        - socket event: `updateOutput`
        - Data:
            - `{ result: codeOutputInterface }`

### Propagate Chat Message

- This event is used to propagate chat messages to all connected clients.
- socket event: `chatMessage`
- Parameters:
    - `{ message: ChatMessage }`
    - Example:
        ```json
        {
            "username": "user123",
            "message": "Hello, World!"
            "timestamp": 1633024800000
        }
        ```
        ```
        socket.emit('chatMessage', { username: "user123", message: "Hello, World!", timestamp: 1633024800000 })
        ```
- Responses:
    - Chat Message Propagation (socket.to(roomId).emit(...))
        - socket event: `chatMessage`
        - Data:
            - `{ message: ChatMessage }`

### Change Termination Modal Visibility

- This event is used to change the visibility of the termination modal.
- socket event: `changeModalVisibility`
- Parameters:
    - `{ isVisible: boolean }`
    - Example:
        ```
        socket.emit('changeModalVisibility', { isVisible: true })
        ```
- Responses:
    - Modal Visibility Propagation (socket.to(roomId).emit(...))
        - socket event: `modalVisibility`
        - Data:
            - `{ isVisible: boolean }`

### Request Termination of Session

- This event is used to inform the other clients that the user has requested to begin the session termination process.
- socket event: `terminateOne`
- Parameters: None
- Example:
    ```
    socket.emit('terminateOne')
    ```
- Responses:
    - Termination Request Propagation (socket.to(roomId).emit(...))
        - socket event: `terminateOne`
        - Data: None

### Confirm Termination of Session

- This event is used to acknowledge and confirm the request to terminate the session.
- socket event: `terminateSession`
- Parameters: None
- Example:
    ```
    socket.emit('terminateSession')
    ```
- Responses:
    - Termination Confirmation Propagation (socket.to(roomId).emit(...))
        - socket event: `terminateSession`
        - Data: None

## Server Events

### Broadcast Session Data

- This event is triggered when a client connects/reconnects to the session.
- socket event: `initialData`
- Data:
    - `{ message: string, sessionData: SessionData }`
    - Example:
        ```json
        {
            "message": "Welcome to the session!",
            "sessionData": {
                "question": "What is the two sum of 2 and 3?",
                "yDocUpdate": Uint8Array,
                "selectedLanguage": "python",
                "usersInRoom": ["user123", "user456"],
                "username": "user123"
                "chatHistory": [ChatMessage]
            }
        }
        ```
        ```
        socket.emit('initialData', { message: "Welcome to the session!", sessionData: SessionData })
        ```

### Broadcast User Joining

- This event is triggered when a user joins the session.
- socket event: `userJoin`
- Data:
    - `{ usersInRoom: [string] }`
    - Example:
        ```
        socket.to(roomId).emit('userJoin', { usersInRoom: ["user123", "user456"] })
        ```

### Broadcast User Leaving

- This event is triggered when a user is disconnected the session.
- socket event: `userLeft`
- Data:
    - `{ usersInRoom: [string] }`
    - Example:
        ```
        socket.to(roomId).emit('userLeft', { usersInRoom: ["user456"] })
        ```

### Error Handling

- This event is triggered when an error occurs during the initialization of a socket connection.
- socket event: `error`
- Data:
    - `error: string`
    - Example:
        ```
        socket.emit('error', 'An error occurred while finding the session')
        ```

## HTTP Endpoints

### Create Session

- This endpoint is used to create a new collaborative session.
- Method: POST
- URL: `/session/create`
- Endpoint: `http://<api-gateway-url>/collab/session/create`

- Request Body:
    - Required Parameters:
        - `participants`: [string]
        - `questionId`: number
    
    - Example:
        ```json
        {
            "participants": ["user123", "user456"],
            "questionId": 1
        }
        ```

- Responses:
    - 201: Session created successfully
    - 400: Bad request. Missing required parameters or invalid participant
    - 500: Internal Server Error         

### Check Session Status

- This endpoint is used to check the status of a collaborative session. It checks if the user is a participant in any active session.
- Method: GET
- URL: `/session/check`
- Endpoint: `http://<api-gateway-url>/collab/session/check`

- Request Body:
    - Required Parameters:
        - `userId`: string
    - Example:
        ```
        {
            "userId": "abc987xyz123"
        }
        ```

- Responses:
    - 200: User is a participant in an active session
    - 204: User is not a participant in any active session
    - 500: Internal Server Error

### Leave Session

- This endpoint is used to allow users to leave a collaborative session before it is terminated.
- Method: GET
- URL: `/session/leave`
- Endpoint: `http://<api-gateway-url>/collab/session/leave`

- Request Body:
    - Required Parameters:
        - `userId`: string
    - Example:
        ```
        {
            "userId": "abc987xyz123"
        }
        ```

- Responses:
    - 200: User successfully left the session
    - 404: User is not a participant in any active session
    - 500: Internal Server Error

### Get Session Data

- This endpoint is used to retrieve the session data for a given session ID.
- Method: POST
- URL: `/session/details`
- Endpoint: `http://<api-gateway-url>/collab/session/details`

- Request Body:
    - Required Parameters:
        - `sessionId`: string
    - Example:
        ```
        {
            "sessionId": "9a8b7c6d5e4f3g2h1"
        }
        ```

- Responses:
    - 200: Session data retrieved successfully
    - 404: Session not found
    - 500: Internal Server Error

## Cron Job

### Terminate Inactive Sessions

The cron job is used to terminate inactive sessions after a specified period of inactivity. The job runs at regular intervals to check the last activity timestamp of each session. If the session has been inactive for a specified duration, the job terminates the session and removes it from the database.
- Interval: 1 hour
- Maximum Allowed Session Duration: 4 hours
