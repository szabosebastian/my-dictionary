import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Collection,
  GameResultStatus,
  GuessingGame,
  GuessingGameAnswerOption,
  GuessingGameText,
  Text
} from "../../../core/model/workbook";
import { selectWorkbook } from "../../../state/workbook/workbook.selector";
import { Store } from "@ngrx/store";
import { v4 as uuid } from "uuid";
import { DictionaryService } from "../../../core/services/dictionary.service";
import { IonicModule } from "@ionic/angular";
import { FormBuilder } from "@angular/forms";

import { sampleSize } from "lodash";

@Component({
  selector: 'app-guessing-game',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './guessing-game.component.html',
  styleUrls: ['./guessing-game.component.scss']
})
export class GuessingGameComponent implements OnInit {

  @Input() collection?: Collection;

  viewModel$ = this.store.select(selectWorkbook);

  guessingGame: GuessingGame = {
    id: uuid(),
    texts: [],
    failedAttemptNumber: 0,
    result: GameResultStatus.PENDING
  };

  currentGameText!: GuessingGameText;

  // answerOptions: GuessingGameAnswerOption[] = [];
  answerOptions: GuessingGameAnswerOption[] = [];

  constructor(
    private store: Store,
    private dictionaryService: DictionaryService,
    private fb: FormBuilder
  ) {
  }

  setAnswerOptions(currentText: GuessingGameText) {
    this.answerOptions = [];
    this.answerOptions.push(
      {
        id: currentText.id,
        answer: currentText.originalText ? currentText.text.translatedText : currentText.text.translatedText
      }
    );
    let filteredAnswers = this.guessingGame.texts
      .filter(text => text.id !== currentText.id)
      .map(text => {
        return {
          id: text.id,
          answer: currentText.originalText ? text.text.translatedText : text.text.translatedText
        };
      });

    filteredAnswers = sampleSize(filteredAnswers, 3);

    this.answerOptions.push(...filteredAnswers);
  }

  ngOnInit() {
    if (this.collection) {
      const textsFromDictionaries: Text[] = [];
      this.collection.dictionaryIds.forEach(dictionaryId => {
        const dictionaries = this.dictionaryService.getDictionaries();
        textsFromDictionaries.push(...(dictionaries.find(dId => dId.id === dictionaryId)?.texts || []));
      });
      this.guessingGame.texts = textsFromDictionaries.map(rawText => {
        return {
          id: uuid(),
          failedAttemptNumber: 0,
          originalText: true, //TODO
          successful: false,
          text: rawText
        };
      });
    }
    this.currentGameText = sampleSize(this.guessingGame.texts, 1)[0];
    this.setAnswerOptions(this.currentGameText);
  }

  log() {
    console.log(this.collection);
    console.log(this.guessingGame);
  }
}
