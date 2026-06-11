import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from '../constants/order.constants';

/** Removes legacy PENDING orders left from the old checkout flow. */
@Injectable()
export class CleanupAbandonedOrdersProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async cleanupForUser(userId: number): Promise<void> {
    await this.orderRepository.delete({
      userId,
      status: OrderStatus.PENDING,
    });
  }
}
