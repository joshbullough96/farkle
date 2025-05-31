//wait utility class
export class Wait {
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}