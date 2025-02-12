import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../guards/user.guard';
import { UserSelfGuard } from '../guards/user-self.guard';
import { FindUserDto } from './dto/find-user.dto';
import { AdminGuard } from '../guards/admin.guard';
import { AdminCreatorGuard } from '../guards/admin-creator.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  

  @Get("activate/:link")
  activate(@Param("link") link: string){
    return this.userService.activate(link);
  }

  // @UseGuards(UserGuard)
  @UseGuards(AdminCreatorGuard)
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }


  @UseGuards(UserSelfGuard)
  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(UserGuard)
  @HttpCode(200)
  @Post("findUser")
  findUsersByAny(@Body() dto: FindUserDto) {
    return this.userService.findUser(dto);
  }
}
