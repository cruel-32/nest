import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Public } from '@/decorators/jwt.decorator';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly TasksService: TasksService) {}

  // @Post()
  // create(@Body() createTasksDto: CreateTasksDto) {
  //   return this.TasksService.create(createTasksDto);
  // }

  @Public()
  @Get()
  async findByPaginate(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.TasksService.findTasksWithPaginate({
      page,
      limit,
    });
  }

  // @Get()
  // findAll() {
  //   return this.TasksService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.TasksService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateTasksDto: UpdateTasksDto) {
  //   return this.TasksService.update(+id, updateTasksDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.TasksService.remove(+id);
  // }
}
