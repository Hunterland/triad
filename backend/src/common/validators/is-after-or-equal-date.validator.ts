import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsAfterOrEqualDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterOrEqualDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];

          if (!value || !relatedValue) {
            return true;
          }

          const currentDate = new Date(String(value));
          const relatedDate = new Date(String(relatedValue));

          if (
            Number.isNaN(currentDate.getTime()) ||
            Number.isNaN(relatedDate.getTime())
          ) {
            return false;
          }

          return currentDate.getTime() >= relatedDate.getTime();
        },

        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} deve ser maior ou igual a ${relatedPropertyName}`;
        },
      },
    });
  };
}
