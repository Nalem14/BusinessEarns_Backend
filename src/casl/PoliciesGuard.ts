import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/users/models/user.model";
import { AppAbility, CaslAbilityFactory } from "./casl-ability.factory";
import { CHECK_POLICIES_KEY } from "./check-policy.decorator";
import { PolicyHandler } from "./policyHandler.interface";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const userDb = await User.findByPk(user.userId);
    const ability = this.caslAbilityFactory.createForUser(userDb);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function')
      return handler(ability);

    return handler.handle(ability);
  }
}