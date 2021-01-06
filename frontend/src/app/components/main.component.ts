import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CanLeaveRoute } from '../canLeave.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, CanLeaveRoute {

  commentsForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.commentsForm = this.fb.group({
      comments: this.fb.control('')
    })
  }

  canLeave() {
    return (!this.commentsForm.dirty)
  }
}
