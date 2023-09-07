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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.wishesService.findWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWish(
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
    @Param('id') id: number,
  ) {
    return this.wishesService.updateWish(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  removeWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.removeWish(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: number, @Req() req) {
    return this.wishesService.copyWish(id, req.user.id);
  }
}
