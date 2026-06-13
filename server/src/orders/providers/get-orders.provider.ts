import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryOrderDto } from '../dto/query-order.dto';
import { OrderStatus } from '../constants/order.constants';
import { joinProductImages } from 'src/common/files/file-query.util';
import { OrderResponse, mapOrderToResponse } from '../utils/map-order.util';

@Injectable()
export class GetOrdersProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  private baseQuery() {
    return joinProductImages(
      this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.variant', 'variant')
        .leftJoinAndSelect('variant.product', 'product')
        .withDeleted()
        .orderBy('order.createdAt', 'DESC'),
      'product',
    );
  }

  async findByUser(
    userId: number,
    query: QueryOrderDto = {},
  ): Promise<OrderResponse[]> {
    const qb = this.baseQuery()
      .where('order.userId = :userId', { userId })
      .andWhere('order.status != :pending', { pending: OrderStatus.PENDING });

    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    const orders = await qb.getMany();
    return orders.map(mapOrderToResponse);
  }

  async findAll(query: QueryOrderDto = {}): Promise<OrderResponse[]> {
    const qb = this.baseQuery().where('order.status != :pending', {
      pending: OrderStatus.PENDING,
    });

    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    const orders = await qb.getMany();
    return orders.map(mapOrderToResponse);
  }
}
