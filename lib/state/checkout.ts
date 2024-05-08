import { observable } from "@legendapp/state";

export enum StepStatus {
  CURRENT = "current",
  EDITABLE = "editable",
  HIDDEN = "hidden",
}

export enum StepTypes {
  CONTACT = "contact",
  SHIPPING_ADDRESS = "shippingAddress",
  SHIPPING_METHODS = "shippingMethods",
  PAYMENT = "payment",
}

export const STEPS = {
  contact: {
    contact: StepStatus.CURRENT,
    shippingAddress: StepStatus.HIDDEN,
    shippingMethods: StepStatus.HIDDEN,
    payment: StepStatus.HIDDEN,
  },
  shippingAddress: {
    contact: StepStatus.EDITABLE,
    shippingAddress: StepStatus.CURRENT,
    shippingMethods: StepStatus.HIDDEN,
    payment: StepStatus.HIDDEN,
  },
  shippingMethods: {
    contact: StepStatus.EDITABLE,
    shippingAddress: StepStatus.EDITABLE,
    shippingMethods: StepStatus.CURRENT,
    payment: StepStatus.HIDDEN,
  },
  payment: {
    contact: StepStatus.EDITABLE,
    shippingAddress: StepStatus.EDITABLE,
    shippingMethods: StepStatus.EDITABLE,
    payment: StepStatus.CURRENT,
  },
};

export const checkout$ = observable(STEPS[StepTypes.CONTACT]);

export const setStep = (step: StepTypes) => {
    checkout$.set(STEPS[step]);
  };