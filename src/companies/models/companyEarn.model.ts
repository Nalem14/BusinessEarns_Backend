import { AllowNull, BelongsTo, Column, CreatedAt, Model, NotEmpty, Table, UpdatedAt } from 'sequelize-typescript';
import { Crypto } from '../../helper/crypto.class';
import { Company } from './company.model';

@Table
export class CompanyEarn extends Model {
    @AllowNull(false)
    @NotEmpty
    @Column
    // amount: string;
    set amount(value: string) {
        let hash = JSON.stringify(Crypto.encrypt(value.toString()));
        this.setDataValue("amount", hash);
    }
    get amount() : string {
        let hash = this.getDataValue("amount");
        hash = JSON.parse(hash);

        let value = Crypto.decrypt(hash);
        return value;
    }
  
    @BelongsTo(() => Company, 'companyId')
    company: Company;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
}