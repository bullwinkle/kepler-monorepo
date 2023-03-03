import { animate, group, query, style, transition, trigger } from "@angular/animations";

const duration = ".5s";

export const slideLeft = [
  group([
    query(":enter", [
      style({ transform: "translateX(-100%)", opacity: 0, zIndex: 2 }),
      animate(`${duration} ease-out`, style({ transform: "translateX(0%)", opacity: 1 }))
    ], { optional: true }),
    query(":leave", [
      style({
        position: "absolute",
        transform: "translateX(0%)",
        opacity: 1
      }),
      animate(`${duration} ease-in`, style({ transform: "translateX(100%)", opacity: 0 }))
    ], { optional: true })
  ])
];

export const slideRight = [
  group([
    query(":enter", [
      style({ transform: "translateX(100%)", opacity: 0, zIndex: 2 }),
      animate(`${duration} ease-out`, style({ transform: "translateX(0%)", opacity: 1 }))
    ], { optional: true }),
    query(":leave", [
      style({
        position: "absolute",
        transform: "translateX(0%)",
        opacity: 1
      }),
      animate(`${duration} ease-in`, style({ transform: "translateX(-100%)", opacity: 0 }))
    ], { optional: true })
  ])
];

export const slideAnimation = trigger("slideAnimation", [
  transition(":increment", slideRight),
  transition(":decrement", slideLeft)
]);
