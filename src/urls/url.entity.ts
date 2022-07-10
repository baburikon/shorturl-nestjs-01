import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  @Index({ unique: true })
  hashOfUrl: string;

  @Column({
    nullable: false,
  })
  longUrl: string;
}
