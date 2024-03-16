import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import config from '../Utils/config';

const transport = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  auth: {
    user: config.SMTP_USERNAME,
    pass: config.SMTP_PASSWORD,
  },
});

export const templateList = {
  welcome: {
    name: 'welcome',
    subject: 'Welcome to Our App',
    path: 'welcome.ejs',
  },
  otp: {
    name: 'otp',
    subject: 'OTP Verification',
    path: 'otp.ejs',
  },
  forgotPasswordOtp: {
    name: 'forgotPasswordOtp',
    subject: 'Forgot Password',
    path: 'forgotPasswordOtp.ejs',
  },
};

const renderTemplate = (templatePath, data) => {
  try {
    return ejs.renderFile(templatePath, data);
  } catch (error) {
    console.log('error => ', error);
    return error;
  }
};

export const sendEmail = async (to, templateName, data) => {
  try {
    const templateInfo = templateList[templateName];

    if (!templateInfo) {
      console.error(`Template "${templateName}" not found.`);
      return false;
    }

    const templatePath = path.join(
      __dirname,
      '..',
      'Views',
      'EmailTemplates',
      templateInfo.path,
    );
    const html = await renderTemplate(templatePath, data);
    const mailOptions = {
      from: config.SMTP_FROM,
      to,
      subject: templateInfo.subject,
      html,
    };

    await transport.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};
