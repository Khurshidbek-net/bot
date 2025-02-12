import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminSelfGuard implements CanActivate{
  // constructor(private readonly jwtService: JwtService){}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if(request.admin.id != request.params.id){
      throw new ForbiddenException({ message: "You are not authorized" })
    }

    return true; 
  }
}
