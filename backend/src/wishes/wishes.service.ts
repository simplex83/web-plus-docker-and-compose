import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, idUser: number) {
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: { id: idUser },
    });
    return wish;
  }

  async findLastWishes() {
    return await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      skip: 0,
      take: 40,
    });
  }

  async findTopWishes() {
    return await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      skip: 0,
      take: 10,
    });
  }

  async findWishById(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }
    return wish;
  }

  async updateWish(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException('Изменить цену подарка уже не получится');
    }
    await this.wishRepository.update(id, updateWishDto);
    return this.wishRepository.findOne({ where: { id } });
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }
    await this.wishRepository.delete(id);
    return wish;
  }

  async copyWish(id: number, idUser: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }
    if (wish.owner.id === idUser) {
      throw new ForbiddenException('Этот подарок уже есть в вашей коллекции');
    }
    const newWish = await this.wishRepository.insert({
      ...wish,
      copied: 0,
      raised: 0,
      owner: {
        id: idUser,
      },
    });
    wish.copied = +1;
    await this.wishRepository.save(wish);
    return newWish;
  }
}
