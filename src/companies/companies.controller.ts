import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Action } from 'src/auth/enums';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { PoliciesGuard } from 'src/casl/PoliciesGuard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ReadCompanyDto } from './dto/read-company-dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './models/company.model';

@ApiTags("Companies")
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOperation({summary: "Create a company", description: "Create a new company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @ApiOperation({summary: "List all companies", description: "List all companies associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return companies data", type: [ReadCompanyDto] })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  findAll() {
    return this.companiesService.findAll();
  }

  @ApiOperation({summary: "Get a company", description: "Get specific company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @ApiOperation({summary: "Update a company", description: "Update a specific company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Company'))
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @ApiOperation({summary: "Delete a company", description: "Delete a specific company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return nothing" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Company'))
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
