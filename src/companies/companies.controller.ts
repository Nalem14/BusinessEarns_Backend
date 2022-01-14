import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Action } from 'src/auth/enums';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/check-policy.decorator';
import { PoliciesGuard } from 'src/casl/PoliciesGuard';
import { User } from '../users/models/user.model';
import { getUser } from '../users/user.decorator';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ReadCompanyDto } from './dto/read-company-dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

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
  findAll(@getUser() auth: User) {
    return this.companiesService.findAll(!auth.isAdmin ? auth.id : null);
  }

  @ApiOperation({summary: "Get a company", description: "Get specific company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  async findOne(@Param('id') id: string, @getUser() auth: User) {
    const company = await this.companiesService.findOne(+id);

    if(company.user.id != auth.id && !auth.isAdmin)
      throw new ForbiddenException("You don't have access to this company.");

    return company;
  }

  @ApiOperation({summary: "Update a company", description: "Update a specific company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Company'))
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @getUser() auth: User) {
    const company = await this.findOne(id, auth);

    if(company.user.id != auth.id && !auth.isAdmin)
      throw new ForbiddenException("You don't have access to this company.");

    return this.companiesService.update(+id, updateCompanyDto);
  }

  @ApiOperation({summary: "Delete a company", description: "Delete a specific company associated with the logged-in user"})
  @ApiOkResponse({ description: "Success, return nothing" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Company'))
  async remove(@Param('id') id: string, @getUser() auth: User) {
    const company = await this.findOne(id, auth);

    if(company.user.id != auth.id && !auth.isAdmin)
      throw new ForbiddenException("You don't have access to this company.");

    return this.companiesService.remove(+id);
  }
}
