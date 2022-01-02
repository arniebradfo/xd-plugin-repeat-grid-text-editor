if (window.setTimeout == null) {
    window.setTimeout = (fn: any) => fn();
}

if (window.clearTimeout == null) {
    window.clearTimeout = () => {};
}

//  this is a temporary shim for the latest versions of react.
if (window.cancelAnimationFrame == null) {
    window.cancelAnimationFrame = () => {};
}

if (window.requestAnimationFrame == null) {
    //@ts-expect-error
    window.requestAnimationFrame = (callback: any) => {
        console.log("requestAnimationFrame is not supported yet");
    }
}

if (window.HTMLIFrameElement == null) {
    //@ts-expect-error
    window.HTMLIFrameElement = class HTMLIFrameElement { };
}