const fs = require('fs');
const async = require('async');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const content = JSON.stringify({
  installed: {
    client_id:
      '94468432473-0kv20uqgcrrfk3fgc3j9kqrs3lsnhfhc.apps.googleusercontent.com',
    project_id: 'quickstart-1564113601471',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: 'PdpZ9PodrX3kZeGAtTHxCKhr',
    redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
  }
});

authorize(JSON.parse(content));

function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  return getAccessToken(oAuth2Client);
}

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      console.log('Token :\n', JSON.stringify(token));
    });
  });
}
