import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "../auth/enums";
import { User } from "../users/models/user.model";


type Subjects = 'Company' | 'User' | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.isAdmin) {
      can(Action.Manage, 'all'); // read-write access to everything
    }else{
      // Everything rules
      can(Action.Create, 'all');
  
      // User rules
      can(Action.Read, 'User', { id: user.id }).because("User can only read its own data");
      can(Action.Update, 'User', { id: user.id });
      can(Action.Delete, 'User', { id: user.id });
  
      // Company rules
      can(Action.Read, 'Company', { user: user.id });
      can(Action.Update, 'Company', { user: user.id });
      can(Action.Delete, 'Company', { user: user.id });
    }

    return build();
  }
}