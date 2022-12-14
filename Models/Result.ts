export class Result {
    /** Whether the result was successful  */
    success: boolean;
    /** The message if it wasn't successful */
    message: string;
    constructor(success: boolean, message: string = "") {
        this.success = success;
        this.message = message;
    }
}