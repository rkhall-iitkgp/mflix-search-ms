# Movie Search Microservice

This is a Node.js microservice built to provide search functionality for a movie database. It utilizes MongoDB for data storage and implements user authentication, storing user search history securely.

## Features
- Movie Search - Fuzzy, Semantic
- User Authentication
- Movie Search
- Payment

## Installation

1. Clone the repository:

```bash
git clone https://github.com/{GITHUB_ID}/mflix-search-ms.git
```

2. Install dependencies:
```bash
npm install -g pnpm
pnpm install
```

3. Set up environment variables:

Create a .env file in the root directory of the project and populate it with the following variables:

```makefile
FRONTEND_URL="" # The URL of the frontend application.
PORT=5000 # The port number on which the microservice will run.
MONGO_URI = # URI for connecting to MongoDB.
MAIL_HOST = smtp.gmail.com
MAIL_USER = opensoft2024@gmail.com
MAIL_PASS = # SMTP configuration for sending emails. 
OTP_KEY = # Secret key for generating one-time passwords (OTPs).
OTP_DIGITS = 6 # Number of digits in the generated OTP.
OTP_EXPIRE_TIME = 300 # Expiration time for OTPs (in seconds).
ACCESS_SECRET = # Secret and expiration time for access tokens.
ACCESS_EXPIRE_TIME = 2h
REFRESH_SECRET = 
REFRESH_EXPIRE_TIME=7d
NODE_TLS_REJECT_UNAUTHORIZED = 0 # Set to 0 to disable SSL certificate validation (not recommended for production).
OPEN_AI_API_KEY = # API key for accessing OpenAI services.  
MODEL=gpt-3.5-turbo # The version of the GPT model being used.
DEPLOYMENT=local # Specifies the deployment environment (e.g., local, production).
STRIPE_SECRET_KEY= # Secret key for accessing Stripe API 
```

### Usage
Once the installation and environment variables setup is complete, start the microservice:

```bash
pnpm start
```