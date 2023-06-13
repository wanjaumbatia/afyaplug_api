import { PartialType } from '@nestjs/swagger';
import { CreatePersonelDto } from './create-personel.dto';

export class UpdatePersonelDto extends PartialType(CreatePersonelDto) {}
