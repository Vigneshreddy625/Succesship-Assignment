import { google } from 'googleapis'

export function createOAuth2Client({ accessToken, refreshToken }) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  )

  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  return client
}

export function getSheetsClient(oauth2Client) {
  return google.sheets({ version: 'v4', auth: oauth2Client })
}

export function getDriveClient(oauth2Client) {
  return google.drive({ version: 'v3', auth: oauth2Client })
}