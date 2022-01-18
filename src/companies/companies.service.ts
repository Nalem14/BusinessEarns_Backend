import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/models/user.model';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './models/company.model';
import { CompanyEarn } from './models/companyEarn.model';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company)
    private companyModel: typeof Company,
    @InjectModel(CompanyEarn)
    private companyEarnModel: typeof CompanyEarn
  ) { }

  async create(createCompanyDto: CreateCompanyDto, user: User) {
    const company = await this.companyModel.create(createCompanyDto);
    await company.$set<User>("user", user);

    return company;
  }

  findAll(userId: number | null = null) {
    if (userId !== null)
      return this.companyModel.findAll({
        where: {
          userId: userId
        }
      })

    return this.companyModel.findAll();
  }

  findOne(id: number) {
    return this.companyModel.findByPk(id, {
      include: [User]
    });
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


  /**
   * Earns
   */

  async createEarn(company: Company, amount: string) {
    const earn = await this.companyEarnModel.create({
      amount: amount
    });
    await earn.$set<Company>("company", company);

    return earn;
  }

  findAllEarn(company: Company) {
    return company.$get("earns");
  }

  async findOneEarn(company: Company, id: number) {
    const earns = await company.$get("earns", {
      where: {
        id: id
      }
    })

    return earns[0];
  }

  async updateEarn(company: Company, id: number, amount: string) {
    const earn = await this.findOneEarn(company, id);

    earn.amount = amount;
    await earn.save();

    return earn;
  }

  async removeEarn(company: Company, id: number) {
    const earn = await this.findOneEarn(company, id);
    return earn.destroy();
  }

}
