import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new BadRequestException('Подарок не найден');
    }
    if (wish.owner.id === userId) {
      throw new ForbiddenException('Вы не можете скинуться на свой подарок');
    }
    if (createOfferDto.amount + wish.raised > wish.price) {
      throw new ForbiddenException('Сумма превышает необходмое значение');
    } else {
      (wish.raised = wish.raised + createOfferDto.amount),
        this.wishRepository.save(wish);
    }
    const offer = await this.offerRepository.save({
      ...createOfferDto,
      user: { id: userId },
      item: { id: createOfferDto.itemId },
    });
    return offer;
  }

  async findOffers() {
    return await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async findOffer(id: number) {
    return await this.offerRepository.findOneBy({ id });
  }
}
