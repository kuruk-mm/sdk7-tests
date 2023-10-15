import { runTests } from "./test-framework"
import * as test1 from './test/test1'
export async function main() {
  test1.run() // TODO: there is a way of waiting for it?

  console.log('Hello world')
  await runTests()
}
