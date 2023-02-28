import { forwardRef, Provider, Type } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

export const clampValue = (v: number | string, min: number = 0, max: number = Number.MAX_SAFE_INTEGER) =>
  Math.min(Math.max(parseInt(v as string) || 0, min), max);
export const number2Index = (v: number | string) => (parseInt(v as string) || 1) - 1;
export const index2number = (v: number | string) => (parseInt(v as string) || 0) + 1;
export const provideControlValueAccessor = <T>(classFn: () => Type<T>): Provider => ({
  provide: NG_VALUE_ACCESSOR,
  multi: true,
  useExisting: forwardRef(classFn)
});
