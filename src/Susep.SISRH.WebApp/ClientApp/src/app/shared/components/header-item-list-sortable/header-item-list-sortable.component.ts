import { Component, EventEmitter, Output, Self, Optional, Input, OnInit } from '@angular/core';
import { ISortConfig } from '../../models/sortConfig.model';

@Component({
  selector: '[header-item-list-sortable]',
  templateUrl: './header-item-list-sortable.component.html',
  styleUrls: ['./header-item-list-sortable.component.css'],
})
export class HeaderItemListSortable implements OnInit {
  @Input() description: string;
  @Input() key: string;
  @Input() sortConfig: ISortConfig;
  @Output() fnSortListEvent = new EventEmitter<string>();
  

  constructor() { }

ngOnInit() {
  }

  onChangeSort() {
    this.fnSortListEvent.emit(this.key);
  }

  isUp() {
    return this.sortConfig.key===this.key && this.sortConfig.order==='desc';
  }

  isDown() {
    return this.sortConfig.key===this.key && this.sortConfig.order==='asc';
  }

}