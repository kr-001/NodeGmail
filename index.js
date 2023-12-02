const { google } = require('googleapis');
const gmail = google.gmail('v1');
const fs = require('fs').promises;
const express = require('express');

const app = express();
//For Security, GOOGLE CLIENT ID AND KEY ARE STORED IN ENV VARIABLES.
const clientId = process.env.GOOGLE_CLIENT_ID; 
const clientKey = process.env.GOOGLE_CLIENT_KEY;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;
console.log(redirectUri);
const userId = "ravikumarpandey1998@gmail.com";
const tokenPath = './token.json';

// OAuth Client
const oAuthClient = new google.auth.OAuth2(
    clientId,
    clientKey,
    redirectUri
);

app.get('/auth/google', async (req, res) => {
    const code = req.query.code;
    const { tokens } = await oAuthClient.getToken(code);
    oAuthClient.setCredentials(tokens);
    await fs.writeFile(tokenPath, JSON.stringify(tokens));
    res.send('Authentication successful! You can close this tab.');
});

const getRandomInterval = () => Math.floor(Math.random() * (120000 - 45000 + 1)) + 45000;

const authorize = async () => {
    try {
        const tokenFile = await fs.readFile(tokenPath);
        oAuthClient.setCredentials(JSON.parse(tokenFile));
    } catch (err) {
        const authUrl = oAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/gmail.modify'],
        });
        console.log('Follow this app to authorize with Google:', authUrl);
    }
};

const getUnreadEmails = async () => {
    const res = await gmail.users.messages.list({
        userId: userId,
        q: `is:unread`,
        auth: oAuthClient,
    });
    return res.data.messages || [];
};

const checkPriorReplies = async (threadId) => {
    const res = await gmail.users.messages.list({
        userId: userId,
        q: `thread:${threadId} from:me`,
        auth: oAuthClient,
    });
    return res.data.messages ? res.data.messages.length > 0 : false;
};

const sendReply = async (emailAddress) => {
    const message = "Thanks for contacting me! I will reply as soon as possible.";
    await gmail.users.messages.send({
        userId: userId,
        auth: oAuthClient,
        resource: {
            raw: Buffer.from(
                `From: ${userId}\r\nTo: ${emailAddress}\r\nSubject: Re:Vacation\r\n\r\n${message}`
            ).toString('base64'),
        },
    });
};

const addLabel = async (emailId) => {
    await gmail.users.messages.modify({
        userId: userId,
        id: emailId,
        auth: oAuthClient,
        resource: {
            addLabelIds: ['INBOX'],
            removeLabelIds: ['UNREAD'],
        },
    });
};

const main = async () => {
    try {
        await authorize();
        const unreadEmails = await getUnreadEmails();
        for (const email of unreadEmails) {
            const threadId = email.threadId;
            const emailId = email.id;

            const emailDetails = await gmail.users.messages.get({
                userId: userId,
                id: emailId,
                auth: oAuthClient,
            });

            const emailAddress = emailDetails.data.payload.headers.find(header => header.name === 'From').value;

            if (!(await checkPriorReplies(threadId))) {
                await sendReply(emailAddress);
                await addLabel(emailId);
                console.log(`Processed email with ID: ${emailId}`);
            }
        }
        console.log('Successfully checked for unread emails and processed them.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

setInterval(main, getRandomInterval());

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
