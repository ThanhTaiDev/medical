import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDoctorDto, UpdateMajorDoctorDto, QueryMajorDoctorDto, createMajorDoctorSchema, updateMajorDoctorSchema, queryMajorDoctorSchema } from './dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { UserInfo } from '../../common/decorators/users.decorator';
import { IUserFromToken } from '../users/types/user.type';

@Controller('major-doctors')
@UseGuards(JwtAuthGuard)
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  private ensureAdmin(user: IUserFromToken) {
    if (user.roles !== UserRole.ADMIN) {
      throw new HttpException('Bạn không có quyền thực hiện thao tác này', HttpStatus.FORBIDDEN);
    }
  }

  private ensureAdminOrDoctor(user: IUserFromToken) {
    if (user.roles !== UserRole.ADMIN && user.roles !== UserRole.DOCTOR) {
      throw new HttpException('Bạn không có quyền thực hiện thao tác này', HttpStatus.FORBIDDEN);
    }
  }

  /**
   * Tạo mới chuyên khoa bác sĩ
   * Chỉ ADMIN mới có quyền tạo
   */
  @Post()
  create(
    @Body(new ZodValidationPipe(createMajorDoctorSchema)) createMajorDoctorDto: CreateMajorDoctorDto,
    @UserInfo() user: IUserFromToken
  ) {
    this.ensureAdmin(user);
    return this.majorService.create(createMajorDoctorDto);
  }

  /**
   * Lấy danh sách chuyên khoa với phân trang và tìm kiếm
   * ADMIN và DOCTOR có thể xem
   */
  @Get()
  findAll(
    @Query(new ZodValidationPipe(queryMajorDoctorSchema)) query: QueryMajorDoctorDto,
    @UserInfo() user: IUserFromToken
  ) {
    this.ensureAdminOrDoctor(user);
    return this.majorService.findAll(query);
  }

  /**
   * Lấy danh sách chuyên khoa đang hoạt động (cho dropdown)
   * Tất cả user đã đăng nhập đều có thể xem
   */
  @Get('active')
  findActive(@UserInfo() user: IUserFromToken) {
    // Không cần kiểm tra quyền vì tất cả user đã đăng nhập đều có thể xem
    return this.majorService.findActive();
  }

  /**
   * Lấy thông tin chi tiết một chuyên khoa
   * ADMIN và DOCTOR có thể xem
   */
  @Get(':id')
  findOne(@Param('id') id: string, @UserInfo() user: IUserFromToken) {
    this.ensureAdminOrDoctor(user);
    return this.majorService.findOne(id);
  }

  /**
   * Cập nhật thông tin chuyên khoa
   * Chỉ ADMIN mới có quyền cập nhật
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateMajorDoctorSchema)) updateMajorDoctorDto: UpdateMajorDoctorDto,
    @UserInfo() user: IUserFromToken
  ) {
    this.ensureAdmin(user);
    return this.majorService.update(id, updateMajorDoctorDto);
  }

  /**
   * Cập nhật trạng thái hoạt động của chuyên khoa
   * Chỉ ADMIN mới có quyền cập nhật
   */
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id') id: string, 
    @Body('isActive') isActive: boolean,
    @UserInfo() user: IUserFromToken
  ) {
    this.ensureAdmin(user);
    return this.majorService.updateStatus(id, isActive);
  }

  /**
   * Xóa chuyên khoa
   * Chỉ ADMIN mới có quyền xóa
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @UserInfo() user: IUserFromToken) {
    this.ensureAdmin(user);
    return this.majorService.remove(id);
  }
}
