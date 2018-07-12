declare module "*.json" {
    const value: { privateToken: string, domain: string };
    export default value;
}