import { IsEmail, IsPhoneNumber, Length } from "class-validator";
import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import crypt from "bcryptjs";
import { config } from 'dotenv'


config();


@Entity('users')
export class User extends BaseEntity {

    @BeforeInsert()
    async hash_password() {
        console.log(this.password, 'run  hook')
        this.password = await crypt.hash(this.password, 12);
    }



    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Length(2, 20)
    @Column('varchar')
    first_name: string;

    @Column('varchar')
    @Length(2, 20)
    last_name: string;


    @Column()
    @Length(5, 20)
    user_name: string;


    @Column({
        type: 'varchar',
        unique: true,
    })
    @IsEmail()
    email: string;

    @IsPhoneNumber()
    @Column({
        type: 'varchar',
        nullable: true,
    })
    phone_number: string;

    @Column('date')
    dob: Date;


    @Column({
        type: 'date',
        nullable: true
    })
    email_verified_at: Date;

    @Column({
        type: 'text',
        nullable: true,
    })
    bio: string;

    @Column({
        type: "boolean",
        default: true,
    })
    is_active: boolean;

    @Column({
        type: 'date',
        nullable: true,
    })
    id_verified_at: Date;


    @Column({
        type: 'varchar',
        default: 'https://www.gravatar.com/avatar/?s=200&r=pg&d=mp'
    })
    profile_picture_url: string;


    @Column('varchar')
    password: string;


    @Column({
        type: "varchar",
        nullable: true,
    })
    password_changed_at: Date;


    @Column({
        type: 'date',
        nullable: true
    })
    paasword_reset_token: Date;

}