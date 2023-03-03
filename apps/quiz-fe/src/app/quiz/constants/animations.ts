import { animate, group, query, style, transition, trigger } from "@angular/animations";

const duration = ".5s";

export const slideLeft = [
  group([
    query(":enter", [
      style({ transform: "translateX(-100%)", opacity: 0, zIndex: 2 }),
      animate(`${duration} ease`, style({ transform: "translateX(0%)", opacity: 1 }))
    ], { optional: true }),
    query(":leave", [
      style({
        position: "absolute",
        left: '50%',
        transform: "translateX(-50%)",
        opacity: 1
      }),
      animate(`${duration} ease`, style({ transform: "translateX(50%)", opacity: 0 }))
    ], { optional: true })
  ])
];

export const slideRight = [
  group([
    query(":enter", [
      style({ transform: "translateX(100%)", opacity: 0, zIndex: 2 }),
      animate(`${duration} ease`, style({ transform: "translateX(0%)", opacity: 1 }))
    ], { optional: true }),
    query(":leave", [
      style({
        position: "absolute",
        left: '50%',
        transform: "translateX(-50%)",
        opacity: 1
      }),
      animate(`${duration} ease`, style({ transform: "translateX(-150%)", opacity: 0 }))
    ], { optional: true })
  ])
];

export const slideAnimation = trigger("slideAnimation", [
  transition(":increment", slideRight),
  transition(":decrement", slideLeft)
]);
