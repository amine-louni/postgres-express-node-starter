import { IsEmail, Length } from "class-validator";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import crypt from "bcryptjs";
import crypto from "crypto";
import { config } from "dotenv";
import {
  PASSWORD_PIN_EXPIRATION_IN_MINUTES,
  EMAIL_PIN_EXPIRATION_IN_MINUTES,
} from "../constatns";
import EmailSender from "../helpers/EmailSender";

config();

/**
 * TODO:
 *
 * User entity should generate random token and pin and asign it to password_reset_[token | pin]
 * when the user try to reset his password
 *
 */
@Entity("users")
export class User extends BaseEntity {
  @BeforeInsert()
  async on_register() {
    this.password = await crypt.hash(this.password, 12);
    const pin = crypto.randomBytes(4).toString("hex");
    this.email_validation_pin = await crypt.hash(pin, 12);
    this.email_validation_pin_expires_at = await new Date(
      new Date().getTime() + EMAIL_PIN_EXPIRATION_IN_MINUTES * 60000
    );
    new EmailSender(this, "", pin).sendValidationEmail();
  }

  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  // required fields
  @Length(2, 20)
  @Column("varchar")
  first_name: string;

  @Column("varchar")
  @Length(2, 20)
  last_name: string;

  @Column()
  @Length(5, 20)
  user_name: string;

  // Email fields
  @Column({
    type: "varchar",
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  email_validate_at: Date | null;

  @Column({
    type: "varchar",
    select: false,
  })
  password: string;

  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  email_validation_pin: string | null;

  @Column({
    type: "timestamptz",
    nullable: true,
    select: false,
  })
  email_validation_pin_expires_at: Date | null;

  @Column({
    type: "varchar",
    nullable: true,
  })
  phone_number: string;

  @Column("date")
  dob: Date;

  @Column({
    type: "text",
    nullable: true,
  })
  bio: string;

  @Column({
    type: "boolean",
    default: true,
  })
  is_active: boolean;

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  id_verified_at: Date | null;

  @Column({
    type: "varchar",
    default: "https://www.gravatar.com/avatar/?s=200&r=pg&d=mp",
  })
  profile_picture_url: string;

  @Column({
    type: "timestamptz",
    nullable: true,
    select: false,
  })
  password_changed_at: Date | null;

  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  password_reset_token: string | null;

  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  password_reset_pin: string | null;

  @Column({
    type: "timestamptz",
    nullable: true,
    select: false,
  })
  password_reset_pin_expires_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  // Helpers
  public async createAndSendPasswordResetPin() {
    try {
      const pin = crypto.randomBytes(4).toString("hex");
      this.password_reset_pin = await crypt.hash(pin, 12);
      this.password_reset_pin_expires_at = await new Date(
        new Date().getTime() + PASSWORD_PIN_EXPIRATION_IN_MINUTES * 60000
      );
      this.save();
      new EmailSender(this, "", pin).sendPasswordReset();
    } catch (e) {
      this.password_reset_pin = null;
      this.password_reset_pin_expires_at = null;
    }
  }
}
