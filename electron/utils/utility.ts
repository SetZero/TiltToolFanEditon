export async function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function getEnumKeyByEnumValue(myEnum: any, enumValue: string): any {
    let keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
    return (keys.length > 0 ? keys[0] : null);
}