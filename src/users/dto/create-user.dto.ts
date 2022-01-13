import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
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
        example: "RZgkn45b$5ff",
        required: true
    })
    password: string;
}
