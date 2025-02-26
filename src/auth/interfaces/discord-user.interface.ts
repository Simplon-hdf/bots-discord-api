export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
  verified?: boolean;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
}

export interface DiscordGuildMember {
  user: DiscordUser;
  nick: string | null;
  roles: string[];
  joined_at: string;
  deaf: boolean;
  mute: boolean;
} 