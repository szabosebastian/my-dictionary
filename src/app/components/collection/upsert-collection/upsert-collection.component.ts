import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from "@ionic/angular";
import { selectWorkbook } from "../../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DictionaryService } from "../../../core/services/dictionary.service";
import { CollectionService } from "../../../core/services/collection.service";
import { Collection, GameResultStatus, GameType } from "../../../core/model/workbook";
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

  //TODO: validation
  form = this.fb.group(
    {
      id: this.fb.control(""),
      name: this.fb.nonNullable.control("", [Validators.required]),
      requiredSuccessfulNumber: this.fb.nonNullable.control(1),
      dictionaries: this.fb.array<FormGroup>([]),
      guessingGameModeNumberOfAnswerOption: this.fb.nonNullable.control(4),
      guessingGameModeIsTargetTextOriginal: this.fb.nonNullable.control(false),
      guessingGameModeIsTargetTextTranslated: this.fb.nonNullable.control(false),
      guessingGameMode: this.fb.nonNullable.control(false)
    }
  );

  viewModel$ = this.store.select(selectWorkbook);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private dictionaryService: DictionaryService,
    private collectionService: CollectionService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
  }

  ngOnInit(): void {
    if (this.existingCollection) {
      this.form.controls.id.patchValue(this.existingCollection.id);
      this.form.controls.name.patchValue(this.existingCollection.name);
      this.form.controls.requiredSuccessfulNumber.patchValue(this.existingCollection.result.requiredSuccessfulNumber);

      var existingGuessingGameMode = this.existingCollection.gameSettings.find(gameSetting => gameSetting.type === GameType.GUESSING_GAME);

      if (existingGuessingGameMode) {
        this.form.controls.guessingGameMode.patchValue(true);
        this.form.controls.guessingGameModeIsTargetTextOriginal.patchValue(existingGuessingGameMode.isTargetTextOriginal);
        this.form.controls.guessingGameModeIsTargetTextTranslated.patchValue(existingGuessingGameMode.isTargetTextTranslated);
        this.form.controls.guessingGameModeNumberOfAnswerOption.patchValue(existingGuessingGameMode.numberOfAnswerOption);
      }
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
    //TODO: if more game modes exists, add it here
    if (!this.form.controls.guessingGameMode.getRawValue()) {
      this.noGameModeSelectedToast();
      return;
    }

    if (this.existingCollection) {
      this.collectionService.updateCollection(this.updatedCollection(this.existingCollection));
    } else {
      this.collectionService.addCollection(this.createCollectionModel());
    }

    this.modalCtrl.dismiss(null, 'confirm');
  }

  //TODO: form validation?
  async noGameModeSelectedToast() {
    const toast = await this.toastController.create({
      message: 'Select at least one game mode!',
      duration: 2000,
      position: "bottom",
    });

    await toast.present();
  }

  updatedCollection(existingCollection: Collection): Collection {
    const result = {
      id: existingCollection.id,
      name: this.form.controls.name.getRawValue(),
      result: {
        id: existingCollection.result.id,
        status: existingCollection.result.status,
        failCounter: existingCollection.result.failCounter,
        successfulCounter: existingCollection.result.successfulCounter,
        requiredSuccessfulNumber: this.form.controls.requiredSuccessfulNumber.getRawValue()
      },
      gameSettings: [],
      dictionaryIds: this.form.controls.dictionaries.controls
        .filter(dictionaryControls => dictionaryControls.controls?.['willBeAdded'].value)
        .map(dictionaryControls => dictionaryControls.controls?.['id'].value)
    };

    this.updateExistingGuessingGameMode(existingCollection, result);
    //TODO: update other game mode
    return result;
  }

  updateExistingGuessingGameMode(existingCollection: Collection, resultCollection: Collection): void {
    var existingGuessingGameMode = existingCollection.gameSettings.find(gameSetting => gameSetting.type == GameType.GUESSING_GAME);

    if (this.form.controls.guessingGameMode.getRawValue() && existingGuessingGameMode) {
      resultCollection.gameSettings.push({
        id: existingGuessingGameMode.id,
        failedAttemptNumber: existingGuessingGameMode.failedAttemptNumber,
        type: existingGuessingGameMode.type,
        numberOfAnswerOption: this.form.controls.guessingGameModeNumberOfAnswerOption.getRawValue(),
        isTargetTextOriginal: this.form.controls.guessingGameModeIsTargetTextOriginal.getRawValue(),
        isTargetTextTranslated: this.form.controls.guessingGameModeIsTargetTextTranslated.getRawValue()
      });
    } else {
      this.addGuessingGameMode(resultCollection);
    }
  }

  createCollectionModel(): Collection {
    const result = {
      id: uuid(),
      name: this.form.controls.name.getRawValue(),
      result: {
        id: uuid(),
        requiredSuccessfulNumber: this.form.controls.requiredSuccessfulNumber.getRawValue(),
        status: GameResultStatus.PENDING,
        successfulCounter: 0,
        failCounter: 0
      },
      gameSettings: [],
      dictionaryIds: this.form.controls.dictionaries.controls
        .filter(dictionaryControls => dictionaryControls.controls?.['willBeAdded'].value)
        .map(dictionaryControls => dictionaryControls.controls?.['id'].value)
    };

    this.addGuessingGameMode(result);

    return result;
  }

  addGuessingGameMode(resultCollection: Collection): void {
    if (this.form.controls.guessingGameMode.getRawValue()) {
      resultCollection.gameSettings.push({
        id: uuid(),
        failedAttemptNumber: 0,
        type: GameType.GUESSING_GAME,
        numberOfAnswerOption: this.form.controls.guessingGameModeNumberOfAnswerOption.getRawValue(),
        isTargetTextOriginal: this.form.controls.guessingGameModeIsTargetTextOriginal.getRawValue(),
        isTargetTextTranslated: this.form.controls.guessingGameModeIsTargetTextTranslated.getRawValue()
      });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  log() {
    console.log(this.form.getRawValue());
    console.log(this.existingCollection);
  }
}
