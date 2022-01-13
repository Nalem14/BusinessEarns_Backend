import sequelize from 'sequelize';
import { AllowNull, Column, CreatedAt, DefaultScope, HasMany, IsDate, IsEmail, Length, Model, NotEmpty, Scopes, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { Company } from '../../companies/models/company.model';
import * as bcrypt from 'bcrypt';

@DefaultScope(() => ({
  attributes: {
    exclude: ['password', 'password_hash', 'email']
  }
}))
@Scopes(() => ({
  private: {
    attributes: {
      exclude: ['password', 'password_hash']
    }
  },
  secret: {
    attributes: {
      exclude: []
    }
  },
}))
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

  @AllowNull(false)
  @NotEmpty
  @Length({msg: "The password must be 8 characters min and 32 characters max", min: 8, max: 32})
  @Column(sequelize.VIRTUAL)
  get password(): string {
    return this.getDataValue('password_hash');
  }
  set password(value: string) {
    this.setDataValue("password", value);
    
    const hash = bcrypt.hashSync(value, 10);
    this.setDataValue("password_hash", hash);
  }

  @AllowNull(false)
  @NotEmpty
  @Column
  password_hash: string;

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