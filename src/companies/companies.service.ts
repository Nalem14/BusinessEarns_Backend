import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './models/company.model';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company)
    private companyModel: typeof Company,
  ) { }

  create(createCompanyDto: CreateCompanyDto) {
    return this.companyModel.create(createCompanyDto);
  }

  findAll(userId: number|null = null) {
    if(userId !== null)
      return this.companyModel.findAll({
        where: {
          userId: userId
        }
      })
      
    return this.companyModel.findAll();
  }

  findOne(id: number) {
    return this.companyModel.findByPk(id);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyModel.findByPk(id);

    company.name = updateCompanyDto.name;
    company.dailyObjective = updateCompanyDto.dailyObjective;
    await company.save();
    
    return company;
  }

  async remove(id: number) {
    const company = await this.companyModel.findByPk(id);
    return company.destroy();
  }
}
