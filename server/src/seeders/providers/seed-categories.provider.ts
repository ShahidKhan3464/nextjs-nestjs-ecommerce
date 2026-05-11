import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

const DEFAULT_CATEGORIES: { name: string; description: string }[] = [
  {
    name: 'Apparel',
    description:
      'Clothing and wearable essentials for everyday comfort and style.',
  },
  {
    name: 'Footwear',
    description:
      'Shoes, sneakers, and boots for casual wear and active lifestyles.',
  },
  {
    name: 'Accessories',
    description:
      'Bags, belts, hats, and finishing touches that complete any outfit.',
  },
  {
    name: 'Home',
    description:
      'Decor and household goods that make living spaces feel welcoming.',
  },
  {
    name: 'Electronics',
    description:
      'Gadgets and tech accessories for work, play, and daily convenience.',
  },
];

@Injectable()
export class SeedCategoriesProvider implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedCategoriesProvider.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    await this.seedDefaultCategories();
  }

  private async seedDefaultCategories(): Promise<void> {
    let created = 0;
    for (const row of DEFAULT_CATEGORIES) {
      const exists = await this.categoryRepository.exists({
        where: { name: row.name },
      });
      if (exists) continue;
      await this.categoryRepository.save(this.categoryRepository.create(row));
      created += 1;
    }
    if (created > 0) {
      this.logger.log(`Seeded ${created} default categor(y/ies).`);
    }
  }
}
