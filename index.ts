// @index(['./**/index.ts', /\/_/g], f => `export * from "${f.path.replace('/index', '')}";`)
export * from "./fonts";
export * from "./npc";
export * from "./renderer";
// @endindex
