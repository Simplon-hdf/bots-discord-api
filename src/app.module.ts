import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { loggerConfig } from './config/logger.config';
import { GuildsModule } from './guilds/guilds.module';
import { CampusesModule } from './campuses/campuses.module';
import { GuildsTemplatesModule } from './guilds-templates/guilds-templates.module';
import { ResourcesModule } from './resources/resources.module';
import { ReportsModule } from './reports/reports.module';
import { ModeratorActionsModule } from './moderator-actions/moderator-actions.module';
import { MembersInformationsModule } from './members-informations/members-informations.module';
import { CategoriesModule } from './categories/categories.module';
import { AnswersModule } from './answers/answers.module';
import { RolesModule } from './roles/roles.module';
import { MembersModule } from './members/members.module';
import { XpTransactionsModule } from './xp-transactions/xp-transactions.module';
import { QuestionsModule } from './questions/questions.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ChannelsModule } from './channels/channels.module';
import { IdentificationRequestsModule } from './identification-requests/identification-requests.module';
import { DashboardAccountModule } from './dashboard-accounts/dashboard-accounts.module';
import { VotesModule } from './votes/votes.module';
import { CommentsModule } from './comments/comments.module';
import { DiscordUsersModule } from './discord-users/discord-users.module';
import { CoursesModule } from './courses/courses.module';
import { TagsModule } from './tags/tags.module';
import { PollsModule } from './polls/polls.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PollTemplatesModule } from './poll-templates/poll-templates.module';
import { QuestionTemplatesModule } from './question-templates/question-templates.module';

/**
 * Module principal de l'application
 *
 * Ce module importe et configure :
 * - La connexion à la base de données via TypeORM
 * - Le système de logging via Pino
 * - Les modules fonctionnels de l'application
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    LoggerModule.forRoot(loggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AuthModule,
    GuildsModule,
    CampusesModule,
    GuildsTemplatesModule,
    ResourcesModule,
    ModeratorActionsModule,
    MembersInformationsModule,
    CategoriesModule,
    AnswersModule,
    RolesModule,
    MembersModule,
    XpTransactionsModule,
    QuestionsModule,
    PromotionsModule,
    ChannelsModule,
    DashboardAccountModule,
    IdentificationRequestsModule,
    VotesModule,
    ReportsModule,
    CommentsModule,
    DiscordUsersModule,
    CommentsModule,
    ReportsModule,
    CoursesModule,
    CommentsModule,
    TagsModule,
    PollsModule,
    PollTemplatesModule,
    QuestionTemplatesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext('AppModule');
  }

  onModuleInit() {
    this.logger.info('Application started 🚀');
  }
}
