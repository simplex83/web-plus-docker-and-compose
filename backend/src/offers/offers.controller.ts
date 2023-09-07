import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  getAllOffers() {
    return this.offersService.findOffers();
  }

  @Get(':id')
  getOneOffer(@Param('id') id: number) {
    return this.offersService.findOffer(id);
  }
}
