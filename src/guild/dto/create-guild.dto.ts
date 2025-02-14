export class CreateGuildDto {
  uuid: string;
  name: string;
  memberCount: number;
  configuration?: Record<string, any>;
}
