export const ID_GENERATOR_TOKEN = 'IdGenerator';

export interface IdGenerator {
  generate(): string;
}
