import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Branch } from '../../database/models/branch.model';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch)
    private readonly branchModel: typeof Branch,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    return this.branchModel.create(createBranchDto as any);
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.findAll();
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchModel.findByPk(id);
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(id);
    return branch.update(updateBranchDto as any);
  }

  async remove(id: string): Promise<void> {
    const branch = await this.findOne(id);
    await branch.destroy();
  }
} 