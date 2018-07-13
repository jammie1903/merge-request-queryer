declare module "*.json" {
    //const value: { privateToken: string, domain: string };
    export const privateToken: string;
    export const domain: string;
}


declare module "*.css" {
    const value: any;
    export default value;
}
