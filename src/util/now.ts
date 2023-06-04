let _now: () => number = Date.now;

export function now() {
    return _now();
}

export function setNow(fn: () => number) {
    _now = fn;
}