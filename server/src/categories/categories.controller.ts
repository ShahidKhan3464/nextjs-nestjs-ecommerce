import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UserRole } from 'src/users/constants/user.constants';
import {
  Get,
  Body,
  Post,
  Param,
  Query,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

@ApiTags('categories')
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAllPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }
}
