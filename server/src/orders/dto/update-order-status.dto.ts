import { IsEnum } from 'class-validator';
import { OrderStatus } from '../constants/order.constants';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
