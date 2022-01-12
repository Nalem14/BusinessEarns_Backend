import sequelize from 'sequelize';
import { AllowNull, Column, CreatedAt, HasMany, IsDate, IsEmail, Length, Model, NotEmpty, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { Company } from '../../companies/models/company.model';

@Table
export class User extends Model {
  @AllowNull(false)
  @NotEmpty
  @Length({msg: "Firstname must be 3 characters min and 25 characters max", min: 3, max: 25})
  @Column
  firstName: string;

  @AllowNull(false)
  @NotEmpty
  @Length({msg: "Lastname must be 3 characters min and 25 characters max", min: 3, max: 25})
  @Column
  lastName: string;

  @AllowNull(false)
  @NotEmpty
  @IsEmail
  @Unique
  @Column
  email: string;

  @IsDate
  @AllowNull(false)
  @Column({ defaultValue: sequelize.NOW })
  lastOnlineAt: Date;

  @AllowNull(false)
  @Column({ defaultValue: false })
  isAdmin: boolean;

  @HasMany(() => Company, 'userId')
  companies: Company[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}