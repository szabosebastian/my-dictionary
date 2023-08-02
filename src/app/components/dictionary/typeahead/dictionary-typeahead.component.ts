import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { Dictionary } from "../../../core/model/workbook";

@Component({
  selector: 'app-typeahead',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './dictionary-typeahead.component.html',
  styleUrls: ['./dictionary-typeahead.component.scss']
})
export class DictionaryTypeaheadComponent implements OnInit {
  @Input() items: Dictionary[] = [];
  @Input() selectedItem: Dictionary = {} as Dictionary;
  @Input() title = '';

  filteredDictionaries: Dictionary[] = [];

  constructor(
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.filteredDictionaries = [...this.items];
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(dic: Dictionary) {
    return this.modalCtrl.dismiss(
      dic,
      'confirm');
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredDictionaries = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredDictionaries = this.items.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }
}
