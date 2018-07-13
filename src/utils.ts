export function batchFetch<S, T>(max: number, data: S[], promiseGenerator: (entry: S) => Promise<T>): Promise<T[]> {
    let index = 0;
    let results: any[] = [];

    const next = (): Promise<void> => {
        if (index >= data.length) {
            return Promise.resolve();
        }
        const itemIndex = index++;
        console.log(`\u001b[1A${itemIndex + 1} of ${data.length}`);
        return promiseGenerator(data[itemIndex]).then(result => {
            results[itemIndex] = result;
            return next();
        });
    }
    let promises = [];
    for (let i = 0; i < max; i++) {
        promises.push(next());
    }

    return Promise.all(promises).then(() => results);
}
