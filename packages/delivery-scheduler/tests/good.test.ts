import { getMostPrior } from "good";
import { Good } from "shared-types";
import { expect, it } from "vitest";

it("delivers goods by created time by default", () => {
  const now = new Date().getTime();

  const goods = [
    { name: "Beef", createdAt: now - 3, isVip: false },
    { name: "Pork", createdAt: now - 2, isVip: false },
    { name: "Milk", createdAt: now - 1, isVip: false },
  ] as Good[];

  const first = getMostPrior(goods);
  goods.splice(goods.indexOf(first), 1);
  expect(first.name).toEqual("Beef");

  const second = getMostPrior(goods);
  goods.splice(goods.indexOf(second), 1);
  expect(second.name).toEqual("Pork");

  const third = getMostPrior(goods);
  goods.splice(goods.indexOf(third), 1);
  expect(third.name).toEqual("Milk");
});

it("raises VIP good's priority", () => {
  const now = new Date().getTime();

  const goods = [
    { name: "Beef", createdAt: now - 3, isVip: false },
    { name: "Pork", createdAt: now - 2, isVip: true },
    { name: "Milk", createdAt: now - 1, isVip: false },
  ] as Good[];

  const first = getMostPrior(goods);
  goods.splice(goods.indexOf(first), 1);
  expect(first.name).toEqual("Pork");

  const second = getMostPrior(goods);
  goods.splice(goods.indexOf(second), 1);
  expect(second.name).toEqual("Beef");

  const third = getMostPrior(goods);
  goods.splice(goods.indexOf(third), 1);
  expect(third.name).toEqual("Milk");
});
