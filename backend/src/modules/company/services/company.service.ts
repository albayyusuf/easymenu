import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from '../../../database/models/company.model';
import { CreateCompanyDto } from '../dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company)
    private companyModel: typeof Company,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyModel.create(createCompanyDto as any);
  }

  async findAll(): Promise<Company[]> {
    return this.companyModel.findAll();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findByPk(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async findBySlug(slug: string): Promise<Company> {
    const company = await this.companyModel.findOne({ where: { slug } });
    if (!company) {
      throw new NotFoundException(`Company with slug ${slug} not found`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: Partial<CreateCompanyDto>): Promise<[number, Company[]]> {
    return this.companyModel.update(updateCompanyDto as any, {
      where: { id },
      returning: true,
    });
  }

  async remove(id: string): Promise<number> {
    return this.companyModel.destroy({ where: { id } });
  }
}
