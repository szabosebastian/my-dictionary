import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-upsert-collection',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './upsert-collection.component.html',
  styleUrls: ['./upsert-collection.component.scss']
})
export class UpsertCollectionComponent implements OnInit {

  @Input() existingCollection?: Collection;

  form = this.fb.group(
    {
      id: this.fb.control(""),
      name: this.fb.nonNullable.control("", [Validators.required]),
      requiredSuccessfulNumber: this.fb.nonNullable.control(0), //todo 1 vagy nagyobb
      numberOfTextOption: this.fb.nonNullable.control(0),
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
    if (this.existingCollection) {
      this.form.controls.id.patchValue(this.existingCollection.id);
      this.form.controls.name.patchValue(this.existingCollection.name);
      this.form.controls.requiredSuccessfulNumber.patchValue(this.existingCollection.result.requiredSuccessfulNumber);
      this.form.controls.numberOfTextOption.patchValue(this.existingCollection.gameSettings.numberOfAnswerOption);
      this.form.controls.onlyOriginalText.patchValue(this.existingCollection.gameSettings.onlyOriginalText);
      this.form.controls.onlyTranslatedText.patchValue(this.existingCollection.gameSettings.onlyTranslatedText);
    }

    this.dictionaryService.getDictionaries().forEach(dictionary => {
      const willBeAdded = this.existingCollection?.dictionaryIds.includes(dictionary.id);
      this.form.controls.dictionaries.push(
        this.fb.group({
          id: this.fb.nonNullable.control(dictionary.id),
          name: this.fb.nonNullable.control(dictionary.name),
          willBeAdded: this.fb.nonNullable.control(willBeAdded),
        })
      );
    });
  }

  createCollection() {
    const collectionId = this.existingCollection?.id || uuid();
    const upsertCollection: Collection = {
      id: collectionId,
      name: this.form.controls.name.getRawValue(),
      result: {
        id: uuid(),
        requiredSuccessfulNumber: this.form.controls.requiredSuccessfulNumber.getRawValue() || 1, //todo nem biztos h jo hogy itt defaultolunk
        status: GameResultStatus.PENDING,
        successfulCounter: 0,
        failCounter: 0
      },
      gameSettings: {
        id: uuid(),
        failedAttemptNumber: 3, //TODO
        numberOfAnswerOption: this.form.controls.numberOfTextOption.getRawValue() || 4, //todo nem biztos h jo hogy itt defaultolunk
        onlyTranslatedText: this.form.controls.onlyTranslatedText.getRawValue(),
        onlyOriginalText: this.form.controls.onlyOriginalText.getRawValue()
      },
      dictionaryIds: this.form.controls.dictionaries.controls
        .filter(dictionaryControls => dictionaryControls.controls?.['willBeAdded'].value)
        .map(dictionaryControls => dictionaryControls.controls?.['id'].value)
    };

    if (this.existingCollection) {
      this.collectionService.updateCollection(upsertCollection);
    } else {
      this.collectionService.addCollection(upsertCollection);
    }

    this.modalCtrl.dismiss(null, 'confirm');
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  log() {
    console.log(this.form.getRawValue());
    console.log(this.existingCollection);
  }
}
