import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'jindol@gamil.com',
    description: '이메일',
    required: true,
  })
  public email: string;
  @ApiProperty({
    example: 'jindol',
    description: '닉네임',
    required: true,
  })
  public nickname: string;
  @ApiProperty({
    example: 'jindolPassword1!',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}
