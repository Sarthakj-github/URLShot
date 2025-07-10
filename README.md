# Mini URL Shortener API

A simple, fast, and efficient REST API built with Node.js, Express, and MongoDB that shortens long URLs. This API supports custom time-to-live (TTL) for temporary links.

---

## Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM
-   **Dependencies**:
    -   `nanoid` for unique, URL-friendly short code generation
    -   `valid-url` for robust URL validation
    -   `dotenv` for managing environment variables

---

## Features

-   Shorten any valid URL into a 7-character code.
-   Redirect short URLs to their original destination.
-   Prevents duplicate entries for the same original URL.
-   Optional Time-To-Live (TTL) for creating links that expire.
-   Robust input validation and clear error messages.

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) instance (local, Docker, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster).

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd url-shortener-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create an Environment File

Create a `.env` file in the root of the project and add the following variables. A `.env.example` file is provided as a template.

```env
# The port the server will run on
PORT=5000

# Your full MongoDB connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/yourDatabase

# The base URL for constructing the short links
BASE_URL=http://localhost:5000
```

### 5. Running the Application

To run the server in development mode with auto-reloading (thanks to `nodemon`), use:

```bash
npm run dev
```

The server will start and be available at `http://localhost:5000`. You will see log messages in your console confirming the server is running and connected to the database.

---

## API Documentation

You can use an API client like [Postman](https://www.postman.com/) or `curl` to interact with the endpoints.

### 1. Shorten a URL

Creates a new short URL. If the URL has been shortened before, it returns the existing entry.

-   **Endpoint**: `POST /shorten`
-   **Request Body**:
    -   `originalUrl` (string, required): The URL you want to shorten.
    -   `ttl` (number, optional): Time-to-live in seconds. If provided, the link will expire after this duration.

#### Example Request (Permanent Link)

```json
{
    "originalUrl": "https://expressjs.com/en/guide/routing.html"
}
```

#### Example Request (Link that expires in 1 hour)

```json
{
    "originalUrl": "https://docs.google.com/document/d/some-private-doc",
    "ttl": 3600
}
```

#### Success Response (`201 Created` or `200 OK`)

```json
{
    "shortUrl": "http://localhost:5000/aB1cD2e"
}
```

#### Error Responses

-   **Status `400 Bad Request`** (Invalid input)
    ```json
    {
        "error": "Invalid URL format"
    }
    ```
-   **Status `500 Internal Server Error`**
    ```json
    {
        "error": "Server error, please try again"
    }
    ```

---

### 2. Redirect to Original URL

Redirects a short code to its corresponding original URL.

-   **Endpoint**: `GET /:code`
-   **URL Parameter**:
    -   `code` (string, required): The 7-character short code.

#### Example Usage

Simply open the short URL in your browser or use `curl -L` to follow the redirect:

```bash
# In your browser's address bar:
http://localhost:5000/aB1cD2e

# Or with curl:
curl -L http://localhost:5000/aB1cD2e
```

#### Action

-   On success, the server responds with a `301 Moved Permanently` redirect to the `originalUrl`.

#### Error Responses

-   **Status `404 Not Found`** (The code does not exist)
    ```json
    {
        "error": "No URL found for this code"
    }
    ```
-   **Status `410 Gone`** (The link existed but has expired)
    ```json
    {
        "error": "This link has expired."
    }
    ```
