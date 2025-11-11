const { BlobServiceClient } = require('@azure/storage-blob');
const { EmailClient } = require('@azure/communication-email');

// Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const getContainerClient = (containerName) => {
  return blobServiceClient.getContainerClient(containerName);
};

// Azure Communication Services
const emailClient = new EmailClient(
  process.env.AZURE_COMMUNICATION_CONNECTION_STRING
);

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const emailMessage = {
      senderAddress: process.env.AZURE_COMMUNICATION_EMAIL_FROM,
      content: {
        subject: subject,
        html: htmlContent,
      },
      recipients: {
        to: [{ address: to }],
      },
    };

    const poller = await emailClient.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  getContainerClient,
  sendEmail,
};

