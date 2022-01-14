import { Sequelize } from "sequelize-typescript";
import { Action } from "../auth/enums";
import { Company } from "../companies/models/company.model";
import { CompanyEarn } from "../companies/models/companyEarn.model";
import { User } from "../users/models/user.model";
import { CaslAbilityFactory } from "./casl-ability.factory";


describe('CaslAbilityFactory', () => {
  it('should be defined', () => {
    expect(new CaslAbilityFactory()).toBeDefined();
  });
});

describe("Permissions", () => {
  new Sequelize({
    validateOnly: true,
    models: [User, Company, CompanyEarn] // don't forget to add your models like this... or [User, ...]
  });

  let user: User;
  let user2: User;
  let ability;
  const caslAbilityFactoryInstance = new CaslAbilityFactory();

  describe("when user is an admin", () => {
    beforeEach(() => {
      user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.email = "email@domain.tld";
      user.isAdmin = true;

      ability = caslAbilityFactoryInstance.createForUser(user);
    });

    it("can do anything", () => {
      expect(ability.can(Action.Manage, "all")).toBe(true);
    });
  });

  describe("when user is a not admin", () => {
    beforeEach(() => {
      user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.email = "email@domain.tld";
      user.isAdmin = false;

      user2 = new User();
      user2.firstName = "Maria";
      user2.lastName = "Doe";
      user2.email = "email@domain.tld";
      user2.isAdmin = false;

      ability = caslAbilityFactoryInstance.createForUser(user);
    });

    it("should return user model name", () => {
      expect(user.modelName).toBe("User");
    })

    it("can read self data", () => {
      expect(ability.can(Action.Read, user)).toBe(true);
    });

    it("cannot read other user data", () => {
      expect(ability.can(Action.Read, user2)).toBe(false);
    });
  });
});