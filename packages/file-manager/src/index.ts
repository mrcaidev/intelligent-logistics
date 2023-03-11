import { Semaphore } from "./semaphore";

const sem = new Semaphore();

async function processA() {
  await sem.acquire();
  console.log("A");
  sem.release();
}

async function processB() {
  await sem.acquire();
  console.log("B");
  sem.release();
}

async function processC() {
  await sem.acquire();
  console.log("C");
  sem.release();
}

processA();
processB();
processC();
