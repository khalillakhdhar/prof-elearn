import { Component, OnInit } from '@angular/core';
import { MatiereService } from 'src/app/core/services/matiere.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectlistComponent implements OnInit {
  quizzes: any[] = [];
  selectedQuiz: any[] = [];
  currentQuestionIndex: number = 0;
  userAnswers: string[] = [];
  showResults: boolean = false;
  score: number;
  retryChapters: Set<string> = new Set();
  retryQuestions: any[] = [];
  breadCrumbItems: Array<{}>;
  img = "../../../../assets/images/companies/img-1.png";

  constructor(private matiereService: MatiereService) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Quizz' }, { label: 'List', active: true }];
  }

  loadQuiz(fileName: string) {
    this.matiereService.readQuiz(fileName).subscribe(data => {
      this.quizzes = data;
      this.startQuiz();
    });
  }

  startQuiz() {
    this.selectedQuiz = this.getRandomQuizzes(this.quizzes, 20); // Get 20 random questions
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.showResults = false;
    this.retryQuestions = [];
    this.retryChapters.clear();
  }

  getRandomQuizzes(quizzes: any[], count: number): any[] {
    const shuffled = quizzes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  submitAnswer(answer: string) {
    this.userAnswers.push(answer);
    if (this.currentQuestionIndex < this.selectedQuiz.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.calculateResults();
    }
  }

  calculateResults() {
    this.showResults = true;
    let correctAnswers = 0;
    for (let i = 0; i < this.selectedQuiz.length; i++) {
      if (this.userAnswers[i] === this.selectedQuiz[i].correct_answer) {
        correctAnswers++;
      } else {
        this.retryChapters.add(this.selectedQuiz[i].chapter);
      }
    }
    this.score = (correctAnswers / this.selectedQuiz.length) * 100;

    if (this.score < 100) {
      this.prepareRetryQuestions();
    }
  }

  prepareRetryQuestions() {
    this.retryQuestions = this.quizzes.filter(quiz => this.retryChapters.has(quiz.chapter));
  }

  retryQuiz() {
    this.selectedQuiz = this.getRandomQuizzes(this.retryQuestions, 20);
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.showResults = false;
  }
}
