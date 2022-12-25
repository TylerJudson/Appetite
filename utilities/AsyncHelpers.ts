import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * Stringifys then saves an item with the designated string to asyncStorage. 
 * @param key The key of the item to save i.e. SyncInformation
 * @param value The value of the item
 */
export async function saveItem(key: string, value: any) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log("Error:", error);
    }
}

/**
 * Get's an item from asyncStorage with the designated key
 * @param key The key of the item to get i.e. RecipeBook
 * @param ref The reference of the object to get from storage
 * @returns A string of the result of the get i.e. "Success" or "Nothing Found" or "Error ..."
 */
export async function getItem(key: string, ref: any) {
    try {
        const result = await AsyncStorage.getItem(key);
        if (result != null && result !== "{}")  {
            const parsedResult = JSON.parse(result);
            
            Object.getOwnPropertyNames(ref).forEach(key => {
                ref[key] = parsedResult[key];
            })
            return "Success";
        }
        else {
            return "Nothing Found"
        }
    } catch (error) {
        return `Error loading ${key}`;
    }
}