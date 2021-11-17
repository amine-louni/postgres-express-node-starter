import nodemailer from 'nodemailer';
import pug from 'pug';
import mg from 'nodemailer-mailgun-transport';
import htmlToText from 'html-to-text';
import { IUser } from "src/@types/user";
import { __prod__ } from "../constatns";


export default class EmailSender {
    to: string;
    firstName: string;
    url: string;
    from: string;
    constructor(user: IUser, url: string) {
        this.to = user.email;
        this.firstName = user.first_name;
        this.url = url;
        this.from = `"Amine Louni" <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (__prod__) {
            return nodemailer.createTransport(mg({
                auth: {
                    api_key: process.env.MAILGUN_PRIVATE_API_KEY,
                    domain: process.env.MAILGUN_DOMAIN
                }
            }));


        }

        // Mailtrap
        return nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,

            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD
            }

        });
    }

    // Send the actual email
    async send(template: string, subject: string) {
        console.log(`${__dirname}/../../views/email/${template}.pug`, 'dir name---')
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the LiYelp Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};
