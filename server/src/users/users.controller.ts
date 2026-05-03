import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
  // Registration is handled by Auth (`POST /auth/register`) which delegates to
  // UsersService.createUser — avoids exposing a separate public “create user” URL.
  // @Auth(AuthType.None)
  // @Post()
  // @UseInterceptors(ClassSerializerInterceptor)
  // async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //   return this.usersService.createUser(createUserDto);
  // }
  // @Get()
  // async findAll(@Req() req: Request) {
  //   return this.usersService.findAll();
  // }
}
