import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Repository {
  @PrimaryColumn({ type: "varchar" })
  id!: string;

  @Column({ type: "varchar" })
  userId!: string;

  @Column({ type: "varchar" })
  projectPath!: string; // path to the project in the repository

  @Column({ type: "int", nullable: true })
  stars!: number | null; // Кількість зірок

  @Column({ type: "int", nullable: true })
  forks!: number | null; // Кількість відгалужень

  @Column({ type: "int", nullable: true })
  issues!: number | null; // Кількість відкритих питань

  @Column({ type: "boolean", nullable: true, default: null })
  notExist!: boolean | null;

  @CreateDateColumn()
  createdAt!: Date; // Дата створення у форматі UTC Unix timestamp
}
