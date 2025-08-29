import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // console.log(request) ;
    const user = request.user; // Extract user from the request object

    if (!user || user.role !== 'Admin') {
      throw new ForbiddenException('Access denied for non-admin users');
    }

    return true; // Only allow if the role is "admin"
  }
}
