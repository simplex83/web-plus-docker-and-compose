import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  getAllwishlists() {
    return this.wishlistsService.findAllWishLists();
  }

  @Get(':id')
  getOneWishlist(@Param('id') id: number) {
    return this.wishlistsService.findOneWishList(id);
  }

  @Patch(':id')
  updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.updateWishList(
      id,
      updateWishlistDto,
      req.user.id,
    );
  }

  @Delete(':id')
  removeWishlist(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.removeWishlist(id, req.user.id);
  }
}
