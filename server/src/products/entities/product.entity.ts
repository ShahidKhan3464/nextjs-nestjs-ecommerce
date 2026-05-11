import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductStatus } from '../constants/product.constants';
import { Category } from 'src/categories/entities/category.entity';

import {
  Index,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  // @Column({
  //   scale: 2,
  //   precision: 10,
  //   type: 'decimal',
  // })
  // basePrice: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Index()
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
