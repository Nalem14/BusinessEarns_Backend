import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class PublicUserDto extends PartialType(CreateUserDto) {
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
        description: "The user creation date/time",
        example: "2022/01/01 21:00:00",
        required: true
    })
    createdAt: Date;

    @ApiProperty({
        description: "The user last update date/time",
        example: "2022/01/01 21:00:00",
        required: true
    })
    updatedAt: Date;

    @ApiProperty({
        description: "The user last online date/time",
        example: "2022/01/01 21:00:00",
        required: true
    })
    lastOnlineAt: Date;
}
