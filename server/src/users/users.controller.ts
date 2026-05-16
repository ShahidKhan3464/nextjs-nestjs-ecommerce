import { UsersService } from './users.service';
import { UserRole } from './constants/user.constants';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { parseUserBlockedFilter, QueryUserDto } from './dto/query-user.dto';
import {
  Get,
  Body,
  Patch,
  Param,
  Query,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: QueryUserDto) {
    const { isBlocked: isBlockedRaw, ...rest } = query;
    return this.usersService.findAllPaginated({
      ...rest,
      isBlocked: parseUserBlockedFilter(isBlockedRaw),
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/block')
  @Roles(UserRole.ADMIN)
  blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Body('isBlocked') isBlocked: boolean,
  ) {
    return this.usersService.blockUser(id, isBlocked);
  }
}
