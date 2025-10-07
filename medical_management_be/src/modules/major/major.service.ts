import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { CreateMajorDoctorDto, UpdateMajorDoctorDto, QueryMajorDoctorDto } from './dto';

@Injectable()
export class MajorService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Tạo mới chuyên khoa bác sĩ
   */
  async create(createMajorDoctorDto: CreateMajorDoctorDto) {
    // Kiểm tra mã chuyên khoa đã tồn tại chưa
    const existingMajor = await this.databaseService.client.majorDoctorTable.findUnique({
      where: { code: createMajorDoctorDto.code },
    });

    if (existingMajor) {
      throw new ConflictException(`Mã chuyên khoa "${createMajorDoctorDto.code}" đã tồn tại`);
    }

    return this.databaseService.client.majorDoctorTable.create({
      data: createMajorDoctorDto as any,
    });
  }

  /**
   * Lấy danh sách chuyên khoa với phân trang và tìm kiếm
   */
  async findAll(query: QueryMajorDoctorDto) {
    const { page, limit, search, isActive, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện where
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Thực hiện query
    const [majors, total] = await Promise.all([
      this.databaseService.client.majorDoctorTable.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: { doctors: true },
          },
        },
      }),
      this.databaseService.client.majorDoctorTable.count({ where }),
    ]);

    return {
      data: majors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Lấy thông tin chi tiết một chuyên khoa
   */
  async findOne(id: string) {
    const major = await this.databaseService.client.majorDoctorTable.findUnique({
      where: { id },
      include: {
        doctors: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: { doctors: true },
        },
      },
    });

    if (!major) {
      throw new NotFoundException(`Không tìm thấy chuyên khoa với ID: ${id}`);
    }

    return major;
  }

  /**
   * Cập nhật thông tin chuyên khoa
   */
  async update(id: string, updateMajorDoctorDto: UpdateMajorDoctorDto) {
    // Kiểm tra chuyên khoa có tồn tại không
    const existingMajor = await this.databaseService.client.majorDoctorTable.findUnique({
      where: { id },
    });

    if (!existingMajor) {
      throw new NotFoundException(`Không tìm thấy chuyên khoa với ID: ${id}`);
    }

    // Nếu cập nhật mã chuyên khoa, kiểm tra trùng lặp
    if (updateMajorDoctorDto.code && updateMajorDoctorDto.code !== existingMajor.code) {
      const duplicateMajor = await this.databaseService.client.majorDoctorTable.findUnique({
        where: { code: updateMajorDoctorDto.code },
      });

      if (duplicateMajor) {
        throw new ConflictException(`Mã chuyên khoa "${updateMajorDoctorDto.code}" đã tồn tại`);
      }
    }

    return this.databaseService.client.majorDoctorTable.update({
      where: { id },
      data: updateMajorDoctorDto as any,
    });
  }

  /**
   * Xóa chuyên khoa (soft delete)
   */
  async remove(id: string) {
    // Kiểm tra chuyên khoa có tồn tại không
    const existingMajor = await this.databaseService.client.majorDoctorTable.findUnique({
      where: { id },
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });

    if (!existingMajor) {
      throw new NotFoundException(`Không tìm thấy chuyên khoa với ID: ${id}`);
    }

    // Kiểm tra có bác sĩ nào đang sử dụng chuyên khoa này không
    if (existingMajor._count.doctors > 0) {
      throw new ConflictException(
        `Không thể xóa chuyên khoa này vì có ${existingMajor._count.doctors} bác sĩ đang sử dụng`,
      );
    }

    return this.databaseService.client.majorDoctorTable.delete({
      where: { id },
    });
  }

  /**
   * Lấy danh sách chuyên khoa đang hoạt động (cho dropdown)
   */
  async findActive() {
    return this.databaseService.client.majorDoctorTable.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        nameEn: true,
      },
    });
  }

  /**
   * Cập nhật trạng thái hoạt động của chuyên khoa
   */
  async updateStatus(id: string, isActive: boolean) {
    const existingMajor = await this.databaseService.client.majorDoctorTable.findUnique({
      where: { id },
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });

    if (!existingMajor) {
      throw new NotFoundException(`Không tìm thấy chuyên khoa với ID: ${id}`);
    }

    // Nếu đang có bác sĩ sử dụng và muốn vô hiệu hóa
    if (!isActive && existingMajor._count.doctors > 0) {
      throw new ConflictException(
        `Không thể vô hiệu hóa chuyên khoa này vì có ${existingMajor._count.doctors} bác sĩ đang sử dụng`,
      );
    }

    return this.databaseService.client.majorDoctorTable.update({
      where: { id },
      data: { isActive },
    });
  }
}
