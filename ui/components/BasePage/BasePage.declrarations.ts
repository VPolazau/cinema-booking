export interface IBasePage {
    isError?: boolean;
    errorMessage?: string;
    isPending?: boolean;
    isShowScrollBtn?: boolean;
    children: React.ReactNode;
}