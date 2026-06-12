import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { OrderStatus } from '../constants/order.constants';
import { MailService } from 'src/mail/providers/mail.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { joinProductImages } from 'src/common/files/file-query.util';
import { OrderResponse, mapOrderToResponse } from '../utils/map-order.util';

@Injectable()
export class UpdateOrderStatusProvider {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  async update(orderId: number, status: OrderStatus): Promise<OrderResponse> {
    const order = await joinProductImages(
      this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.variant', 'variant')
        .leftJoinAndSelect('variant.product', 'product')
        .where('order.id = :orderId', { orderId }),
      'product',
    ).getOne();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.status;
    order.status = status;
    await this.orderRepository.save(order);

    const response = mapOrderToResponse(order);

    if (previousStatus !== status) {
      const customer = await this.usersService.findOneById(order.userId);
      if (customer?.email) {
        void this.mailService
          .sendOrderStatusUpdateEmail(
            customer.email,
            customer.fullName,
            response,
            status,
          )
          .catch(() => undefined);
      }
    }

    return response;
  }
}
