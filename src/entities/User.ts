import { IsEmail, Length } from "class-validator";
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import crypt from "bcryptjs";
import crypto from "crypto";
import { config } from 'dotenv'
import { EMAIL_VALIDATION_EXPIRATION_IN_MINUTES } from "../constatns";
import EmailSender from "../helpers/EmailSender";


config();

/**
 * TODO:
 * 
 * User entity should generate random token and pin and asign it to paasword_reset_[token | pin]
 * when the user try to reset his password
 * 
 */
@Entity('users')
export class User extends BaseEntity {

    @BeforeInsert()
    async on_register() {
        this.password = await crypt.hash(this.password, 12);
        const pin = crypto.randomBytes(4).toString('hex')
        this.email_validation_pin = await crypt.hash(pin, 12);
        this.email_validation_pin_expires_at = new Date(new Date().getTime() + EMAIL_VALIDATION_EXPIRATION_IN_MINUTES * 60000);
        await new EmailSender(this, '', pin).sendValidationEmail();
    }



    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    // required fields
    @Length(2, 20)
    @Column('varchar')
    first_name: string;

    @Column('varchar')
    @Length(2, 20)
    last_name: string;


    @Column()
    @Length(5, 20)
    user_name: string;

    // Email fields
    @Column({
        type: 'varchar',
        unique: true,
    })
    @IsEmail()
    email: string;

    @Column({
        type: 'timestamptz',
        nullable: true
    })
    email_validate_at: Date;

    @Column({
        type: 'varchar',
        nullable: true,
        select: false
    })
    email_validation_pin: string;

    @Column({
        type: 'timestamptz',
        nullable: true,
        select: false,
    })
    email_validation_pin_expires_at: Date;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    phone_number: string;

    @Column('date')
    dob: Date;

    @Column({
        type: 'text',
        nullable: true,
    })
    bio: string;

    @Column({
        type: "boolean",
        default: true,
        select: false
    })
    is_active: boolean;

    @Column({
        type: 'timestamptz',
        nullable: true,
    })
    id_verified_at: Date;


    @Column({
        type: 'varchar',
        default: 'https://www.gravatar.com/avatar/?s=200&r=pg&d=mp'
    })
    profile_picture_url: string;


    @Column({
        type: 'varchar',
        select: false
    })
    password: string;


    @Column({
        type: 'timestamptz',
        nullable: true,
        select: false
    })
    password_changed_at: Date;


    @Column({
        type: 'varchar',
        nullable: true,
        select: false
    })
    paasword_reset_token: string;

    @Column({
        type: 'varchar',
        nullable: true,
        select: false
    })
    paasword_reset_pin: string;



}