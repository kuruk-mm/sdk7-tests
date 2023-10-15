import { TestPlan_TestPlanEntry, TestResult, logTestResult, plan } from "~system/Testing";
import { engine } from '@dcl/sdk/ecs'
type TestCase = {
    description: string;
    testFn: () => void | Promise<void>;
};

type TestSuite = {
    suiteName: string;
    testCases: TestCase[];
};

const testSuites: TestSuite[] = [];

export function describe(suiteName: string, describeFn: () => void) {
    const testCases: TestCase[] = [];
    testSuites.push({ suiteName, testCases });
    describeFn();
}

export function it(description: string, testFn: () => void) {
    const currentSuite = testSuites[testSuites.length - 1];
    if (currentSuite) {
        currentSuite.testCases.push({ description, testFn });
    }
}

let framesCounter = 0
engine.addSystem(() => {
    ++framesCounter
})

export async function runTest({ testFn, description }: TestCase): Promise<TestResult> {
    const startFrames = framesCounter
    const startTime = new Date().getTime()
    let success = false
    let error = undefined
    let stack = undefined
    try {
        await testFn()
        console.log(`  ✓ ${description}`);
        success = true
    } catch (error: any) {
        console.error(`  ✗ ${description}`);
        console.error(`    ${error.message}`);
        error = error
        success = false
        if (error instanceof Error) {
            stack = error.stack
        }
    }

    const totalFrames = framesCounter - startFrames
    const totalTime = (new Date().getTime() - startTime) / 1000.0 // seconds
    return {
        name: description,
        ok: success,
        totalFrames,
        totalTime,
        error,
        stack
    }
}

async function reportPlan() {
    const testNames: TestPlan_TestPlanEntry[] = []
    for (const suite of testSuites) {
        for (const testCase of suite.testCases) {
            testNames.push({
                name: `${suite.suiteName} ${testCase.description}`
            })
        }
    }
    await plan({
        tests: testNames
    })
}

export async function runTests() {
    await reportPlan()

    for (const suite of testSuites) {
        console.log(`Running test suite: ${suite.suiteName}`);
        for (const testCase of suite.testCases) {
            const result = await runTest(testCase)
            console.log(result)

            await logTestResult(result)
        }
    }
}