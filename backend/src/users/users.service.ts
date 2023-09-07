import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CONFLICT_ERR } from 'src/constans';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    try {
      const user = await this.userRepository.save({
        ...createUserDto,
        password: hash,
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === CONFLICT_ERR) {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        password: true,
        username: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        username,
      },
    });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email || updateUserDto.username) {
      const userExist = await this.userRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });
      if (!!userExist) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userRepository.findOne({ where: { id } });

    const updatedUser = { ...user, ...updateUserDto };
    await this.userRepository.update(id, updatedUser);

    return this.userRepository.findOne({ where: { id } });
  }

  async findUsers(query: string) {
    return await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async findMyWishes(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        wishes: true,
        offers: true,
      },
    });
    return user.wishes;
  }

  async findUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        wishes: true,
        offers: true,
      },
    });
    return user.wishes;
  }
}
