const { Op } = require('sequelize');
const BaseService = require('../core/base_service');
const { User, Verification } = require('../db/index');
const RedisClient = require('../redis/index'); // Class yapısında import

class UserService extends BaseService {
    constructor() {
        super(User);
        this.redis = RedisClient.getClient(); // Redis client örneğini al

    }

    async changePassword(user_id, code, newPassword) {
        const verification_record = await Verification.findOne({
            where: {
                userId: user_id,
                code,
                verification_type: "reset_password", // opsiyonel, eğer kayıtlıysa
                expiresAt: { [Op.gt]: new Date() }, // süresi geçmiş mi
            },
        });

        if (!verification_record) {
            throw new Error("Invalid or expired verification code");
        }

        // 2. Kullanıcıyı bul
        const user = await this.findById(user_id);
        if (!user) {
            throw new Error("User not found");
        }

        // 3. Yeni şifreyi hashle ve kaydet
        const hashedPassword = await this.Utils.hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        // 4. Verification kaydını sil
        await verification_record.destroy();

        return { message: "Password changed successfully" };
    }

    async registerUser(userData) {
        const { username, email, password, role, jwtTokenVersion } = userData;

        const existingUser = await this.findOne({
            [Op.or]: [{ email }, { username }]
        });
        if (existingUser) {
            throw new Error("User with this email or username already exists!");
        }

        const hashedPassword = await this.Utils.hashPassword(password);

        const newUser = await this.create({
            username,
            email,
            password: hashedPassword,
            role,
            jwtTokenVersion
        });

        return newUser;
    }

    async loginUser({ email, password }) {
        const blockKey = `login_block:${email}`;
        const attemptKey = `login_attempts:${email}`;
        const MAX_ATTEMPTS = 3;
        const BLOCK_TIME_SECONDS = 10 * 60;

        const isBlocked = await this.redis.get(blockKey);
        if (isBlocked) {
            throw new Error('Account is temporarily blocked due to multiple failed login attempts. Please try again later.');
        }

        const user = await this.findOne({ email });

        if (!user) {
            throw new Error('User Not Found');
        }

        const isPasswordValid = await this.Utils.comparePassword(password, user.password);

        if (!isPasswordValid) {
            const attempts = await this.redis.incr(attemptKey);
            if (attempts === 1) {
                await this.redis.expire(attemptKey, BLOCK_TIME_SECONDS);
            }

            if (attempts >= MAX_ATTEMPTS) {
                await this.redis.set(blockKey, 'blocked', {
                    EX: BLOCK_TIME_SECONDS
                });
                await this.redis.del(attemptKey);
                throw new Error('Account blocked for 10 minutes due to multiple failed login attempts.');
            }

            throw new Error('Invalid Password');
        }

        await this.redis.del(attemptKey);
        await this.redis.del(blockKey);

        const accessToken = this.Utils.generateAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            jwtTokenVersion: user.jwtTokenVersion
        });
        const refreshToken = this.Utils.generateRefreshToken({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            jwtTokenVersion: user.jwtTokenVersion
        });

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async logoutUser(userID) {
        const user = await this.findById(userID);

        if (!user) {
            throw new Error("User not found");
        }

        user.jwtTokenVersion += 1;
        await user.save();
    }

    async getAllUser() {
        const users = await this.findAll();
        return users;
    }
}

module.exports = UserService;
