// TODO: Documentation

export function filterObject(obj: Object, predicate: (value: any) => boolean) {
    return Object.keys(obj)
        .filter(key => predicate(obj[key as keyof typeof obj]))
        .reduce((res, key) => Object.assign(res, { [key]: obj[key as keyof typeof obj] }), {});
}