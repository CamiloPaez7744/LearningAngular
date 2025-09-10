import { Gif } from '@gifs/interfaces/gif.interface';
import { GiphyItem } from '@gifs/interfaces/giphy.interface';

export class GifMapper {
  static mapGiphyToGif(giphyItem: GiphyItem): Gif {
    return {
      id: giphyItem.id,
      title: giphyItem.title,
      url: giphyItem.images.fixed_height.url
    };
  }

  static mapGiphyListToGifList(giphyItems: GiphyItem[]): Gif[] {
    return giphyItems.map(GifMapper.mapGiphyToGif);
  }
}
