import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly companiesService: CompaniesService) { }

  @ApiOperation({ summary: "Create a company", description: "Create a new company associated with the logged-in user" })
  @ApiCreatedResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @getUser() auth: User) {
    return this.companiesService.create(createCompanyDto, auth);
  }

  @ApiOperation({ summary: "List all companies", description: "List all companies associated with the logged-in user" })
  @ApiOkResponse({ description: "Success, return companies data", type: [ReadCompanyDto] })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  findAll(@getUser() auth: User) {
    return this.companiesService.findAll(!auth.isAdmin ? auth.id : null);
  }

  @ApiOperation({ summary: "Get a company", description: "Get specific company associated with the logged-in user" })
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  async findOne(@Param('id') id: string, @getUser() auth: User) {
    const company = await this.companiesService.findOne(+id);
    if (!company)
      throw new NotFoundException("Company not found");

    if (company.user.id != auth.id && !auth.isAdmin)
      throw new ForbiddenException("You don't have access to this company");

    return company;
  }

  @ApiOperation({ summary: "Update a company", description: "Update a specific company associated with the logged-in user" })
  @ApiOkResponse({ description: "Success, return company data", type: ReadCompanyDto })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Company'))
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @getUser() auth: User) {
    const company = await this.findOne(id, auth);
    return this.companiesService.update(company.id, updateCompanyDto);
  }

  @ApiOperation({ summary: "Delete a company", description: "Delete a specific company associated with the logged-in user" })
  @ApiOkResponse({ description: "Success, return nothing" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Company'))
  async remove(@Param('id') id: string, @getUser() auth: User) {
    const company = await this.findOne(id, auth);
    return this.companiesService.remove(company.id);
  }


  /**
   * Earns
   */

  @ApiOperation({ summary: "Create a company earn", description: "Create a new company earn associated with the specified company" })
  @ApiCreatedResponse({ description: "Success, return earn data", type: Object })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiBody({ type: "application/json", schema: { properties: { amount: { example: 150, title: "The amount to add in euro" } } } })
  @Post(":companyId/earns")
  async createEarn(@Param("companyId") companyId: string, @Body("amount") amount: string, @getUser() auth: User) {
    const company = await this.findOne(companyId, auth);
    return this.companiesService.createEarn(company, +amount);
  }

  @ApiOperation({ summary: "List all company earns", description: "List all company earns associated with the specified company" })
  @ApiOkResponse({ description: "Success, return company earns data", type: [Object] })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get(":companyId/earns")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  async findAllEarn(@Param("companyId") companyId: string, @getUser() auth: User) {
    const company = await this.findOne(companyId, auth);
    return this.companiesService.findAllEarn(company);
  }

  @ApiOperation({ summary: "Get a company earn", description: "Get a specific company earn" })
  @ApiOkResponse({ description: "Success, return earn data", type: Object })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get(':companyId/earns/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, 'Company'))
  async findOneEarn(@Param('companyId') companyId: string, @Param('id') id: string, @getUser() auth: User) {
    const company = await this.findOne(companyId, auth);
    const earn = await this.companiesService.findOneEarn(company, +id);

    if(!earn)
      throw new NotFoundException("Earn not found");

    return earn;
  }

  @ApiOperation({ summary: "Update a company earn", description: "Update a specific company earn" })
  @ApiOkResponse({ description: "Success, return company earn data", type: Object })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiBody({ type: "application/json", schema: { properties: { amount: { example: 150, title: "The amount to add in euro" } } } })
  @Patch(':companyId/earns/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, 'Company'))
  async updateEarn(@Param('companyId') companyId: string, @Param('id') id: string, @Body() body: any, @getUser() auth: User) {
    const company = await this.findOne(companyId, auth);
    return this.companiesService.updateEarn(company, +id, body.amount);
  }

  @ApiOperation({ summary: "Delete a company earn", description: "Delete a specific company earn" })
  @ApiOkResponse({ description: "Success, return nothing" })
  @ApiForbiddenResponse({ description: "Access denied" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Delete(':companyId/earns/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, 'Company'))
  async removeEarn(@Param('companyId') companyId: string, @Param('id') id: string, @getUser() auth: User) {
    const company = await this.findOne(companyId, auth);
    return this.companiesService.removeEarn(company, +id);
  }
}
