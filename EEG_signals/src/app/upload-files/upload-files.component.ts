import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent {

  @Output() xmlFileUploaded = new EventEmitter<File>();
  @Output() jsonFileUploaded = new EventEmitter<File>();

  onXMLFileChange(event: any): void {
    const file = event.target.files[0];
    this.xmlFileUploaded.emit(file);
  }

  onJSONFileChange(event: any): void {
    const file = event.target.files[0];
    this.jsonFileUploaded.emit(file);
  }
}
