import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {}
