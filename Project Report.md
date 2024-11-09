![][image1]

# CS3219: Project Report

## Group X

| No. | Full Name (as in EduRec) | Student Number(Axxxx) |
| :-- | :----------------------- | :-------------------- |
| 1   |                          |                       |
| 2   |                          |                       |
| 3   |                          |                       |
| 4   |                          |                       |
| 5   |                          |                       |

Table of Contents

- [Declaration](#declaration)

- [Individual Contributions](#individual-contributions)

- [Product Backlog – Requirements Specification](#project-scope-product-backlog)

- [Functional Requirements (+ Fulfillment)](#functional-requirements--fulfillment)

- [Non-Functional Requirements (+ Fulfillment)](#non-functional-requirements--fulfillment)

- [Design](#design)

- [Project Plans](#project-plans)

# Declaration

We, the undersigned, declare that:

1\. The work submitted as part of this project is our own and has been done in collaboration with the members of our group and no external parties.  
2\. We have not used or copied any other person’s work without proper acknowledgment.  
3\. Where we have consulted the work of others, we have cited the source in the text and included the appropriate references.  
4\. We understand that plagiarism is a serious academic offense and may result in penalties, including failing the project or course.

1. We have read the [NUS plagiarism policy and the Usage of Generative AI](https://www.comp.nus.edu.sg/cug/plagiarism/).

**Group Member Signatures:**

| Full Name (as in Edu Rec) | Signature | Date |
| :------------------------ | :-------- | :--- |
|                           |           |      |
|                           |           |      |
|                           |           |      |
|                           |           |      |
|                           |           |      |

# Individual Contributions

| No  | Full Name (as in Edu Rec) | Contributions _(write point wise for different components). Extend the table as needed._ |
| :-- | :------------------------ | :--------------------------------------------------------------------------------------- |
| 1   |                           |                                                                                          |
| 2   |                           |                                                                                          |
| 3   |                           |                                                                                          |
| 4   |                           |                                                                                          |
| 5   |                           |                                                                                          |

# Project scope (Product backlog)

## Functional Requirements (+ Fulfillment)

| Functional Requirements                                                                                                                                                                                                                     | Priority | Planned sprint/iteration | PR  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | :----------------------- | :-- |
| **F1**: User Service – User Profile Management                                                                                                                                                                                              |          |                          |     |
| **F1.1**: User Authentication                                                                                                                                                                                                               |          |                          |     |
| **F1.1.1:** Users must be able to create accounts using email, username, password, and display name, with real-time validation for email format and password strength.                                                                      | H        | Week 6 \- Recess Week    |     |
| **F1.1.2** Email validation using a confirmation email link sent to the input email to verify the email is indeed the user’s.                                                                                                               | M        |                          |     |
| **F1.1.3:** Support for login via email/username and password and authentication using JSON Web Tokens (JWTs). Error messages must be provided for incorrect credentials.                                                                   | H        | Week 6 \- Recess Week    |     |
| **F1.1.4:** Support for a “Forgot Password” feature, allowing users to reset their password through email verification and secure reset tokens.                                                                                             | M        | Week 7                   |     |
| **F1.1.5:** Provide OAuth 2.0 authentication using external services (Google, Facebook, GitHub).                                                                                                                                            | M        | Week 7                   |     |
| **F1.1.6:** Users must be able to update their email and password with re-authentication for sensitive changes.                                                                                                                             | H        | Week 7                   |     |
| **F1.2:** User account CRUD operations                                                                                                                                                                                                      |          |                          |     |
| **F1.2.1:** On account creation, a unique user-id is assigned to the new user                                                                                                                                                               | H        | Week 6 \- Recess Week    |     |
| **F1.2.2:** User profile information which includes user-id, display name, username, email, password, and match history, is stored persistently in a database                                                                               | H        | Week 6 \- Recess Week    |     |
| **F1.2.3:** User profile information which includes display name, email and password can be modified (with user authentication)                                                                                                             | H        | Week 6 \- Recess Week    |     |
| **F1.2.4** User accounts and their information can be permanently deleted from the database (with authentication from the user)                                                                                                             | H        | Week 7                   |     |
| **F2**: Matching Service – responsible for matching users together for a peer coding session                                                                                                                                                |          |                          |     |
| **F2.1:** User Registration for Matching                                                                                                                                                                                                    |          |                          |     |
| **F2.1.1:** Users can register themselves for a match by specifying their search criteria (difficulty level and question topic)                                                                                                             | H        | Week 5-6                 |     |
| **F2.1.2:** On successful registration for matching, the user’s user-id, their search criteria and the time when they start matching are added to a search pool database                                                                    | H        | Week 5-6                 |     |
| **F2.1.3:** Users should remain connected to the matching service through a socket (such as socket.io) while searching for a match                                                                                                          | H        | Week 5-6                 |     |
| **F2.1.4:** Should a user disconnect from the matching service before a match is found, the system will cancel the matching search for the user                                                                                             | H        | Week 5-6                 |     |
| **F2.1.5:** Users are removed from the search pool once they find a match or if their search is cancelled                                                                                                                                   | H        | Week 5-6                 |     |
| **F2.2:** Criteria Based Matching                                                                                                                                                                                                           |          |                          |     |
| **F2.2.1:** Users in the search pool are matched together if their selected difficulty level and question topic are the same                                                                                                                | H        | Week 6-7                 |     |
| **F2.2.2:** Users who have been searching for a match longer are prioritised when multiple users with the same search criteria are available in the search pool                                                                             | M        | Week 6-7                 |     |
| **F2.3:** Matching Timeout                                                                                                                                                                                                                  |          |                          |     |
| **F2.3.1:** The system should be able to timeout the matching user after a certain amount of time defined by the server host.                                                                                                               | M        | Week 7-8                 |     |
| **F2.4:** Initialising Matches                                                                                                                                                                                                              | H        |                          |     |
| **F2.4.1:** When a match is found, the user-id of users that have been matched together is passed to the collaboration service for initiating a new session                                                                                 | H        | Week 7-8                 |     |
| **F2.4.2:** When a match is found, a question with the category and difficulty type of the matched users is retrieved from the question service and the retrieved question-id is passed to the session service for initiating a new session | H        | Week 7-8                 |     |
| **F2.4.3:** When a match is found, the user will receive information about their match session (session-id)                                                                                                                                 | H        | Week 7-8                 |     |
| **F3:** Question service – responsible for maintaining a question repository indexed by difficulty level and topics                                                                                                                         |          |                          |     |
| **F3.1:** CRUD Operations for questions                                                                                                                                                                                                     |          |                          |     |
| **F3.1.1:** Questions and question information are stored in a persistent database                                                                                                                                                          | H        | Week 6 \- Recess Week    |     |
| **F3.1.2** Questions can be created by providing the following information: Question Title, Question Description, Question Category, Question Complexity, Test cases and Template Code                                                      | H        | Week 6 \- Recess Week    |     |
| **F3.1.3** For every question created, the question service automatically assigns a unique question-id to the question and saves its information in the database.                                                                           | H        | Week 6 \- Recess Week    |     |
| **F3.1.4** Questions can be deleted from the database by providing the question-id                                                                                                                                                          | H        | Week 6 \- Recess Week    |     |
| **F3.1.5** Questions can be modified by providing the question-id and the information of the question to be updated                                                                                                                         | H        | Week 6 \- Recess Week    |     |
| **F3.2:** Question Retrieval                                                                                                                                                                                                                |          |                          |     |
| **F3.2.1:** Retrieved questions contain the following information: Question-id, Question Title, Question Description, Question Category, Question Complexity, Test cases, and template code                                                 | H        | Week 6 \- Recess Week    |     |
| **F3.2.2:** A list of questions with a given difficulty level can be retrieved                                                                                                                                                              | H        | Week 6 \- Recess Week    |     |
| **F3.2.3:** A list of questions with a given category can be retrieved                                                                                                                                                                      | H        | Week 6 \- Recess Week    |     |
| **F3.2.4:** A list of questions with a given difficulty level and a given category can be retrieved                                                                                                                                         | H        | Week 6 \- Recess Week    |     |
| **F3.2.5:** Retrieval of a single question based on the specified difficulty level and topic category. The question retrieved must match the given difficulty level and topic category.                                                     | M        | Week 6 \- Recess Week    |     |
| **F4:** Collaboration service – provides the mechanism for real-time collaboration (e.g., concurrent code editing) between the authenticated and matched users in the collaborative space.                                                  |          |                          |     |
| **F4.1:** Session Management                                                                                                                                                                                                                |          |                          |     |
| **F4.1.1:** New sessions can be created by providing 2 unique user-ids and a question-id                                                                                                                                                    | H        | Week 7                   |     |
| **F4.1.2:** Each session has a unique session-id, assigned by the system on creation.                                                                                                                                                       | H        | Week 7                   |     |
| **F4.1.3:** Each session has the following information: session-id, question-id, the 2 user-ids that the session was initialised with, status (active, terminated), information about collaborative tools (code editor)                     | H        | Week 7                   |     |
| **F4.1.4:** On creation, session information is stored in a persistent database                                                                                                                                                             | M        | Week 7                   |     |
| **F4.1.5:** Sessions have functionality for user connection and disconnection through a socket                                                                                                                                              | H        | Week 5-6                 |     |
| **F4.1.6:** Sessions only allow users with their corresponding user IDs to connect                                                                                                                                                          | H        | Week 6                   |     |
| **F4.1.7** Sessions can be terminated by updating the status of the session in the database                                                                                                                                                 | H        | Week 7                   |     |
| **F4.1.8** Each session lasts at most 4 hours after which it will be terminated regardless of whether the users are done                                                                                                                    | M        | Week 7                   |     |
| **F4.1.9:** The session should be terminated immediately if both users have disconnected simultaneously from the session                                                                                                                    | H        | Week 5                   |     |
| **F4.1.10:** The user should be notified if their partner has disconnected from the session                                                                                                                                                 | M        | Week 6                   |     |
| **F4.1.11:** On session termination, the session-id is recorded under the matched users’ match history                                                                                                                                      | M        | Week 7                   |     |
| **F4.1.12:** On session termination, any users still connected to the session will be forcibly disconnected                                                                                                                                 | H        | Week 6                   |     |
| **F4.2:** Collaborative Code Editor                                                                                                                                                                                                         |          |                          |     |
| **F4.2.1:** Each session is linked to a collaborative code editor (e.g. Monaco Editor)                                                                                                                                                      | H        | Week 5                   |     |
| **F4.2.2:** Users connected to a session can make edits on the collaborative code editor                                                                                                                                                    | H        | Week 5                   |     |
| **F4.2.3:** Users can make edits in the collaborative code editor at the same time                                                                                                                                                          | H        | Week 5                   |     |
| **F4.2.4:** Changes made in the collaborative code editor by any user can be seen by other users in real-time                                                                                                                               | H        | Week 5                   |     |
| **F4.2.5:** For all users making edits in the same collaborative code editor, they can see other users’ text cursors, along with the text that is being highlighted by other users                                                          | L        | Week 8                   |     |
| **F4.2.6:** On session termination, Code written in the collaborative text editor during a session is saved to the session information                                                                                                      | M        | Week 6-7                 |     |

## Non-Functional Requirements (+ Fulfillment)

| Non-Functional Requirements                                                                                                                                                                                      | Priority | Planned sprint/iteration | PR  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------ | --- |
| **N1:** Security                                                                                                                                                                                                 |          |                          |     |
| **N1.1:** Access Control                                                                                                                                                                                         |          |                          |     |
| **N1.1.1:** The platform must make use of JWT or OAuth 2.0 for user authentication and verification before granting access to any application features.                                                          | H        | Week 6-7                 |     |
| **N1.1.2:** The platform should enforce strict requirements on user passwords \- passwords must be at least 12 characters long, including uppercase letters, lowercase letters, numbers, and special characters. | M        | Week 6-7                 |     |
| **N1.1.3:** The platform should enforce user verification methods (new users must verify their emails)                                                                                                           | M        |                          |     |
| **N1.2:** Data Protection                                                                                                                                                                                        |          |                          |     |
| **N1.2.1:** All sensitive data, including user passwords, must be hashed.                                                                                                                                        | H        | Week 7-8                 |     |
| **N1.2.2:** Secure protocols should be used for all communications between clients and services where relevant.                                                                                                  | H        | Week 7-8                 |     |
| **N1.2.3:** Data access should be role-based, only authorized users can access specific data based on their roles and permissions.                                                                               | M        | Week 7-8                 |     |
| **N1.3:** Logging                                                                                                                                                                                                |          |                          |     |
| **N1.3.1:** The system must log user activities, including login attempts, and changes to user profiles, for at least 90 days.                                                                                   | L        | Week 9-10                |     |
| **N2:** Performance                                                                                                                                                                                              |          |                          |     |
| **N2.1:** Live Coding Latency                                                                                                                                                                                    |          |                          |     |
| **N2.1.1:** Coding platform should be responsive and render changes in code in less than 300ms                                                                                                                   | H        | Week 5-6                 |     |
| **N2.2:** Data Capacity                                                                                                                                                                                          |          |                          |     |
| **N2.2.1:** The system should be able to store details of more than 500 users.                                                                                                                                   | H        | Week 5-6                 |     |
| **N2.2.2:** The system should be able to store at least 1000 questions                                                                                                                                           | H        | Week 5-6                 |     |
| **N2.3:** Dynamic Capacity                                                                                                                                                                                       |          |                          |     |
| **N2.3.1:** The system should be able to support at least 100 concurrent users at once                                                                                                                           | M        | Week 8-9                 |     |
| **N2.4:** Response Time                                                                                                                                                                                          |          |                          |     |
| **N2.4.1:** The system should respond to user requests (for all services) in less than a second. E.g. Log-in, Listing questions/categories, etc.                                                                 | H        | Week 9-10                |     |
| **N3**: Usability                                                                                                                                                                                                |          |                          |     |
| **N3.1:** Intuitive User Interface                                                                                                                                                                               |          |                          |     |
| **N3.1.1:** Crucial functionalities of the app should be available within 3 clicks from the login page                                                                                                           | M        | Week 6-7                 |     |
| **N3.1.2:** The user interface should be uncluttered and minimalistic                                                                                                                                            | M        | Week 6-7                 |     |
| **N3.1.3:** Users should get clear visual feedback (like loading spinners or success/failure notifications) when they complete actions.                                                                          | M        | Week 6-7                 |     |
| **N3.2:** User Experience                                                                                                                                                                                        |          |                          |     |
| **N3.2.1:** The platform should offer a positive and enjoyable user experience                                                                                                                                   | M        | Week 6-7                 |     |
| **N3.2.2:** The design elements such as colours, fonts and layouts should be consistent throughout                                                                                                               | L        | Week 6-7                 |     |
| **N4:** Scalability                                                                                                                                                                                              |          |                          |     |
| **N4.1:** Horizontal Scalability                                                                                                                                                                                 |          |                          |     |
| **N4.1.1:** The platform must be capable of scaling horizontally by adding new instances of services, with no more than 1 minute of downtime during scaling operations                                           | H        | Week 9-10                |     |
| **N4.1.2:** The platform should automatically balance the load between multiple server instances in case of increased traffic                                                                                    | H        | Week 9-10                |     |
| **N4.2:** Vertical Scalability                                                                                                                                                                                   |          |                          |     |
| **N4.2.1:** The architecture should allow upgrading the hardware resources of the servers without significant application changes                                                                                | M        | Week 9-10                |     |
| **N4.3:** Modular Scalability                                                                                                                                                                                    |          |                          |     |
| **N4.3.1:** The application architecture should be modular to support scaling specific components independently without impacting the whole system                                                               | M        | Week 9-10                |     |

##

##

## Selected Nice-to-haves

| Nice-to-have                                                                                                                                                              | Priority | Planned sprint/iteration | PR  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- | :----------------------- | :-- |
| **NH1: Communication**                                                                                                                                                    |          |                          |     |
| **NH1.1:** Real Time Messaging                                                                                                                                            |          |                          |     |
| **NH1.1.1:** Users should be able to send and receive text messages in real time during a peer coding session.                                                            |          |                          |     |
| **NH1.1.2:** Users should receive notifications for new messages while actively participating in a session.                                                               |          |                          |     |
| **NH1.3:** Communication (text, voice chat) within the session should be deleted on session termination                                                                   |          |                          |     |
| **NH2: Question History**                                                                                                                                                 |          |                          |     |
| **NH2.1:** Storage                                                                                                                                                        |          |                          |     |
| **NH2.1.1:** Maintain a record of all questions attempted by each user including the time attempted and the code written.                                                 |          |                          |     |
| **NH2.2:** Users should be able to view their history of attempted questions and delete their history of attempted questions if needed                                    |          |                          |     |
| **NH3: Code execution**                                                                                                                                                   |          |                          |     |
| **NH3.1:** Users should be able to compile and execute written code in the shared editor                                                                                  |          |                          |     |
| **NH3.2:** Users can see the results of the execution of the code                                                                                                         |          |                          |     |
| **NH3.3:** Test cases should be included in the question repository and on code execution, test cases should also be run and the results shown to the user                |          |                          |     |
| **NH4: Enhanced Collaboration Service**                                                                                                                                   |          |                          |     |
| **NH4.1:** Improved Code Editor                                                                                                                                           |          |                          |     |
| **NH4.1.1:** The code editor should support automatic code formatting based on the selected programming language.                                                         |          |                          |     |
| **NH4.1.2:** The code editor should provide syntax highlighting for all available programming languages                                                                   |          |                          |     |
| **NH4: Cloud Deployment**                                                                                                                                                 |          |                          |     |
| **NH4: Kubernetes for horizontal Scaling**                                                                                                                                |          |                          |     |
| **NH6: API gateway that redirects requests to the relevant microservices (Kubernetes Ingress)**                                                                           |          |                          |     |
| **NH6.1:** The API Gateway should route incoming requests to the appropriate microservices based on the request path and method.                                          |          |                          |     |
| **NH6.2:** The API Gateway should handle authentication and authorization, ensuring requests are properly validated before reaching the microservices                     |          |                          |     |
| **NH6.3:** The API Gateway should support rate limiting to prevent abuse and provide monitoring and logging for API usage                                                 |          |                          |     |
| **NH6.4:** The API Gateway should support load balancing across multiple instances of microservices to ensure even distribution of traffic and enhance system reliability |          |                          |     |
| **NH8: Gamification of the platform**                                                                                                                                     |          |                          |     |
| **NH8.1** Users will be given points upon successful completion of their coding challenge.                                                                                |          |                          |     |
| **NH8.2** Users can compete with each other, where there are leaderboards available to see their standings among other users.                                             |          |                          |     |
| **NH8.3** Users will be given badges/rewards based on their standing after a particular “season” of the competition.                                                      |          |                          |     |
| **NH9: Social Features**                                                                                                                                                  |          |                          |     |
| **NH9.1:** Users should be able to view other profiles, which include their display name, profile picture, and recent activity                                            |          |                          |     |
| **NH9.2:** Users must have access to privacy settings where they can control their profile visibility: public, friends-only, or fully private                             |          |                          |     |
| **UH9.3:** “Friend” System \- Users should be able to add other users as friends and view their activity feed, name and profile pictures                                  |          |                          |     |

...

---

# Design

## Architecture and Components

### Architecture Overview

The PeerPrep platform is designed with a **microservices architecture**, leveraging multiple services to ensure modularity, scalability, and ease of deployment. The architecture includes the following main components:

- **User Service**: Manages user profiles, authentication, and authorization.
- **Matching Service**: Matches users based on criteria such as question difficulty and category.
- **Question Service**: Maintains a repository of questions, enabling CRUD operations and retrieval based on difficulty and category.
- **Collaboration Service**: Provides real-time collaborative coding through a synchronized code editor.

## Architectural Decision

1. **Microservices Architecture vs. Monolithic Architecture**

   - We chose a **microservices architecture** over a monolithic approach to promote scalability, flexibility, and ease of maintenance. In a monolithic design, all services are tightly coupled within a single application, which can lead to issues with scalability and deployment.
   - **Justification**:
     - **Scalability**: Microservices allow individual services to be scaled independently based on demand, improving performance and resource utilization.
     - **Flexibility**: Each microservice can be developed, deployed, and maintained independently, enabling our team to use the most suitable tech stack and development strategies for each component.
     - **Fault Isolation**: Issues in one service do not necessarily impact others, allowing for better fault tolerance.

2. **Redis Caching for Matching Service**

   - We implemented **Redis caching** in the Matching Service to optimize performance by reducing latency for frequently accessed data, such as user preferences and match history.
   - **Justification**:
     - **Reduced Latency**: Redis provides quick, in-memory data access, which significantly reduces response time for match-related queries.
     - **Scalability**: Redis supports high request throughput, making it ideal for handling the frequent read/write operations of the Matching Service.

3. **Additional Architectural Decisions**
   - **JWT Authentication**: We chose **JWT (JSON Web Token)** for authentication across services to provide secure, token-based user sessions, reducing the need for persistent server-side sessions.
   - **API Gateway**: Utilized an API Gateway to manage and route traffic across microservices, enabling seamless inter-service communication and load balancing.

## Design Patterns

1. **Model-View-Controller (MVC) Pattern**

   - The MVC pattern organizes the application into three core components:
     - **Model**: Manages the data and business logic.
     - **View**: Handles the presentation layer, displaying data to the user.
     - **Controller**: Acts as an intermediary, processing user input and updating the Model and View accordingly.
   - **Usage**: The MVC pattern is applied in our backend services to ensure separation of concerns, making the codebase more modular and testable.

2. **Model-View-Template (MVT) Pattern**

   - Similar to MVC but with **Template** replacing View. This pattern is used to organize the structure of applications where the frontend and backend are more tightly integrated.
   - **Usage**: MVT is employed in services where server-rendered templates are used, especially when integrating with frontend templating engines.

3. **Publisher-Subscriber Pattern**

   - The Publisher-Subscriber pattern decouples message producers (publishers) and message consumers (subscribers), allowing asynchronous communication.
   - **Usage**: This pattern is used in the Matching Service, where updates about available matches are published to subscribed clients, enabling real-time match notifications.

4. **Adapter Design Pattern**
   - The Adapter pattern helps integrate components with incompatible interfaces by providing a layer that translates calls from one interface to another.
   - **Usage**: Implemented for integrating external libraries or third-party APIs that may have different interfaces, ensuring smooth interaction within our microservices.

## Tech Stack

| Component             | Application/Framework   |
| --------------------- | ----------------------- |
| User Service          | Node.js, Express        |
| Question Service      | Django, MongoDB         |
| Matching Service      | Flask, Redis            |
| Collaboration Service | Socket.io, Express      |
| Frontend              | React, Next.js          |
| Database              | MongoDB                 |
| Authentication        | JWT                     |
| Caching               | Redis                   |
| API Gateway           | Nginx                   |
| CI/CD Pipeline        | GitHub Actions, Jenkins |
| Cloud Deployment      | AWS EC2, S3             |

## Project Plans

The project follows an agile methodology, broken down into weekly sprints. Below is a Gantt chart showing the planned tasks and their timelines:

| Milestone | Task                                 | Week  |
| --------- | ------------------------------------ | ----- |
| D1        | Product Backlog & UI Design          | 1-2   |
| D2        | SPA + REST API for Question Service  | 3-4   |
| D3        | Containerization of Services         | 5     |
| D4        | Message Queues for Matching          | 6-7   |
| D5        | Collaboration Service Implementation | 8-9   |
| D6        | Nice-to-Have Features                | 10-11 |
| D7        | Final Report and Demo Preparation    | 12    |

1. **Sprint Planning**

   - The project follows an Agile methodology with bi-weekly sprints. Each sprint begins with a planning session to define the sprint goals and assign tasks.

2. **Scrum Meetings**

   - Daily standups are conducted to synchronize team progress, address blockers, and track task completion.

3. **Product Backlog**

   - A prioritized list of features and tasks managed in a product backlog. Tasks are divided into epics and user stories, updated regularly based on progress and feedback.

4. **DevOps Practices**

   - Our CI/CD pipeline automates testing, integration, and deployment. Tools like GitHub Actions ensure continuous deployment to production environments.

5. **Documentation and Meetings**
   - Weekly review meetings are held to evaluate progress and refine the backlog. Documentation is maintained for each sprint, including retrospectives and lessons learned.

## Microservices

### 1. User Service

### Description:

- Manages user profiles, authentication, and role-based permissions.

### Implementation:

- Built with Node.js and Express, connected to MongoDB for user data storage.

### Endpoints:

#### Create User Account Request

- **Description**: Initiates a new user account creation request that requires email verification.
- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3001/users`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Validation Rules**:

  - Username: 2-32 characters, can contain a-z, A-Z, 0-9, \_ or -
  - Email: Must be valid email format
  - Password: Minimum 8 characters

- **Responses**:

  | Response Code               | Explanation                                      |
  | --------------------------- | ------------------------------------------------ |
  | 201 (Created)               | Account request created, verification email sent |
  | 400 (Bad Request)           | Invalid input data                               |
  | 409 (Conflict)              | Username or email already exists                 |
  | 500 (Internal Server Error) | Server error                                     |

- **Success Response Body**:
  ```json
  {
    "message": "Created new user {username} request successfully",
    "data": {
      "token": "email_verification_token",
      "expiry": "2024-03-21T10:30:00.000Z"
    }
  }
  ```

#### Confirm User Account

- **Description**: Confirms a user account after email verification.
- **HTTP Method**: `PATCH`
- **Endpoint**: `http://localhost:3001/auth/{userId}`
- **Headers**:

  - Required: `Authorization: Bearer <EMAIL_VERIFICATION_TOKEN>`

- **Responses**:

  | Response Code               | Explanation                           |
  | --------------------------- | ------------------------------------- |
  | 200 (OK)                    | Account confirmed successfully        |
  | 401 (Unauthorized)          | Invalid or expired verification token |
  | 500 (Internal Server Error) | Server error                          |

- **Success Response Body**:
  ```json
  {
      "message": "{userId} registered and logged in!",
      "data": {
          "accessToken": "jwt_access_token",
          "id": "user_id",
          "username": "string",
          "email": "string",
          "isAdmin": boolean,
          "isVerified": boolean,
          "createdAt": "timestamp"
      }
  }
  ```

#### Delete Account Creation Request

- **Description**: Deletes an unverified account creation request.
- **HTTP Method**: `DELETE`
- **Endpoint**: `http://localhost:3001/users/{email}`

- **Responses**:

  | Response Code               | Explanation                          |
  | --------------------------- | ------------------------------------ |
  | 200 (OK)                    | Account request deleted successfully |
  | 403 (Forbidden)             | Cannot delete verified accounts      |
  | 404 (Not Found)             | User not found or invalid email      |
  | 500 (Internal Server Error) | Server error                         |

#### Refresh Email Verification Token

- **Description**: Refreshes the email verification token and sends a new verification email.
- **HTTP Method**: `PATCH`
- **Endpoint**: `http://localhost:3001/users/{userId}/resend-request`
- **Headers**:

  - Required: `Authorization: Bearer <OLD_EMAIL_VERIFICATION_TOKEN>`

- **Responses**:

  | Response Code               | Explanation                                     |
  | --------------------------- | ----------------------------------------------- |
  | 201 (Created)               | New verification token generated and email sent |
  | 401 (Unauthorized)          | Invalid or expired verification token           |
  | 500 (Internal Server Error) | Server error                                    |

- **Success Response Body**:
  ```json
  {
    "message": "Token refreshed successfully",
    "data": {
      "token": "new_email_verification_token",
      "expiry": "2024-03-21T10:30:00.000Z"
    }
  }
  ```

#### Create User

- **Description**: Allows adding a new user to the database (i.e., user registration).
- **HTTP Method**: `POST`
- **Endpoint**: `http://localhost:3001/users`
- **Body**:

  - Required: `username` (string), `email` (string), `password` (string)

    ```json
    {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- **Responses**:

  | Response Code               | Explanation                                           |
  | --------------------------- | ----------------------------------------------------- |
  | 201 (Created)               | User created successfully, created user data returned |
  | 400 (Bad Request)           | Missing fields                                        |
  | 409 (Conflict)              | Duplicate username or email encountered               |
  | 500 (Internal Server Error) | Database or server error                              |

#### Get User

- **Description**: Allows retrieval of a single user's data from the database using the user's ID.
- **HTTP Method**: `GET`
- **Endpoint**: `http://localhost:3001/users/{userId}`
- **Parameters**:

  - Required: `userId` path parameter
  - Example: `http://localhost:3001/users/60c72b2f9b1d4c3a2e5f8b4c`

- **Headers**:

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - **Explanation**: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token to ensure that the client is authorized to access the data.

  - **Auth Rules**:
    - Admin users: Can retrieve any user's data.
    - Non-admin users: Can only retrieve their own data.

- **Responses**:

  | Response Code               | Explanation                                              |
  | --------------------------- | -------------------------------------------------------- |
  | 200 (OK)                    | Success, user data returned                              |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT         |
  | 403 (Forbidden)             | Access denied for non-admin users accessing others' data |
  | 404 (Not Found)             | User with the specified ID not found                     |
  | 500 (Internal Server Error) | Database or server error                                 |

#### Get All Users

- **Description**: Allows retrieval of all users' data from the database.
- **HTTP Method**: `GET`
- **Endpoint**: `http://localhost:3001/users`
- **Headers**:

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - **Auth Rules**:
    - Admin users: Can retrieve all users' data.
    - Non-admin users: Not allowed access.

- **Responses**:

  | Response Code               | Explanation                                      |
  | --------------------------- | ------------------------------------------------ |
  | 200 (OK)                    | Success, all user data returned                  |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
  | 403 (Forbidden)             | Access denied for non-admin users                |
  | 500 (Internal Server Error) | Database or server error                         |

#### Update User

- **Description**: Allows updating a user and their related data in the database using the user's ID.
- **HTTP Method**: `PATCH`
- **Endpoint**: `http://localhost:3001/users/{userId}`
- **Parameters**:
  - Required: `userId` path parameter
- **Body**:

  - At least one of the following fields is required: `username` (string), `email` (string), `password` (string)

    ```json
    {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- **Headers**:

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - **Auth Rules**:
    - Admin users: Can update any user's data.
    - Non-admin users: Can only update their own data.

- **Responses**:

  | Response Code               | Explanation                                             |
  | --------------------------- | ------------------------------------------------------- |
  | 200 (OK)                    | User updated successfully, updated user data returned   |
  | 400 (Bad Request)           | Missing fields                                          |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT        |
  | 403 (Forbidden)             | Access denied for non-admin users updating others' data |
  | 404 (Not Found)             | User with the specified ID not found                    |
  | 409 (Conflict)              | Duplicate username or email encountered                 |
  | 500 (Internal Server Error) | Database or server error                                |

#### Update User Privilege

- **Description**: Allows updating a user’s privilege, i.e., promoting or demoting them from admin status.
- **HTTP Method**: `PATCH`
- **Endpoint**: `http://localhost:3001/users/{userId}`
- **Parameters**:
  - Required: `userId` path parameter
- **Body**:

  - Required: `isAdmin` (boolean)

    ```json
    {
      "isAdmin": true
    }
    ```

- **Headers**:

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - **Auth Rules**:
    - Admin users: Can update any user's privilege.
    - Non-admin users: Not allowed access.

- **Responses**:

  | Response Code               | Explanation                                      |
  | --------------------------- | ------------------------------------------------ |
  | 200 (OK)                    | User privilege updated successfully              |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
  | 403 (Forbidden)             | Access denied for non-admin users                |
  | 404 (Not Found)             | User with the specified ID not found             |
  | 500 (Internal Server Error) | Database or server error                         |

#### Delete User

- **Description**: Allows deleting a user from the database using the user's ID.
- **HTTP Method**: `DELETE`
- **Endpoint**: `http://localhost:3001/users/{userId}`
- **Parameters**:

  - Required: `userId` path parameter

- **Headers**:

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - **Auth Rules**:
    - Admin users: Can delete any user.
    - Non-admin users: Can only delete their own account.

- **Responses**:

  | Response Code               | Explanation                                      |
  | --------------------------- | ------------------------------------------------ |
  | 200 (OK)                    | User deleted successfully                        |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
  | 403 (Forbidden)             | Access denied for non-admin users                |
  | 404 (Not Found)             | User with the specified ID not found             |
  | 500 (Internal Server Error) | Database or server error                         |

## 2. Question Service

### Description:

Manages question repository and CRUD operations for interview questions.

### Implementation:

Built with Nextjs, using MongoDB to store question metadata and templates.

### Endpoints:

#### Create Question

- This endpoint allows you to add a new question to the database.

- **HTTP Method**: POST

- **Endpoint**: `http://localhost:8003/api/questions`

- **Request Body**

  - **Required Parameters**
    - `title` (required): Title of the question (string)
    - `description`: Question description (string)
    - `category`: An array of categories that the question belongs to
    - `complexity`: Complexity level of the question (Easy, Medium, Hard)
    - `templateCode`: Template code for the question
    - `testCases`: An array of test cases for the question in this format:
      `["input1 -> output1", "input2 -> output2"]`
  - **Example**:

    ```json
    {
      "title": "Reverse a String",
      "description": "Write a function that reverses a string",
      "category": ["Algorithms", "Strings"],
      "complexity": "Easy",
      "templateCode": "function reverseString(str) { }",
      "testCases": ["hello -> olleh", "world -> dlrow"]
    }
    ```

**Responses**

| Response Code | Explanation                                                |
| ------------- | ---------------------------------------------------------- |
| 201           | Question created successfully                              |
| 400           | Bad request. Missing required parameters or invalid inputs |
| 500           | Internal Server Error                                      |

#### Update Question

- This endpoint allows you to update an existing question in the database.
- **HTTP Method**: PUT
- **Endpoint**: `http://localhost:8003/api/questions/<id>`
- **Request Body**

  - **Required Parameters**
    - `title` (required): Title of the question (string)
    - `description`: Question description (string)
    - `category`: An array of categories that the question belongs to
    - `complexity`: Complexity level of the question (Easy, Medium, Hard)
  - **Optional Parameters**
    - `templateCode`: Template code for the question
    - `testCases`: An array of test cases for the question in this format:
      `["input1 -> output1", "input2 -> output2"]`
  - **Example**:

    ```json
    {
      "title": "Reverse a String",
      "description": "Write a function that reverses a string",
      "category": ["Algorithms", "Strings"],
      "complexity": "Easy",
      "templateCode": "function reverseString(str) { }",
      "testCases": ["hello -> olleh", "world -> dlrow"]
    }
    ```

**Responses**

| Response Code | Explanation                                                |
| ------------- | ---------------------------------------------------------- |
| 200           | Question updated successfully                              |
| 400           | Bad request. Missing required parameters or invalid inputs |
| 404           | Question not found                                         |
| 500           | Internal Server Error                                      |

#### Delete Question

- This endpoint allows you to delete a question from the database.
- **HTTP Method**: DELETE
- **Endpoint**: `http://localhost:8003/api/questions/<id>`
- **Request Parameters**
  - `id`: refers to the question id (1-indexed)
  - **Example**: `http://localhost:8003/api/questions/1`
    - This will delete the question with id 1 from the database.

**Responses**

| Response Code | Explanation                   |
| ------------- | ----------------------------- |
| 200           | Question deleted successfully |
| 404           | Question not found            |
| 500           | Internal Server Error         |

#### Retrieve Questions (with filter)

- This endpoint allows you to retrieve questions from the database with optional filters.
- **HTTP Method**: GET
- **Endpoint**: `http://localhost:8003/api/questions?<params>`
- **Query Parameters**
  - `?title=`: Filter by question title
  - `?category=`: Filter by category. Multiple categories can be specified by repeating the parameter: `?category=Algorithms&category=Arr&category=Database`
  - `?page=`: Page number for pagination (default is 1)
  - `?limit=`: Number of questions per page (default is 10)
  - `?complexity=`: Filter by complexity level
  - `?sort=`: Sort the results based on a parameter. Use `?sort=title` for ascending order and `?sort=-title` for descending order by title.
- **Example**: `http://localhost:8003/api/questions?title=Reverse&category=Algorithms&category=Strings&page=1&complexity=Easy&sort=title`
- Invalid parameters and values will be ignored.

**Responses**

| Response Code | Explanation                      |
| ------------- | -------------------------------- |
| 200           | Questions retrieved successfully |
| 500           | Internal Server Error            |

#### Retrieve Question

- This endpoint allows you to retrieve a single question from the database.
- **HTTP Method**: GET
- **Endpoint**: `http://localhost:8003/api/questions/<id>`
- **Request Parameters**
  - `id`: refers to the question id (1-indexed)
  - **Example**: `http://localhost:8003/api/questions/1`
    - This will retrieve the question with id 1 from the database.

**Responses**

| Response Code | Explanation                     |
| ------------- | ------------------------------- |
| 200           | Question retrieved successfully |
| 404           | Question not found              |
| 500           | Internal Server Error           |

#### Retrieve Unique Categories

- This endpoint allows you to retrieve a list of unique categories from the database.
- **HTTP Method**: GET
- **Endpoint**: `http://localhost:8003/api/questions/categories/unique`

**Responses**

| Response Code | Explanation                       |
| ------------- | --------------------------------- |
| 200           | Categories retrieved successfully |
| 500           | Internal Server Error             |

#### Retrieve Unique Complexities

- This endpoint allows you to retrieve a list of unique complexities from the database.
- **HTTP Method**: GET
- **Endpoint**: `http://localhost:8003/api/questions/complexity/unique`

#### Retrieve Single Question by Criteria

- This endpoint allows you to retrieve a question matching the difficulty and topic.
- **HTTP Method**: POST
- **Endpoint**: `http://localhost:8003/api/questions/question/by-criteria`
- **Request Body**

  - **Required Parameters**

    - `category`: An array of categories that the question belongs to
    - `complexity`: Complexity level of the question (Easy, Medium, Hard)

    ```json
    {
      "category": ["Algorithms", "Strings"],
      "complexity": "Easy"
    }
    ```

**Responses**

| Response Code | Explanation                     |
| ------------- | ------------------------------- |
| 200           | Question retrieved successfully |
| 500           | Internal Server Error           |

#### Summary of API Endpoints

| **Operation**                        | **Method** | **Endpoint**                                               | **Params/Request Body**                                                                                                                                                                                                          |
| ------------------------------------ | ---------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create a question**                | POST       | `http://localhost:8003/api/questions`                      | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }`                                                        |
| **Update a question**                | PUT        | `http://localhost:8003/api/questions/<id>`                 | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }`                                                        |
| **Delete a question**                | DELETE     | `http://localhost:8003/api/questions/<id>`                 | `id`: refers to the question id (1-indexed)                                                                                                                                                                                      |
| **Retrieve questions (with filter)** | GET        | `http://localhost:8003/api/questions?<params>`             | `?title=`, `?category=`, `?page=`, `?complexity=`, `?sort=`. Filters can be stacked. Multiple categories: `?category=Algorithms&category=Arr&category=Database`. Sorting: `?sort=title` (ascending), `?sort=-title` (descending) |
| **Retrieve a question**              | GET        | `http://localhost:8003/api/questions/<id>`                 | `id`: refers to the question id (1-indexed)                                                                                                                                                                                      |
| **Retrieve unique categories**       | GET        | `http://localhost:8003/api/questions/categories/unique`    | None                                                                                                                                                                                                                             |
| **Retrieve unique complexities**     | GET        | `http://localhost:8003/api/questions/complexity/unique`    | None                                                                                                                                                                                                                             |
| **Retrieve a question by criteria**  | GET        | `http://localhost:8003/api/questions/question/by-criteria` | None                                                                                                                                                                                                                             |

## 3. Matching Service

### Description:

Pairs users for mock coding sessions based on complexity level and topic preferences.

### Implementation:

Built with Nextjs, using Redis for caching user match data to reduce latency.

### Endpoints:

#### **Authentication**

All endpoints require the client to include a JWT (JSON Web Token) under socket.io "auth" object for authentication. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token with the user-service to ensure that the client is authorized for matchmaking.

#### **Client Events**

#### Register For Matching

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

#### Deregister For Matching

- This event allows a user to deregister from the matching service.
- socket event: `deregisterForMatching`
- Parameters: None
- Example:
  ```
  socket.emit('deregisterForMatching')
  ```
- Responses: None

#### Disconnect

- This event is triggered when a user disconnects from the socket.
- socket event: `disconnect`
  - The user will be automatically deregistered from the matching service when they disconnect.

#### **Server Events**

#### Match Found

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

#### Registration Success

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

#### Error

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

#### Timeout

- This event is triggered when the matching service is unable to find a match within the specified timeout.
- socket event: `matchingTimeout`
- Data: None

## 4. Collaboration Service

### Description:

Provides a real-time collaborative coding environment for users during interviews.

### Implementation:

Built with Socket.io and Express to enable real-time interactions.

### Endpoints:

#### Authentication

Endpoints require authentication via API keys or JWTs. The `validateApiKey` middleware is used for creating sessions, while `validateApiJWT` is used for user session checks and leaving sessions.

#### 1. Create a New Session

- **Endpoint**: `POST /create`
- **Description**: Creates a new collaborative session with specified participants and a question.
- **Request Body**:
  ```json
  {
    "participants": ["userId1", "userId2"],
    "questionId": "questionId"
  }
  ```
- **Responses**:
  | Response Code | Explanation | Response Body |
  | ------------- | ---------------------------------------------------| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 201 | Session created successfully | `json { "session_id": "generated-session-id", "date_created": "date-time", "participants": ["userId1", "userId2"], "language": "language", "question": { /* question details */ }, "active": true, "activeUsers": ["userId1", "userId2"], "yDoc": "templateCodeYDocUpdate" } ` |
  | 400 | Bad Request: Missing participants or question ID | `json { "message": "Participants and question ID are required" } ` |
  | 404 | Not Found: Unable to retrieve question data | `json { "message": "Unable to retrieve question data" } ` |
  | 500 | Internal Server Error | `json { "message": "Error message" } ` |

### 2. Check Session Status

- **Endpoint**: `GET /check`
- **Description**: Checks if a user is part of an active session.
- **Request Body**:
  ```json
  {
    "userId": "userId"
  }
  ```
- **Responses**:
  | Response Code | Explanation | Response Body |
  | ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
  | 200 | Active session found | `json { "message": "Active session found", "sessionId": "session-id" } ` |
  | 204 | No Content: No active session found | No content in the response body. |
  | 500 | Internal Server Error | `json { "message": "Error message" } ` |

### 3. Leave Session

- **Endpoint**: `GET /leave`
- **Description**: Removes a user from the active session.
- **Request Body**:
  ```json
  {
    "userId": "userId"
  }
  ```
- **Responses**:
  | Response Code | Explanation | Response Body |
  | ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
  | 200 | User removed from session | `json { "message": "User removed from session", "sessionId": "session-id" } ` |
  | 404 | Not Found: User not in session | `json { "message": "User not in session" } ` |
  | 500 | Internal Server Error | `json { "message": "Error message" } ` |

### 4. Terminate Session

- **Endpoint**: `POST /terminate`
- **Description**: Terminates an active session for a user.
- **Request Body**:
  ```json
  {
    "userId": "userId"
  }
  ```
- **Responses**:
  | Response Code | Explanation | Response Body |
  | ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
  | 200 | Session terminated successfully | `json { "message": "Session terminated successfully" } ` |
  | 404 | Not Found: Session not found | `json { "message": "Session not found" } ` |
  | 500 | Internal Server Error | `json { "message": "Error message" } ` |

## 5. Nice-to-Haves

- **Syntax Highlighting**: Enables syntax-highlighted code editing within the collaborative environment.
- **Question History**: Tracks previously attempted questions for each user.
- **Real-Time Chat**: Allows users to communicate during collaborative sessions.
- **Deployment**: Hosted on GCS with auto-scaling enabled.

## Frontend

1. **Tech Stack**:
   - Built with **React** and **Next.js**, ensuring a modern, responsive UI with server-side rendering for fast initial load times.
2. **Design Decisions**:
   - **State Management**: Utilizes Redux for efficient state management across components.
   - **Responsive Design**: Ensures optimal viewing experience across devices using CSS frameworks like Tailwind CSS.

## Application Screenshots

_Include screenshots of each core feature, such as user profile, question repository, matching interface, collaborative coding environment, and real-time chat._

## Suggested Enhancements

1. **Enhanced Analytics**: Track user performance and match outcomes to provide tailored recommendations.
2. **AI-Powered Matching**: Utilize machine learning algorithms for more accurate user matching.
3. **Multi-language Support**: Expand the platform to support multiple languages to reach a global audience.

## Learning Points

1. **Microservices Architecture**: The experience provided insights into microservices' scalability and fault isolation benefits, along with challenges in managing inter-service communication.
2. **DevOps Practices**: Implementing a CI/CD pipeline taught us the importance of automation in software delivery.
3. **Real-Time Communication**: Working with WebSockets for the collaborative environment highlighted the nuances of real-time data handling.
4. **Agile Development**: Agile methodologies, including sprint planning and retrospectives, were essential in keeping the project on track and responsive to changes.

## \<Add any other relevant information about your project as new sections here\>

...
