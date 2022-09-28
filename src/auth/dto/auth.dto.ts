import {IsEmail, IsNotEmpty, Matches} from 'class-validator';
import validationMessage from '../../middleware/validationMessage';

export class signIn {
    @IsEmail({message: validationMessage.email})
    email: string;

    @IsNotEmpty()
    password: string;
}

export class signUp {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    age: number;

    @IsEmail()
    email: string;

    @Matches(/^[\+]?[(]?[0-9]{3}[)]?[0-9]{3}[-\s\.]?[0-9]{3}$/im, {
        message: validationMessage.phone,
    })
    phone: string;

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/, {
        message: validationMessage.password,
    })
    password: string;

    @IsNotEmpty()
    confirmPassword: string;
}


