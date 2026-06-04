import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import {
  CartItemResponse,
  mapCartItemToResponse,
} from '../utils/map-cart-item.util';

@Injectable()
export class AddCartItemProvider {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  public async add(
    userId: number,
    dto: AddCartItemDto,
  ): Promise<CartItemResponse> {
    const variant = await this.variantRepository.findOne({
      where: { id: dto.variantId },
      relations: ['product', 'product.images'],
    });

    if (!variant) {
      throw new BadRequestException('Product variant not found');
    }

    if (dto.quantity > variant.stock) {
      throw new BadRequestException('Insufficient stock');
    }

    let item = await this.cartRepository.findOne({
      where: { userId, productVariantId: dto.variantId },
      relations: ['variant', 'variant.product', 'variant.product.images'],
    });

    if (item) {
      const nextQty = Math.min(item.quantity + dto.quantity, variant.stock);
      item.quantity = nextQty;
      await this.cartRepository.save(item);
    } else {
      item = this.cartRepository.create({
        userId,
        productVariantId: dto.variantId,
        quantity: dto.quantity,
      });
      await this.cartRepository.save(item);
      item = await this.cartRepository.findOne({
        where: { id: item.id },
        relations: ['variant', 'variant.product', 'variant.product.images'],
      });
    }

    if (!item?.variant) {
      const reloaded = await this.cartRepository.findOne({
        where: { userId, productVariantId: dto.variantId },
        relations: ['variant', 'variant.product', 'variant.product.images'],
      });
      if (!reloaded) {
        throw new BadRequestException('Failed to add cart item');
      }
      return mapCartItemToResponse(reloaded);
    }

    return mapCartItemToResponse(item);
  }
}
