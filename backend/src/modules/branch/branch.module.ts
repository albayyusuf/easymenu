import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Branch } from '../../database/models/branch.model';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';

@Module({
  imports: [SequelizeModule.forFeature([Branch])],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {} 