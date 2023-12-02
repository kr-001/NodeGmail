Automate your Gmail inbox with this Node.js application that replies to unread emails, labels them, and prevents duplicate responses.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Code Explanation](#code-explanation)
  - [1. Authentication (`/auth/google`)](#1-authentication-authgoogle)
  - [2. Label Creation (`createLabel`)](#2-label-creation-createla)
  - [3. Authorization Check (`authorize`)](#3-authorization-check-authorize)
  - [4. Get Unread Emails (`getUnreadEmails`)](#4-get-unread-emails-getunreademails)
  - [5. Check Prior Replies (`checkPriorReplies`)](#5-check-prior-replies-checkpriorreplies)
  - [6. Send Reply (`sendReply`)](#6-send-reply-sendreply)
  - [7. Add Label (`addLabel`)](#7-add-label-addlabel)
  - [8. Main Processing Loop (`main`)](#8-main-processing-loop-main)
  - [9. Server Setup (`app.listen`)](#9-server-setup-applisten)
  - [10. Periodic Execution (`setInterval(main, getRandomInterval())`)](#10-periodic-execution-setintervalmain-getrandominterval)
- [Customization](#customization)

## Prerequisites
1. **Google API Credentials:**
   - Obtain the `clientId`, `clientKey`, and `redirectUri` by setting up a project in the [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the Gmail API for the project.
   
2. **Node.js:**
   - Ensure you have Node.js installed on your machine.

3. **Environment Variables:**
   - Set the following environment variables:
     - `GOOGLE_CLIENT_ID`: Your Google API client ID.
     - `GOOGLE_CLIENT_KEY`: Your Google API client key.
     - `GOOGLE_REDIRECT_URI`: Your Google API redirect URI.

4. **Permissions:**
   - Ensure the Gmail account specified in `userId` has the necessary permissions for accessing and modifying emails.

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/kr-001/NodeGmail.git
   cd NodeGmail
Install dependencies:

bash
Copy code
npm install
Run the application:

bash
Copy code
npm start
Authorize the application:

Visit the provided authorization URL in your browser to grant access to the Gmail account.
Code Explanation
1. Authentication (/auth/google)
Handles the OAuth2 authentication flow.
Saves and loads tokens to/from token.json.
2. Label Creation (createLabel)
Checks if the label "NodeMails" exists; if not, creates it.
... [Continue with the rest of the sections]

Customization
Adjust the reply message in the sendReply function.
Modify label settings in the createLabel function.
Fine-tune the processing interval using getRandomInterval.
