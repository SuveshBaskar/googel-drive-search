const readline = require('readline');
const { google } = require('googleapis');

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

authorize(JSON.parse(content), listFiles);

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const token = JSON.stringify({
    access_token:
      'ya29.Il-1Bz4aYMg1oQvCcyXVExzo6IKzmh2AiqNuAzyKLAB24kN6j1RXSm_7DB9UhpmyogE8HayCxaqeRVNFxV4xDbnaU-BUNyvWVQNlxsA_zChjOb__oSaWot3GTgDPaB9_Lw',
    refresh_token:
      '1//0g5stHl5Qzfh1CgYIARAAGBASNwF-L9IryxTZ3lU6Nb0pO9QjpkWCo7yI3mKfVMgKcslxB3dW9m64CVfjmiKyzXl72IQ51XyC9XQ',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
    token_type: 'Bearer',
    expiry_date: 1576610671500
  });
  oAuth2Client.setCredentials(JSON.parse(token));
  callback(oAuth2Client);
}

function listFiles(auth) {
  const drive = google.drive({ version: 'v3', auth });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the text to search in the google drive: ', text => {
    rl.close();

    drive.files.list(
      {
        pageSize: 1,
        //   q:"mimeType='application/vnd.google-apps.document',fullText contains 'Solution Document'",
        q:
          "mimeType='application/vnd.google-apps.document' and fullText contains '" +
          text +
          "' and 'suvesh@yellowmessenger.com' in readers",
        fields: 'nextPageToken, files'
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          console.log('Files:');
          files.map(file => {
            console.log(`${file.name} :  ${file.webViewLink}`);
            // console.log(file);
          });
        } else {
          console.log('No files found.');
        }
      }
    );
  });
}
