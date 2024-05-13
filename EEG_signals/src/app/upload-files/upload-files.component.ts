import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent {

  @Output() xmlFileUploaded = new EventEmitter<File>();
  @Output() jsonFileUploaded = new EventEmitter<File>();

  // Method to handle uploading when a new XML file is uploaded
  onXMLFileChange(event: any): void {
    const file = event.target.files[0];
    this.xmlFileUploaded.emit(file);
  }

  // Method to handle uploading when a new JSON file is uploaded
  onJSONFileChange(event: any): void {
    const file = event.target.files[0];
    this.jsonFileUploaded.emit(file);
  }
}
