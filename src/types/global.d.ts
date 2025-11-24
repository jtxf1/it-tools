// src/global.d.ts
interface CustomApis {
    readFile: (path: string) => Promise<string>;
    // 在这里添加其他customApis的方法定义
    [key: string]: any; // 可选：允许其他未定义的方法
}

interface Window {
    customApis: CustomApis;
}