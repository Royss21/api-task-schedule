import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { parse, isBefore } from 'date-fns';

export function IsBeforeTime(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBeforeTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (!value || !relatedValue) {
            return true;  // Si alguno de los valores es null o undefined, no validamos
          }

          const currentTime = parse(value, 'HH:mm', new Date());
          const relatedTime = parse(relatedValue, 'HH:mm', new Date());

          return isBefore(currentTime, relatedTime);
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `The ${args.property} must be after the ${relatedPropertyName}`;
        }
      }
    });
  };
}