import { ApiProperty } from "@nestjs/swagger";
import { ProfileUserDto } from "src/users/dto/profile-user-dto";

export class ReadCompanyDto {
    @ApiProperty({
        description: "The company name",
        example: "Leclerc",
    })
    name: string;

    @ApiProperty({
        description: "The company daily objective in euro",
        example: 500,
    })
    dailyObjective: number;

    @ApiProperty({
        description: "The company owner",
    })
    user: ProfileUserDto;

    @ApiProperty({
        description: "The company creation date/time",
        example: "2022/01/01 21:00:00",
    })
    createdAt: Date;

    @ApiProperty({
        description: "The company last update date/time",
        example: "2022/01/01 21:00:00",
    })
    updatedAt: Date;
}
