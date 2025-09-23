import { GoogleConnection } from '../models/googleConnections.model.js';
import { Form } from '../models/Form.model.js';
import { createOAuth2Client, getSheetsClient } from '../config/googleClient.js';

function buildProfileRows(formDoc) {
  return [
    ['name', 'email', 'hobby', 'age', 'phoneNumber', 'createdAt'],
    [
      formDoc?.name || '',
      formDoc?.email || '',
      formDoc?.hobby || '',
      formDoc?.age ?? '',
      formDoc?.phoneNumber ?? '',
      formDoc?.createdAt ? new Date(formDoc.createdAt).toISOString() : ''
    ]
  ];
}


export const createFormSheet = async (req, res, next) => {
  try {
    const { connectionId, sheetName } = req.body;
    if (!connectionId || !sheetName) {
      return res.status(400).json({ success: false, message: 'connectionId and sheetName required' });
    }

    const connection = await GoogleConnection.findById(connectionId);
    if (!connection) return res.status(404).json({ success: false, message: 'Connection not found' });

    if (!connection.accessToken || !connection.refreshToken) {
      return res.status(400).json({ success: false, message: 'Google tokens are missing' });
    }

    if (connection.sheetId) {
      return res.status(409).json({ success: false, message: 'A sheet is already connected for this account' });
    }

    const oauth2 = createOAuth2Client({
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
    });
    const sheets = getSheetsClient(oauth2);

    const createResp = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: sheetName },
        sheets: [{ properties: { title: 'Profile' } }],
      },
      fields: 'spreadsheetId',
    });

    const spreadsheetId = createResp.data.spreadsheetId;

    // Load the source form by formId to write initial rows
    const formDoc = await Form.findById(connection.formId);
    const values = buildProfileRows(formDoc);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Profile!A1:F2',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    connection.sheetId = spreadsheetId;
    connection.sheetName = sheetName;
    await connection.save();

    res.status(201).json({ success: true, data: { sheetId: spreadsheetId, name: sheetName } });
  } catch (err) {
    next(err);
  }
};


export const connectExistingFormSheet = async (req, res, next) => {
  try {
    const { connectionId, sheetId, sheetName } = req.body;
    if (!connectionId || !sheetId) {
      return res.status(400).json({ success: false, message: 'connectionId and sheetId required' });
    }

    const connection = await GoogleConnection.findById(connectionId);
    if (!connection) return res.status(404).json({ success: false, message: 'Connection not found' });

    if (!connection.accessToken || !connection.refreshToken) {
      return res.status(400).json({ success: false, message: 'Google tokens are missing' });
    }

    const oauth2 = createOAuth2Client({
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
    });
    const sheets = getSheetsClient(oauth2);

    const formDoc = await Form.findById(connection.formId);
    const values = buildProfileRows(formDoc);
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'Profile!A1:F2',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    connection.sheetId = sheetId;
    connection.sheetName = sheetName || 'Connected Sheet';
    await connection.save();

    res.status(200).json({ success: true, data: { sheetId, name: connection.sheetName } });
  } catch (err) {
    next(err);
  }
};


export const checkFormSheet = async (req, res, next) => {
  try {
    const { connectionId } = req.query;
    if (!connectionId) return res.status(400).json({ success: false, message: 'connectionId required' });

    const connection = await GoogleConnection.findById(connectionId);
    if (!connection) return res.status(404).json({ success: false, message: 'Connection not found' });

    const hasSheet = !!connection.sheetId;

    res.status(200).json({
      success: true,
      hasSheet,
      sheet: hasSheet ? { sheetId: connection.sheetId, name: connection.sheetName } : null,
    });
  } catch (err) {
    next(err);
  }
};
