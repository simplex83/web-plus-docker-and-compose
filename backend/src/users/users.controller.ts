import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  getCurrentUser(@Req() req) {
    return this.usersService.findById(req.user.id);
  }
  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
  @Patch('me')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }
  @Post('find')
  getUsers(@Body('query') query: string) {
    return this.usersService.findUsers(query);
  }
  @Get('me/wishes')
  getCurrentWshes(@Req() req) {
    return this.usersService.findMyWishes(req.user.id);
  }
  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }
}
