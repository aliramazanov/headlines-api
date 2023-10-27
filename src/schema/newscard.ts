import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Newscard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;
}
