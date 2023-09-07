import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  itemsId: number[];
}
