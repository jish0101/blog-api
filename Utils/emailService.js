import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';
import { join } from 'path';
import config from './config.js';

const transport = createTransport({
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
    subject: 'Email Verification',
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
    return renderFile(templatePath, data);
  } catch (error) {
    return error;
  }
};

export const sendEmail = async (to, templateInfo, data) => {
  try {
    if (!templateInfo) {
      console.error(`Template "${templateInfo.path}" not found.`);
      return false;
    }

    const templatePath = join(
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
    console.info(
      `Mail sent from: ${config.SMTP_FROM} to: ${to} with template path: ${templateInfo.path}`,
    );
    return true;
  } catch (error) {
    console.log('🚀 ~ sendEmail ~ error:', error);
    return false;
  }
};
