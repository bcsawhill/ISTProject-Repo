export declare const description: (release: {
    [k: string]: any;
    status?: string | undefined;
}) => "" | "release command executing" | "release command failed" | "release expired";
export declare const color: (s?: string) => "gray" | "red" | "yellow" | "cyan";
