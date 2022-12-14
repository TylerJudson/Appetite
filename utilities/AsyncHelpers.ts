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
 * @param key The key of the item to get i.e. SyncInformation
 * @returns The value (or an error) of the item from storage. If the key is incorrect (or there is nothing there) it returns undefined. The item will not be typed.
 */
export async function getItem(key: string) {
    try {
        const result = await AsyncStorage.getItem(key);
        if (result != null) {
            return JSON.parse(result);
        }
    } catch (error) {
        return `ERROR loading ${key}`;
    }
}