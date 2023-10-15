import { engine } from "@dcl/sdk/ecs"

let uniqueId = 0
export function waitNextFrame() {
    ++uniqueId
    const name = `WaitNextFrame${uniqueId}`
    return new Promise<void>((resolve, _) => {
        engine.addSystem(() => {
            resolve()
            engine.removeSystem(name)
        }, undefined, name)
    })
}