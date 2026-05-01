import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Channel } from './entities/channel.entity';
import {
  IChannelsServiceToken,
  IChannelsService,
} from './interfaces/channel.interface';

@ApiTags('channels')
@ApiBearerAuth('JWT-auth')
@Controller('channels')
export class ChannelsController {
  constructor(
    @Inject(IChannelsServiceToken)
    private readonly channelService: IChannelsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau channel' })
  @ApiResponse({
    status: 201,
    description: 'Le channel a été créé avec succès.',
    type: Channel,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les channels' })
  @ApiResponse({
    status: 200,
    description: 'Liste des channels récupérée avec succès.',
    type: [Channel],
  })
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Récupérer un channel par son UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID du channel' })
  @ApiResponse({
    status: 200,
    description: 'Le channel a été trouvé.',
    type: Channel,
  })
  @ApiResponse({ status: 404, description: 'Channel non trouvé' })
  findOne(@Param('uuid') uuid: string) {
    return this.channelService.findOne(uuid);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Mettre à jour un channel' })
  @ApiParam({ name: 'uuid', description: 'UUID du channel' })
  @ApiResponse({
    status: 200,
    description: 'Le channel a été mis à jour.',
    type: Channel,
  })
  @ApiResponse({ status: 404, description: 'Channel non trouvé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    const channel = await this.channelService.update(uuid, updateChannelDto);
    if (!channel) {
      throw new NotFoundException(`Channel with UUID "${uuid}" not found`);
    }
    return channel;
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Supprimer un channel' })
  @ApiParam({ name: 'uuid', description: 'UUID du channel' })
  @ApiResponse({ status: 200, description: 'Le channel a été supprimé.' })
  @ApiResponse({ status: 404, description: 'Channel non trouvé' })
  remove(@Param('uuid') uuid: string) {
    return this.channelService.remove(uuid);
  }
}
