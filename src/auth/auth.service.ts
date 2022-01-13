import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { password, password_hash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        console.log(user)
        const payload = { username: user.dataValues.email, sub: user.dataValues.id };
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
