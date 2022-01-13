import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/auth/enums";
import { Company } from "src/companies/models/company.model";
import { User } from "src/users/models/user.model";

type Subjects = InferSubjects<typeof Company | typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    // User rules
    can(Action.Read, User, { id: user.id });
    can(Action.Update, User, { id: user.id });
    can(Action.Delete, User, { id: user.id });

    // Company rules
    can(Action.Read, Company, { user: user.id });
    can(Action.Update, Company, { user: user.id });
    can(Action.Delete, Company, { user: user.id });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
    });
  }
}