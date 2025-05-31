import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from '../../database/models/menu.model';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly menuModel: typeof Menu,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuModel.create(createMenuDto as any);
  }

  async findAll(): Promise<Menu[]> {
    return this.menuModel.findAll();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel.findByPk(id);
    if (!menu) throw new NotFoundException('Menu not found');
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const menu = await this.findOne(id);
    return menu.update(updateMenuDto as any);
  }

  async remove(id: string): Promise<void> {
    const menu = await this.findOne(id);
    await menu.destroy();
  }
} 