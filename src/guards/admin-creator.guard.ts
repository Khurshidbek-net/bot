import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminCreatorGuard implements CanActivate{
  // constructor(private readonly jwtService: JwtService){}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log(request.admin.is_creator)
    if (!request.admin.is_creator){
      throw new ForbiddenException({ message: "You are not authorized" })
    }

    return true; 
  }
}
