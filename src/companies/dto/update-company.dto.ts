import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
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
}
