import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Guest } from 'src/auth/guest.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { PublicUserDto } from './dto/public-user-dto';
import { ProfileUserDto } from './dto/profile-user-dto';

@ApiTags("Users")
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {}

  @ApiOperation({summary: "Login a user", description: "Login user using email and password"})
  @ApiBasicAuth()
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ description: "Login success. Return a bearer token to be used for every protected routes.", schema: { properties: { access_token: { example: "TFrsdtngqelrgSEHTDswefgrbqesh" } } } })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req): Promise<{ access_token: string; }> {
    return this.authService.login(req.user);
  }

  @ApiOperation({summary: "Create a user", description: "Create user from received inputs"})
  @Guest()
  @ApiCreatedResponse({ description: "User created" })
  @ApiInternalServerErrorResponse({ description: "Internal server error. Check all fields is valid." })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @ApiOperation({summary: "Get user profile", description: "Get the profile of the currently auth user"})
  @ApiOkResponse({ description: "Success, return user data", type: ProfileUserDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get('profile')
  getProfile(@Request() req): any {
    return req.user;
  }

  @ApiOperation({summary: "Get users list", description: "Return all users in array"})
  @ApiOkResponse({ description: "Success, return users data array", type: [PublicUserDto] })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({ description: "Success, return a user data", type: PublicUserDto })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @ApiOperation({summary: "Get a user data", description: "Return all data from a specific user"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({summary: "Update a user", description: "Update user with send datas"})
  @ApiOkResponse({ description: "Success, user updated" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({summary: "Delete a user", description: "Delete a user by id"})
  @ApiOkResponse({ description: "Success, user deleted" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
