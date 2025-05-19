const nodemailer = require("nodemailer");
const BaseService = require("../core/base_service");
const { User, Verification } = require('../db/index');

class EmailService extends BaseService {
    constructor() {
        super(User);

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

   async sendVerificationCode(email, type) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await Verification.destroy({ where: { userId: user.id } });

        await Verification.create({
            userId: user.id,
            code,
            verification_type: type,
            expiresAt,
        });

        const info = await this.transporter.sendMail({
            from: `"My App" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${code}`,
        });

        console.log("Verification email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending verification code:", error);
        throw error;
    }
}

}

module.exports = EmailService;
