import { PartialType } from '@nestjs/swagger';
import { CreateEventStaffDto } from './create-event-staff.dto';

export class UpdateEventStaffDto extends PartialType(CreateEventStaffDto) {}
