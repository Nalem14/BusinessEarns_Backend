import { AllowNull, BelongsTo, Column, CreatedAt, HasMany, Length, Model, NotEmpty, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { CompanyEarn } from './companyEarn.model';

@Table
export class Company extends Model {
  @AllowNull(false)
  @NotEmpty
  @Length({msg: "Company name must be 3 characters min and 32 characters max", min: 3, max: 32})
  @Column
  name: string;

  @AllowNull
  @Column
  dailyObjective: number;

  @AllowNull(false)
  @BelongsTo(() => User, "userId")
  user: User;

  @HasMany(() => CompanyEarn, 'companyId')
  earns: CompanyEarn[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}