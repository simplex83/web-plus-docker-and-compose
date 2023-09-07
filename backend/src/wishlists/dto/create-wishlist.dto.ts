import { IsOptional, IsUrl, IsArray, Length, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
