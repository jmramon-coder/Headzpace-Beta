export interface ImageConfig {
  type: 'curated' | 'custom';
  id?: string;
  url: string;
  blur: number;
  opacity: number;
}

export type Background = {
  type: 'image';
  image: ImageConfig;
};