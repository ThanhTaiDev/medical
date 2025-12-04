import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class MedicationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(
    isActive?: boolean,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) {
    const where = isActive === undefined ? {} : { isActive };
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 20;
    const orderByField = params?.sortBy || 'createdAt';
    const orderDir = params?.sortOrder || 'desc';
    const [items, total] = await Promise.all([
      this.databaseService.client.medication.findMany({
        where,
        orderBy: { [orderByField]: orderDir },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.databaseService.client.medication.count({ where })
    ]);
    return { items, total, page, limit };
  }

  async create(data: {
    name: string;
    strength?: string;
    form?: string;
    unit?: string;
    description?: string;
  }) {
    // Kiểm tra thuốc đã tồn tại với cùng tên, hàm lượng, dạng bào chế và đơn vị
    // Xây dựng điều kiện where động để xử lý đúng các trường optional
    const whereCondition: any = {
      name: data.name
    };

    // Xử lý các trường optional: nếu undefined thì coi như null trong database
    if (data.strength !== undefined) {
      whereCondition.strength = data.strength;
    } else {
      whereCondition.strength = null;
    }

    if (data.form !== undefined) {
      whereCondition.form = data.form;
    } else {
      whereCondition.form = null;
    }

    if (data.unit !== undefined) {
      whereCondition.unit = data.unit;
    } else {
      whereCondition.unit = null;
    }

    const existingMedication = await this.databaseService.client.medication.findFirst({
      where: whereCondition
    });

    if (existingMedication) {
      throw new ConflictException(
        'Thuốc đã tồn tại với cùng tên, hàm lượng, dạng bào chế và đơn vị'
      );
    }

    return this.databaseService.client.medication.create({
      data
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      strength?: string;
      form?: string;
      unit?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const med = await this.databaseService.client.medication.findUnique({
      where: { id }
    });
    if (!med) throw new NotFoundException('Medication not found');

    // Nếu có thay đổi thông tin thuốc, kiểm tra trùng lặp với thuốc khác
    const nameToCheck = data.name !== undefined ? data.name : med.name;
    const strengthToCheck = data.strength !== undefined ? data.strength : med.strength;
    const formToCheck = data.form !== undefined ? data.form : med.form;
    const unitToCheck = data.unit !== undefined ? data.unit : med.unit;

    // Xây dựng điều kiện where động để xử lý đúng các trường optional
    const whereCondition: any = {
      id: { not: id }, // Loại trừ chính thuốc đang update
      name: nameToCheck
    };

    // Xử lý các trường optional: nếu null/undefined thì query với null
    whereCondition.strength = strengthToCheck ?? null;
    whereCondition.form = formToCheck ?? null;
    whereCondition.unit = unitToCheck ?? null;

    const existingMedication = await this.databaseService.client.medication.findFirst({
      where: whereCondition
    });

    if (existingMedication) {
      throw new ConflictException(
        'Thuốc đã tồn tại với cùng tên, hàm lượng, dạng bào chế và đơn vị'
      );
    }

    return this.databaseService.client.medication.update({
      where: { id },
      data
    });
  }

  async deactivate(id: string) {
    const med = await this.databaseService.client.medication.findUnique({
      where: { id }
    });
    if (!med) throw new NotFoundException('Medication not found');
    return this.databaseService.client.medication.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
