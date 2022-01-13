import { ApiProperty } from "@nestjs/swagger";

export class CreateCompanyDto {
    @ApiProperty({
        description: "The company name",
        example: "Leclerc",
        required: true
    })
    name: string;
}
