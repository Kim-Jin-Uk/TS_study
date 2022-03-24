import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository, Connection } from 'typeorm';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection,
  ) {}
  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자 입니다');
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returnUser = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: returnUser.id,
        WorkspaceId: 1,
      });

      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returnUser.id,
        ChannelId: 1,
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
