# Question Service API Guide

This directory contains a [postman collection](./Question-Service%20API.postman_collection.json) for the Question Service API.

## Create Question

- This endpoint allows you to add a new question to the database.

- HTTP Method: POST

- Endpoint: `http://localhost:8003/api/questions`

- Request Body
  - Required Parameters
    - `title` (required): Title of the question (string)
    - `description`: Question description (string)
    - `category`: An array of categories that the question belongs to
    - `complexity`: Complexity level of the question (Easy, Medium, Hard)
    - `templateCode`: Template code for the question
    - `testCases`: An array of test cases for the question in this format:
       `["input1 -> output1", "input2 -> output2"]`
  - Example:

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

|Response Code| Explanation|
|-------------|------------|
|201| Question created successfully|
|400| Bad request. Missing required parameters or invalid inputs|
|500| Internal Server Error |

## Update Question

- This endpoint allows you to update an existing question in the database.
- HTTP Method: PUT
- Endpoint: `http://localhost:8003/api/questions/<id>`
- Request Body
  - Required Parameters
    - `title` (required): Title of the question (string)
    - `description`: Question description (string)
    - `category`: An array of categories that the question belongs to
    - `complexity`: Complexity level of the question (Easy, Medium, Hard)
  - Optional Parameters
    - `templateCode`: Template code for the question
    - `testCases`: An array of test cases for the question in this format:
       `["input1 -> output1", "input2 -> output2"]`
  - Example:

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

|Response Code| Explanation|
|-------------|------------|
|200| Question updated successfully|
|400| Bad request. Missing required parameters or invalid inputs|
|404| Question not found|
|500| Internal Server Error |

## Delete Question

- This endpoint allows you to delete a question from the database.
- HTTP Method: DELETE
- Endpoint: `http://localhost:8003/api/questions/<id>`
- Request Parameters
  - `id`: refers to the question id (1-indexed)
  - Example: `http://localhost:8003/api/questions/1`
    - This will delete the question with id 1 from the database.

**Responses**

|Response Code| Explanation|
|-------------|------------|
|200| Question deleted successfully|
|404| Question not found|
|500| Internal Server Error |

## Retrieve Questions (with filter)

- This endpoint allows you to retrieve questions from the database with optional filters.
- HTTP Method: GET
- Endpoint: `http://localhost:8003/api/questions?<params>`
- Query Parameters
  - `?title=`: Filter by question title
  - `?category=`: Filter by category. Multiple categories can be specified by repeating the parameter: `?category=Algorithms&category=Arr&category=Database`
  - `?page=`: Page number for pagination (default is 1)
  - `?limit=`: Number of questions per page (default is 10)
  - `?complexity=`: Filter by complexity level
  - `?sort=`: Sort the results based on a parameter. Use `?sort=title` for ascending order and `?sort=-title` for descending order by title.
- Example: `http://localhost:8003/api/questions?title=Reverse&category=Algorithms&category=Strings&page=1&complexity=Easy&sort=title`
- Invalid parameters and values will be ignored.

**Responses**

|Response Code| Explanation|
|-------------|------------|
|200| Questions retrieved successfully|
|500| Internal Server Error |

## Retrieve Question

- This endpoint allows you to retrieve a single question from the database.
- HTTP Method: GET
- Endpoint: `http://localhost:8003/api/questions/<id>`
- Request Parameters
  - `id`: refers to the question id (1-indexed)
  - Example: `http://localhost:8003/api/questions/1`
    - This will retrieve the question with id 1 from the database.

**Responses**

|Response Code| Explanation|
|-------------|------------|
|200| Question retrieved successfully|
|404| Question not found|
|500| Internal Server Error |

## Retrieve Unique Categories

- This endpoint allows you to retrieve a list of unique categories from the database.
- HTTP Method: GET
- Endpoint: `http://localhost:8003/api/questions/categories/unique`

**Responses**

|Response Code| Explanation|
|-------------|------------|
|200| Categories retrieved successfully|
|500| Internal Server Error |

## Retrieve Unique Complexities

- This endpoint allows you to retrieve a list of unique complexities from the database.
- HTTP Method: GET
- Endpoint: `http://localhost:8003/api/questions/complexity/unique`

**Responses**

|Response Code| Explanation|
|-------------|------------|
|200| Complexities retrieved successfully|
|500| Internal Server Error |

## Summary of API Endpoints

| **Operation**            | **Method** | **Endpoint**                               | **Params/Request Body**                                                                                                                                             |
|--------------------------|------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Create a question**     | POST       | `http://localhost:8003/api/questions`      | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }` |
| **Update a question**     | PUT        | `http://localhost:8003/api/questions/<id>` | `{ "title": <string>, "description": <string>, "category": <an array of strings>, "complexity": <string>, "templateCode": <string>, "testCases": <an array of strings> }` |
| **Delete a question**     | DELETE     | `http://localhost:8003/api/questions/<id>` | `id`: refers to the question id (1-indexed)                                                                                                                           |
| **Retrieve questions (with filter)** | GET        | `http://localhost:8003/api/questions?<params>` | `?title=`, `?category=`, `?page=`, `?complexity=`, `?sort=`. Filters can be stacked. Multiple categories: `?category=Algorithms&category=Arr&category=Database`. Sorting: `?sort=title` (ascending), `?sort=-title` (descending) |
| **Retrieve a question**   | GET        | `http://localhost:8003/api/questions/<id>` | `id`: refers to the question id (1-indexed)
| **Retrieve unique categories** | GET        | `http://localhost:8003/api/questions/categories/unique` | None                                                                                                  |
| **Retrieve unique complexities** | GET        | `http://localhost:8003/api/questions/complexity/unique` | None                                                                                                  |
