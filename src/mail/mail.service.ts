import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user.model';

@Injectable()

export class MailService {
  constructor(private mailService: MailerService){}

  async sendMail(user: User){
    const url = `${process.env.api_url}/api/user/activate/${user.activation_link}`;
    console.log(url);
    await this.mailService.sendMail({
      to:user.email,
      subject: "Skidkachiga xush kelibsiz",
      template: 'confirm',
      context:{
        name: user.name,
        url
      }
    })
  }
}
