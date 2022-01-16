import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: "The user first name",
        example: "John",
        required: true
    })
    firstName: string;

    @ApiProperty({
        description: "The user last name",
        example: "Doe",
        required: true
    })
    lastName: string;

    @ApiProperty({
        description: "The user email",
        example: "email@domain.tld",
        required: true
    })
    email: string;

    @ApiProperty({
        description: "The user password",
        example: "RgsdhERTQgesrhqe",
        required: false
    })
    password?: string;
}
