type DBObject = {
    id: number;
    created_at: string;
    updated_at: string;
};

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};