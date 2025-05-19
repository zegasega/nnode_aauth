const { Op } = require('sequelize');
const BaseService = require('../core/base_service');
const { User } = require('../db/index');
const redisClient = require('../redis/index');  

class UserService extends BaseService {
    constructor(){
        super(User);
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
        const BLOCK_TIME_SECONDS = 10 * 60; // 10 dakika blok

        const isBlocked = await redisClient.get(blockKey);
        if (isBlocked) {
            throw new Error('Account is temporarily blocked due to multiple failed login attempts. Please try again later.');
        }

        const user = await this.findOne({ email });

        if (!user) {
            throw new Error('User Not Found');
        }

        const isPasswordValid = await this.Utils.comparePassword(password, user.password);

        if (!isPasswordValid) {
            const attempts = await redisClient.incr(attemptKey);
            if (attempts === 1) {
                await redisClient.expire(attemptKey, BLOCK_TIME_SECONDS);
            }

            if (attempts >= MAX_ATTEMPTS) {
                await redisClient.set(blockKey, 'blocked', {
                    EX: BLOCK_TIME_SECONDS
                });
                await redisClient.del(attemptKey);
                throw new Error('Account blocked for 30 minutes due to multiple failed login attempts.');
            }

            throw new Error('Invalid Password');
        }

        await redisClient.del(attemptKey);
        await redisClient.del(blockKey);

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
        }
    }

    async logoutUser(userID ) {
        const user = await this.findById(userID);

        if (!user) {
            throw new Error("User not found");
        }
        user.jwtTokenVersion += 1;
        await user.save();

    }
}

module.exports = new UserService();
