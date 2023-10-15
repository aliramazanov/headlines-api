import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class NewsPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  constructor() {
    this.id = 0;
    this.title = "";
    this.content = "";
    this.author = "";
  }
}
