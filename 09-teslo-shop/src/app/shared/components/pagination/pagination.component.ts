import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input<number>(0);
  currentPage = input<number>(1);
  maxPagesToShow = input<number>(4);

  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    const total = this.pages();
    const current = this.activePage();
    const max = this.maxPagesToShow();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    pages.push(1);

    let start = Math.max(2, current - 2);
    let end = Math.min(total - 1, current + 2);

    if (current <= 4) {
      start = 2;
      end = 5;
    } else if (current >= total - 3) {
      start = total - 4;
      end = total - 1;
    }

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');

    pages.push(total);

    return pages;
  });

  onPageChange(action: 'prev' | 'next' | number) {
    let page = this.activePage();
    if (action === 'prev') {
      page = Math.max(1, page - 1);
    } else if (action === 'next') {
      page = Math.min(this.pages(), page + 1);
    } else if (typeof action === 'number') {
      page = action;
    }
    this.activePage.set(page);
  }
 }
