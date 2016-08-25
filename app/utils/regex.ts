
export default function extract(test: string, pattern: string): string[] {
    
    const regex = new RegExp(pattern);
    
    if (!regex.test(test))
        return null;

    const results = regex.exec(test).slice(1);

    if (results.length === 0)
        return null;
    
    return results;
}