import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../db/entities/users.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {signIn, signUp} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import validationMessage from "../middleware/validationMessage";
import {JwtInterface} from "./interface/jwt.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    async createUser(payload: signUp): Promise<{ message: string, token: string }> {
        const user = await this.userRepo.findOne({
            where: {
                email: payload.email,
            },
        });
        if (!user) {
            const data: JwtInterface = {
                email: payload.email,
            };
            if (payload.password === payload.confirmPassword) {
                payload.password = bcrypt.hashSync(payload.password, 10);
                const token = this.jwtService.sign(data);
                await this.userRepo.save(payload);

                return {
                    message: validationMessage.registrationCompleted,
                    token: token,
                };
            } else {
                throw new HttpException(validationMessage.passwordsNotMatch, 400);
            }
        }
        throw new HttpException(validationMessage.emailExists, 400);
    }


    async loginUser(payload: signIn): Promise<{ message: string, data: object }> {
        const user = await this.userRepo.findOne({
            where: {
                email: payload.email,
            }
        })
        if (!user) {
            throw new HttpException(validationMessage.invalid, 400);
        }
        if (user) {
            if (user && bcrypt.compareSync(payload.password, user.password)) {
                const token = this.jwtService.sign({
                    id: user.id,
                    email: user.email,
                });
                return {
                    message: 'Success',
                    data: {
                        token: token,
                    }
                }
            } else {
                throw new HttpException(validationMessage.invalid, 400);
            }
        } else {
            throw new HttpException(validationMessage.notDefined, 404);
        }
    }

    async getCurrentUser(currentUser: UserEntity) {
        const user = await this.userRepo.findOne({
            where: {
                email: currentUser.email,
            },
        });

        if (user) {
            return {
                message: 'Success',
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    phone: user.phone
                }
            }
        }
    }
}
