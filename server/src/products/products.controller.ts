import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserRole } from 'src/users/constants/user.constants';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ParseProductImagesPipe } from './pipes/parse-product-images.pipe';
import { getUploadsRoot, UploadSubdir } from 'src/common/storage/uploads-root';
import { createImageDiskMulterOptions } from 'src/common/storage/image-upload.multer';
import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  Controller,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

const imagesMulter = createImageDiskMulterOptions(
  getUploadsRoot(),
  UploadSubdir.PRODUCTS,
);

@ApiTags('products')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAllPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 12, imagesMulter))
  create(
    @Body() body: CreateProductDto,
    @UploadedFiles(ParseProductImagesPipe)
    files: Express.Multer.File[],
  ) {
    return this.productsService.create(body, files ?? []);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(':id/images')
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 12, imagesMulter))
  addImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.addImages(id, files ?? []);
  }

  @Delete(':id/images/:imageId')
  @Roles(UserRole.ADMIN)
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.removeImage(id, imageId);
  }
}
