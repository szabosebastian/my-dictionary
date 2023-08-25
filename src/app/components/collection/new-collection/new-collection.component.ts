import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from "@ionic/angular";
import { selectWorkbook } from "../../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DictionaryService } from "../../../core/services/dictionary.service";
import { CollectionService } from "../../../core/services/collection.service";
import { Collection, GameResultStatus } from "../../../core/model/workbook";
import { v4 as uuid } from "uuid";

@Component({
  selector: 'app-new-collection',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.scss']
})
export class NewCollectionComponent implements OnInit {

  form = this.fb.group(
    {
      id: this.fb.control(""),
      name: this.fb.nonNullable.control("", [Validators.required]),
      requiredSuccessfulNumber: this.fb.nonNullable.control(undefined), //todo 1 vagy nagyobb
      numberOfTextOption: this.fb.nonNullable.control(undefined),
      onlyOriginalText: this.fb.nonNullable.control(false),
      onlyTranslatedText: this.fb.nonNullable.control(false),
      dictionaries: this.fb.array<FormGroup>([])
    }
  );

  viewModel$ = this.store.select(selectWorkbook);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private dictionaryService: DictionaryService,
    private collectionService: CollectionService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit(): void {
    this.dictionaryService.getDictionaries().forEach(dictionary => {
      this.form.controls.dictionaries.push(
        this.fb.group({
          id: this.fb.nonNullable.control(dictionary.id),
          name: this.fb.nonNullable.control(dictionary.name),
          willBeAdded: this.fb.nonNullable.control(false),
        })
      );
    });
  }

  addCollection() {
    console.log(this.form.valid);
    const newCollection: Collection = {
      id: uuid(),
      name: this.form.controls.name.getRawValue(),
      texts: [], //todo szerintem nem fog kelleni
      result: {
        id: uuid(),
        requiredSuccessfulNumber: this.form.controls.requiredSuccessfulNumber.getRawValue() || 1, //todo nem biztos h jo hogy itt defaultolunk
        status: GameResultStatus.PENDING,
        successful: 0,
        failed: 0
      },
      gameSettings: {
        id: uuid(),
        numberOfTextOption: this.form.controls.numberOfTextOption.getRawValue() || 4, //todo nem biztos h jo hogy itt defaultolunk
        onlyTranslatedText: this.form.controls.onlyTranslatedText.getRawValue(),
        onlyOriginalText: this.form.controls.onlyOriginalText.getRawValue()
      },
      dictionaryIds: this.form.controls.dictionaries.controls
        .filter(dictionaryControls => dictionaryControls.controls?.['willBeAdded'].value)
        .map(dictionaryControls => dictionaryControls.controls?.['id'].value)
    };
    this.collectionService.addCollection(newCollection);

    this.modalCtrl.dismiss(null, 'confirm');
  }

  log() {
    console.log(this.form.getRawValue());
  }
}
