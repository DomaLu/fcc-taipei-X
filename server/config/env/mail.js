export default {
  gmail: {
    gmailSender: process.env.GMAIL_USERNAME,
    gmailConfig: {
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
      logger: true,
      debug: true,
    },
  },
  sendgrid: {
    sendgridSender: process.env.SENDGRID_USERNAME,
    apiKey: process.env.SENDGRID_API_KEY,
  },
  mailTemplate: {
    subject: 'Please comfirm your email address',
  },
}
