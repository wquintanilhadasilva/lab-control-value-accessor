import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldMachingChars'
})
export class BoldMachingCharsPipe implements PipeTransform {

  transform(str: any, args?: any): any {

    if (typeof args !== 'string' || !str || !args) {
      return str;
    }
    args = args.split('(').join('').split(')').join('');
    const regexp: RegExp = new RegExp(args, 'ig');

    const splitted = str.split(regexp);

    return splitted.length <= 1
      ? str
      : str.replace(regexp, `<strong style="color:blue;">${args.toUpperCase()}</strong>`);

  }

}
