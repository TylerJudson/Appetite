
// TODO: Docs
export function importToObject(ref: any, data: any) {
    Object.getOwnPropertyNames(ref).forEach(key => {
        ref[key] = data[key];
    })
}