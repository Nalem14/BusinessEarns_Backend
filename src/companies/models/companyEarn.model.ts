import { AllowNull, BelongsTo, Column, CreatedAt, Model, NotEmpty, Table, UpdatedAt } from 'sequelize-typescript';
import { Company } from './company.model';

@Table
export class CompanyEarn extends Model {
    @AllowNull(false)
    @NotEmpty
    @Column
    amount: number;
  
    @BelongsTo(() => Company, 'companyId')
    company: Company[];
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
}