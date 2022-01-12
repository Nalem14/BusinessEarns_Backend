import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from './models/company.model';
import { CompanyEarn } from './models/companyEarn.model';

@Module({
  imports: [SequelizeModule.forFeature([Company]), SequelizeModule.forFeature([CompanyEarn])],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}
