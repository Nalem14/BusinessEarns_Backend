import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({
        description: "The user email",
        example: "email@domain.tld",
        required: true
    })
    email: string;

    @ApiProperty({ description: "The user password", required: true, example: "Egehdt4drZghD45" })
    password: string;
}
