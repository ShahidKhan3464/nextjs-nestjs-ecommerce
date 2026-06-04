import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from '../entities/cart-item.entity';
import {
  CartItemResponse,
  mapCartItemToResponse,
} from '../utils/map-cart-item.util';

@Injectable()
export class GetCartProvider {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
  ) {}

  public async findByUser(userId: number): Promise<CartItemResponse[]> {
    const items = await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.userId = :userId', { userId })
      .innerJoinAndSelect('cart.variant', 'variant')
      .innerJoinAndSelect('variant.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('images.sortOrder', 'ASC')
      .addOrderBy('cart.createdAt', 'ASC')
      .getMany();

    return items.map(mapCartItemToResponse);
  }
}
