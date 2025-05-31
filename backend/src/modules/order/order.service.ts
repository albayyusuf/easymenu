import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../../database/models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderModel.create(createOrderDto as any);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findByPk(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    return order.update(updateOrderDto as any);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await order.destroy();
  }
} 