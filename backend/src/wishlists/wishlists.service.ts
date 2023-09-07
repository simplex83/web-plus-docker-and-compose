import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, idUser: number) {
    const wishItems = createWishlistDto.itemsId.map((id) => ({ id }));
    const wishlist = await this.wishlistRepository.save({
      ...createWishlistDto,
      owner: { id: idUser },
      items: wishItems,
    });
    return wishlist;
  }

  async findAllWishLists() {
    return this.wishlistRepository.find({
      relations: ['items', 'owner'],
    });
  }

  async findOneWishList(id: number) {
    const wishList = this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });
    if (!wishList) {
      throw new BadRequestException('Вишлист не найден');
    }
    return wishList;
  }

  async updateWishList(
    idWishList: number,
    updateWishlistDto: UpdateWishlistDto,
    idUser: number,
  ) {
    const wishList = await this.wishlistRepository.findOne({
      where: { id: idWishList },
      relations: { owner: true },
    });
    if (!wishList) {
      throw new BadRequestException('Вишлист не найден');
    }
    if (wishList.owner.id !== idUser) {
      throw new ForbiddenException('Вы не можете редактировать чужие вишлисты');
    }
    const { itemsId, ...rest } = updateWishlistDto;
    if (itemsId) {
      const newWishItems = itemsId.map((id) => ({ id }));
      const updateWishList = { itemsId: newWishItems, ...rest };
      await this.wishlistRepository.save({
        ...updateWishList,
        id: idWishList,
        owner: { id: idUser },
      });
    } else {
      await this.wishlistRepository.save({
        ...updateWishlistDto,
        id: idWishList,
        owner: { id: idUser },
      });
    }
    return await this.wishlistRepository.findOneBy({ id: idWishList });
  }

  async removeWishlist(id: number, idUser: number) {
    const wishList = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishList) {
      throw new BadRequestException('Вишлист не найден');
    }
    if (wishList.owner.id !== idUser) {
      throw new ForbiddenException('Вы не можете редактировать чужие вишлисты');
    }
    await this.wishlistRepository.delete(id);
    return wishList;
  }
}
