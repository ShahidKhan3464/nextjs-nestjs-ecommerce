import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { GetProductsProvider } from './get-products.provider';
import { DeleteProductProvider } from './delete-product.provider';

@Injectable()
export class ProductImagesProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @Inject(forwardRef(() => GetProductsProvider))
    private readonly getProductsProvider: GetProductsProvider,
    private readonly deleteProductProvider: DeleteProductProvider,
  ) {}

  public async addImages(
    productId: number,
    files: Express.Multer.File[],
  ): Promise<Product> {
    if (!files?.length) {
      throw new BadRequestException('No image files provided');
    }
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const raw = await this.productImageRepository
      .createQueryBuilder('img')
      .select('MAX(img.sortOrder)', 'max')
      .where('img.productId = :productId', { productId })
      .getRawOne<{ max: string | null }>();
    const maxSort = raw?.max != null ? Number(raw.max) : -1;

    const entities = files.map((file, index) =>
      this.productImageRepository.create({
        urlPath: `/uploads/products/${file.filename}`,
        sortOrder: maxSort + 1 + index,
        product,
      }),
    );
    await this.productImageRepository.save(entities);
    return await this.getProductsProvider.findOne(productId);
  }

  public async removeImage(productId: number, imageId: number): Promise<void> {
    const image = await this.productImageRepository.findOne({
      where: { id: imageId, product: { id: productId } },
      relations: ['product'],
    });
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    await this.deleteProductProvider.safeUnlinkPublicPath(image.urlPath);
    await this.productImageRepository.remove(image);
  }
}
