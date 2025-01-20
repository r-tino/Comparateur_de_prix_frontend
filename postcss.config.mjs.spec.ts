/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';

describe('PostcssConfig', () => {
    let postcssConfig: PostcssConfig;

beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [], // Add
        controllers: [], // Add
        providers: [],   // Add
    }).compile();

    postcssConfig = moduleRef.get<PostcssConfig>(PostcssConfig);
    });

it('should be defined', () => {
    expect(postcssConfig).toBeDefined();
    });
});
