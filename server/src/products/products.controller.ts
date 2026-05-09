import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/constants/user.constants';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/constants/auth.constants';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  getProducts() {
    return 'Only admin can create product';
    // return this.productsService.getProducts();
  }

  // @Get(':id')
  // getProductById(@Param('id') id: string) {
  //   return this.productsService.getProductById(id);
  // }

  // @Post()
  // @Roles(UserRole.ADMIN)
  // createProduct(@Body() createProductDto: CreateProductDto) {
  //   return 'Only admin can create product';
  //   // return this.productsService.createProduct(createProductDto);
  // }
}
