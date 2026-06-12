import { join } from 'path';
import { unlink } from 'fs/promises';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileOwnerModule } from 'src/common/files/file.constants';
import { StoredFile } from 'src/common/files/entities/stored-file.entity';

@Injectable()
export class DeleteProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(StoredFile)
    private readonly fileRepository: Repository<StoredFile>,
  ) {}

  public async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const images = await this.fileRepository.find({
      where: { ownerModule: FileOwnerModule.PRODUCT, ownerId: id },
    });
    await Promise.all(
      images.map((img) => this.safeUnlinkPublicPath(img.urlPath)),
    );
    if (images.length) {
      await this.fileRepository.remove(images);
    }
    await this.productRepository.softRemove(product);
  }

  public async safeUnlinkPublicPath(urlPath: string): Promise<void> {
    const relative = urlPath.replace(/^\//, '');
    const abs = join(process.cwd(), relative);
    try {
      await unlink(abs);
    } catch {
      /* file may already be gone */
    }
  }
}
