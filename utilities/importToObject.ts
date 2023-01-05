
/**
 * Imports data into a reference object
 * @param ref The reference of the object to import
 * @param data the data to import into the object THIS MUST BE THE SAME TYPE!
 */
export function importToObject(ref: any, data: any) {
    Object.getOwnPropertyNames(data).forEach(key => {
        ref[key] = data[key];
    })
}