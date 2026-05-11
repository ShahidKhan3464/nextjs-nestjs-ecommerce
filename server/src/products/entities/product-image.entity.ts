import { Product } from './product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  /** Public URL path, e.g. `/uploads/products/filename.jpg` */
  @Column({ type: 'varchar', length: 512 })
  urlPath: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
