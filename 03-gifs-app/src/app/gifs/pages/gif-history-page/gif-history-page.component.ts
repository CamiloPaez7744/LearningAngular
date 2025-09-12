import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { GifService } from '@gifs/services/gif.service';
import { map } from 'rxjs';
import { GifListComponent } from "@gifs/components/gif-list/gif-list.component";

@Component({
  selector: 'app-gif-history-page',
  imports: [GifListComponent],
  templateUrl: './gif-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifHistoryPageComponent {

  gifService = inject(GifService);
  // query = inject(ActivatedRoute).snapshot.paramMap.get('query') ?? '';
  // query = inject(ActivatedRoute).params.subscribe(params => {
  //   console.log(params['query']);
  // });
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map((params) => params['query'] ?? '')
    )
  )

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));

}
