const nodemailer = require("nodemailer");
const BaseService = require("../core/base_service");

class EmailService extends BaseService {
    constructor() {
        super();

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendWelcomeEmail(to) {
        try {
            const info = await this.transporter.sendMail({
                from: `"My App" <${process.env.SMTP_USER}>`,
                to,
                subject: "Welcome",
                html: "<h1>Welcome to My App</h1>",
            });

            console.log("Welcome email sent: %s", info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending welcome email:", error);
            throw error;
        }
    }
}

module.exports = EmailService;
