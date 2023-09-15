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
import { IonicModule, ModalController } from "@ionic/angular";

import { sampleSize, shuffle } from "lodash";

@Component({
  selector: 'app-guessing-game',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './guessing-game.component.html',
  styleUrls: ['./guessing-game.component.scss']
})
export class GuessingGameComponent implements OnInit {
  @Input() collection!: Collection;

  viewModel$ = this.store.select(selectWorkbook);

  guessingGame: GuessingGame = {
    id: uuid(),
    texts: [],
    failedAttemptCounter: 0,
    result: GameResultStatus.PENDING
  };
  //todo: jojjon kintrol collectionbol
  textFailedAttemptNumber = 2;
  isGameFinished = false;

  currentGameText!: GuessingGameText;
  answerOptions: GuessingGameAnswerOption[] = [];
  pickedAnswer?: GuessingGameAnswerOption;

  get showGameTextCounter() {
    return this.guessingGame.texts.length;
  }

  get showGameSuccessfulTextCounter() {
    return this.guessingGame.texts.filter(text => text.isSuccessful).length;
  }

  get showCurrentTextValue(): string {
    if (this.currentGameText.isOriginalText) {
      return this.currentGameText.text.originalText;
    }
    return this.currentGameText.text.translatedText;
  }

  constructor(
    private store: Store,
    private dictionaryService: DictionaryService,
    private modalCtrl: ModalController
  ) {
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
          failedAttemptCounter: 0,
          isOriginalText: this.decideTextTypeIsOriginal(), //TODO
          isSuccessful: false,
          text: rawText
        };
      });
    }
    this.setCurrentGameTextToRandom();
    this.setAnswerOptions(this.currentGameText);
  }

  //todo rendes nev
  decideTextTypeIsOriginal(): boolean {
    if (this.collection?.gameSettings.onlyOriginalText === true && this.collection?.gameSettings.onlyTranslatedText === false) {
      return true;
    }

    if (this.collection?.gameSettings.onlyOriginalText === false && this.collection?.gameSettings.onlyTranslatedText === true) {
      return false;
    }

    if (this.collection?.gameSettings.onlyOriginalText === false && this.collection?.gameSettings.onlyTranslatedText === false) {
      return true;
    }

    return Math.random() < 0.5;
  }

  setAnswerOptions(currentText: GuessingGameText) {
    this.answerOptions = [];
    //push the correct answer
    this.answerOptions.push(
      {
        id: currentText.id,
        answer: currentText.isOriginalText ? currentText.text.translatedText : currentText.text.originalText
      }
    );

    let filteredAnswers = this.guessingGame.texts
      .filter(text => text.id !== currentText.id)
      .map(text => {
        return {
          id: text.id,
          answer: currentText.isOriginalText ? text.text.translatedText : text.text.originalText
        };
      });

    //push other random answers
    filteredAnswers = sampleSize(filteredAnswers, (this.collection?.gameSettings.numberOfAnswerOption! - 1));

    this.answerOptions.push(...filteredAnswers);

    //shuffle answers
    this.answerOptions = shuffle(this.answerOptions);
  }

  //todo jo hely a jatek vegere
  setCurrentGameTextToRandom() {
    const values = this.guessingGame.texts
      .filter(text => !text.isSuccessful && (!text.isSuccessful && text.failedAttemptCounter <= this.textFailedAttemptNumber));
    //todo itt befejezzük a játékot, ha a text-en lévő hibák száma eléri a maxot akkor is legyen vége
    if (values.length === 0 || this.isGameFailedAttemptCounterReachedMax()) {
      this.isGameFinished = true;
      console.log("vége a játéknak");
      return;
    }

    // get random unsuccessful text
    this.currentGameText = sampleSize(values, 1)[0];
  }

  isGameFailedAttemptCounterReachedMax() {
    return this.guessingGame.failedAttemptCounter >= this.collection.gameSettings.failedAttemptNumber;
  }

  getAnswerColorClasses(currentAnswer: GuessingGameAnswerOption) {
    if (this.pickedAnswer && currentAnswer.id === this.currentGameText.id) {
      return "success";
    } else if (this.pickedAnswer && currentAnswer.id === this.pickedAnswer.id && this.pickedAnswer.id !== this.currentGameText.id) {
      return "danger";
    }
    return "primary";
  }

  pickAnswer(answer: GuessingGameAnswerOption) {
    this.pickedAnswer = answer;

    //todo lehessen next-elni ha nem választott?
    if (this.pickedAnswer.id === this.currentGameText.id) {
      console.log("jó válasz");
      this.guessingGame.texts = this.guessingGame.texts.map(text => {
        if (text.id === this.pickedAnswer?.id) {
          return {
            ...text, isSuccessful: true
          };
        }
        return text;
      });
    }

    if (this.pickedAnswer.id !== this.currentGameText.id) {
      console.log("rossz válasz", this.guessingGame.failedAttemptCounter + 1);
      const currentTextInGuessingGameTextArray = this.guessingGame.texts.find(text => text.id === this.currentGameText.id);
      let index = this.guessingGame.texts.indexOf(currentTextInGuessingGameTextArray!);

      this.guessingGame.texts[index].failedAttemptCounter = this.guessingGame.texts[index].failedAttemptCounter + 1;
      this.guessingGame.failedAttemptCounter = this.guessingGame.failedAttemptCounter + 1;
    }
  }

  nextRound() {
    if (this.pickedAnswer) {
      this.setCurrentGameTextToRandom();
      this.setAnswerOptions(this.currentGameText);
      this.pickedAnswer = undefined;
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  log() {
    console.log(this.collection);
    console.log(this.guessingGame);
    console.log(this.currentGameText);
    console.log(this.answerOptions);
    console.log(this.isGameFailedAttemptCounterReachedMax());
  }
}
