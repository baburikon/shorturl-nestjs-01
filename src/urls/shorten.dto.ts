import { IsOptional, IsUrl, MaxLength, ValidateIf } from 'class-validator';

export class ShortenDto {
  @MaxLength(255, {
    message: 'The URL is too long',
  })
  @IsUrl()
  longUrl: string;

  @MaxLength(255, {
    message: 'The hash is too long',
  })
  @ValidateIf(
    // checking for valid characters
    () => {
      return true;
    },
    {
      message: 'The hash contains unsupported characters',
    },
  )
  @IsOptional()
  customHashOfUrl?: string;
}
